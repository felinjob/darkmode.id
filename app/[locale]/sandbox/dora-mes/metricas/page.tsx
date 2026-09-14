// @ts-nocheck
'use client';

import { useEffect, useState, useMemo } from 'react';
import { subscribeToOrders } from '@/services/dora/op-service';
import { ProductionOrder, StageStatus } from '@/types';
import { BarChart3, AlertTriangle, Package, Users, Scissors, TrendingUp, Zap, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { useAuth } from '@/context/dora/auth-context';

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  gradient: string;
  glow: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

function KpiCard({ label, value, sub, gradient, glow, icon, trend, trendValue }: KpiCardProps) {
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden group hover:-translate-y-0.5 transition-transform duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.02)',
      }}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none transition-opacity group-hover:opacity-30"
           style={{ background: glow }} />

      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">{label}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
             style={{ background: gradient }}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <p className="font-mono font-black text-4xl text-text-primary tracking-tight leading-none">{value}</p>
        {trend && trendValue && (
          <span className={`flex items-center text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
            trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : trend === 'down' ? 'text-red-400 bg-red-500/10' : 'text-slate-400 bg-slate-500/10'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={10} /> : trend === 'down' ? <ArrowDownRight size={10} /> : null}
            {trendValue}
          </span>
        )}
      </div>
      
      {sub && <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-2">{sub}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MetricasPage() {
  const { role, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrders(all => { setOrders(all); setLoading(false); });
    return () => unsubscribe();
  }, []);

  const kpis = useMemo(() => {
    let piecesInProduction = 0;
    let piecesFinished = 0;
    let totalYieldRatio = 0;
    let yieldCount = 0;
    const bottleneck: Record<StageStatus, number> = { FILA: 0, ENFESTO_CORTE: 0, COSTURA: 0, REVISAO_QC: 0, FINALIZADO: 0 };
    let totalEstimatedCut = 0;
    let totalRealCut = 0;
    const bundleStatusCounts = { AGUARDANDO: 0, EM_COSTURA: 0, PASSADORIA: 0, REVISAO_QC: 0, CONCLUIDO: 0 };
    const seamstressStats: Record<string, { pieces: number; bundles: number }> = {};

    orders.forEach(op => {
      if (op.status === 'FINALIZADO') {
        piecesFinished += op.totalFinalApprovedPieces || op.totalEstimatedPieces;
      } else {
        piecesInProduction += op.totalEstimatedPieces;
        bottleneck[op.status] += op.totalEstimatedPieces;
      }
      if (op.nominalYieldRatio > 0) { totalYieldRatio += op.nominalYieldRatio; yieldCount++; }
      if (op.status !== 'FILA' && op.status !== 'ENFESTO_CORTE') {
        totalEstimatedCut += op.totalEstimatedPieces;
        totalRealCut += op.totalRealPiecesCut || op.totalEstimatedPieces;
      }
      if (op.bundles) {
        op.bundles.forEach(b => {
          if (bundleStatusCounts[b.status] !== undefined) bundleStatusCounts[b.status]++;
          if (b.status === 'CONCLUIDO' && b.seamstressOperator) {
            if (!seamstressStats[b.seamstressOperator]) seamstressStats[b.seamstressOperator] = { pieces: 0, bundles: 0 };
            seamstressStats[b.seamstressOperator].pieces += b.quantity;
            seamstressStats[b.seamstressOperator].bundles++;
          }
        });
      }
    });

    const averageYield = yieldCount > 0 ? totalYieldRatio / yieldCount : 0;
    let maxPieces = -1; let maxStatus: StageStatus | null = null;
    (Object.keys(bottleneck) as StageStatus[]).forEach(status => {
      if (status !== 'FINALIZADO' && bottleneck[status] > maxPieces) { maxPieces = bottleneck[status]; maxStatus = status; }
    });

    return {
      piecesInProduction, piecesFinished, averageYield, bottleneck, maxStatus, maxPieces,
      cutAdherence: { est: totalEstimatedCut, real: totalRealCut },
      bundleStatusCounts,
      seamstressRanking: Object.entries(seamstressStats)
        .map(([name, stats]) => ({ name, ...stats })).sort((a, b) => b.pieces - a.pieces),
    };
  }, [orders]);

  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'FINALIZADO').sort((a, b) => (a.timestamps.deadline?.seconds || 0) - (b.timestamps.deadline?.seconds || 0)).slice(0, 5), [orders]);

  const STATUS_LABELS: Record<string, string> = { FILA: 'Fila', ENFESTO_CORTE: 'Corte', COSTURA: 'Costura', REVISAO_QC: 'QC' };
  const STATUS_COLORS: Record<string, string> = { FILA: '#F59E0B', ENFESTO_CORTE: '#3B82F6', COSTURA: '#14B8A6', REVISAO_QC: '#10B981' };

  const totalActivePieces = kpis.piecesInProduction > 0 ? kpis.piecesInProduction : 1;
  const segments = [
    { key: 'FILA', label: 'Fila', color: '#F59E0B', pct: (kpis.bottleneck.FILA / totalActivePieces) * 100, count: kpis.bottleneck.FILA },
    { key: 'ENFESTO_CORTE', label: 'Corte', color: '#3B82F6', pct: (kpis.bottleneck.ENFESTO_CORTE / totalActivePieces) * 100, count: kpis.bottleneck.ENFESTO_CORTE },
    { key: 'COSTURA', label: 'Costura', color: '#14B8A6', pct: (kpis.bottleneck.COSTURA / totalActivePieces) * 100, count: kpis.bottleneck.COSTURA },
    { key: 'REVISAO_QC', label: 'Rev/QC', color: '#10B981', pct: (kpis.bottleneck.REVISAO_QC / totalActivePieces) * 100, count: kpis.bottleneck.REVISAO_QC },
  ];

  const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  };

  if (authLoading || loading) {
    return (
      <main className="p-4 pb-24 space-y-4 max-w-2xl mx-auto">
        <div className="h-10 w-64 skeleton rounded-xl mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
      </main>
    );
  }

  if (role !== 'admin') {
    return (
      <main className="p-4 pb-24 flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-red-500/10 border border-red-500/20">
          <AlertTriangle size={32} className="text-factory-scrap" />
        </div>
        <div>
          <p className="font-black text-text-primary text-xl tracking-tight">Acesso Restrito</p>
          <p className="text-sm text-text-secondary mt-1">Apenas gestores têm acesso a esta camada de dados.</p>
        </div>
      </main>
    );
  }

  const cutDiff = kpis.cutAdherence.est > 0 ? (kpis.cutAdherence.real / kpis.cutAdherence.est) - 1 : 0;
  const cutTrend = cutDiff > 0 ? 'up' : cutDiff < 0 ? 'down' : 'neutral';

  return (
    <main className="p-4 pb-24 space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* ── Header ── */}
      <header className="pb-2">
        <h1 className="font-black text-3xl tracking-tight text-text-primary flex items-center gap-3">
          <BarChart3 size={28} className="text-factory-cut" />
          Inteligência de Produção
        </h1>
        <p className="text-text-secondary text-sm mt-2 flex items-center gap-2">
          Visão Analítica e Desempenho <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </p>
      </header>

      {/* ── Main KPIs ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          label="Carga Ativa"
          value={kpis.piecesInProduction.toLocaleString('pt-BR')}
          sub="Volume total transitando no chão de fábrica"
          gradient="linear-gradient(135deg, #3B82F6, #2563EB)"
          glow="#3B82F6"
          icon={<Zap size={18} className="text-white" />}
        />
        <KpiCard
          label="Volume Finalizado"
          value={kpis.piecesFinished.toLocaleString('pt-BR')}
          sub="Peças expedidas para o cliente"
          gradient="linear-gradient(135deg, #10B981, #059669)"
          glow="#10B981"
          icon={<TrendingUp size={18} className="text-white" />}
        />
        <KpiCard
          label="Gargalo Atual"
          value={kpis.maxStatus && kpis.maxPieces > 0 ? STATUS_LABELS[kpis.maxStatus] : 'NENHUM'}
          sub={kpis.maxPieces > 0 ? `${kpis.maxPieces.toLocaleString('pt-BR')} pçs retidas nesta etapa` : 'Fluxo otimizado'}
          gradient="linear-gradient(135deg, #F59E0B, #D97706)"
          glow="#F59E0B"
          icon={<AlertTriangle size={18} className="text-white" />}
        />
        <KpiCard
          label="Rend. Médio"
          value={kpis.averageYield.toFixed(2)}
          sub="Peças extraídas por KG de malha"
          gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)"
          glow="#8B5CF6"
          icon={<Scissors size={18} className="text-white" />}
        />
      </section>

      {/* ── Gráfico: Volume por Setor ── */}
      <section className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} /> Pipeline da Manufatura
          </h3>
          <span className="text-[10px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">Live</span>
        </div>

        {/* Segmented bar Premium */}
        <div className="h-10 w-full rounded-2xl overflow-hidden flex mb-6 shadow-inner"
             style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {segments.map(s => s.pct > 0 && (
            <div
              key={s.key}
              style={{ width: `${s.pct}%`, background: s.color }}
              className="h-full transition-all duration-1000 ease-out relative group"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {segments.map(s => (
            <div key={s.key} className="flex flex-col items-center">
              <div className="w-10 h-1 rounded-full mb-3 transition-all" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 text-center">{s.label}</p>
              <p className="text-xl font-mono font-black text-text-primary">{s.count.toLocaleString('pt-BR')}</p>
              <p className="text-[9px] text-text-muted font-bold mt-1">{s.pct.toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Distribuição Analítica de Fardos & Aderência ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Aderência de Corte */}
        <section className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 mb-5">
            <Scissors size={14} /> Precisão de Corte
          </h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Peças Estimadas (PCP)</p>
              <p className="font-mono font-black text-2xl text-text-primary">{kpis.cutAdherence.est.toLocaleString('pt-BR')}</p>
            </div>
            
            <div className="w-full h-px bg-white/10" />
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-factory-cut font-black uppercase tracking-widest mb-1">Cortado Real</p>
                <p className="font-mono font-black text-3xl text-blue-400">{kpis.cutAdherence.real.toLocaleString('pt-BR')}</p>
              </div>
              
              <div className={`flex flex-col items-end ${cutTrend === 'up' ? 'text-emerald-400' : cutTrend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
                <span className="flex items-center gap-1 font-black text-lg">
                  {cutTrend === 'up' ? <ArrowUpRight size={18} /> : cutTrend === 'down' ? <ArrowDownRight size={18} /> : null}
                  {(cutDiff * 100).toFixed(1)}%
                </span>
                <span className="text-[9px] uppercase tracking-widest font-black opacity-70">Desvio</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fardos */}
        <section className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 mb-5">
            <Package size={14} /> Status de Fardos (Costura)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Em Costura', count: kpis.bundleStatusCounts.EM_COSTURA, color: '#14B8A6' },
              { label: 'Passadoria', count: kpis.bundleStatusCounts.PASSADORIA, color: '#F59E0B' },
              { label: 'Rev. QC', count: kpis.bundleStatusCounts.REVISAO_QC, color: '#10B981' },
              { label: 'Prontos', count: kpis.bundleStatusCounts.CONCLUIDO, color: '#8B5CF6' },
            ].map(b => (
              <div key={b.label} className="rounded-xl p-3" style={{ background: `${b.color}15`, border: `1px solid ${b.color}30` }}>
                <p className="font-mono font-black text-2xl mb-1" style={{ color: b.color }}>{b.count}</p>
                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: b.color }}>{b.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Ranking & OPs Críticas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ranking Operadoras */}
        <section className="rounded-2xl p-5" style={cardStyle}>
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 mb-5">
            <Users size={14} /> Ranking de Operadores
          </h3>
          {kpis.seamstressRanking.length === 0 ? (
            <div className="py-8 text-center text-text-muted text-sm border border-dashed border-white/10 rounded-xl">
              Nenhuma métrica registrada ainda.
            </div>
          ) : (
            <div className="space-y-4">
              {kpis.seamstressRanking.map((s, idx) => {
                const maxPieces = kpis.seamstressRanking[0].pieces;
                const pct = maxPieces > 0 ? (s.pieces / maxPieces) * 100 : 0;
                return (
                  <div key={s.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-black ${
                          idx === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-text-muted'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-text-primary">{s.name}</span>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="font-mono font-black text-emerald-400 text-sm">{s.pieces.toLocaleString('pt-BR')} pçs</span>
                        <span className="text-text-muted text-[9px] font-black uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
                          {s.bundles} fardos
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #10B981, #059669)' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* TOP OPs Mais Críticas */}
        <section className="rounded-2xl p-5 flex flex-col" style={cardStyle}>
          <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-2 mb-5">
            <AlertTriangle size={14} className="text-factory-alert" /> Próximas Entregas
          </h3>
          
          {activeOrders.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
              <p className="text-sm text-text-muted">Nenhuma OP pendente.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map(op => {
                let isLate = false;
                if (op.timestamps.deadline) {
                  const d = (op.timestamps.deadline as any).seconds ? (op.timestamps.deadline as any).seconds * 1000 : (op.timestamps.deadline as any);
                  if (d < Date.now()) isLate = true;
                }

                return (
                  <div key={op.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div>
                      <p className="font-mono font-black text-sm text-text-primary flex items-center gap-2">
                        OP-{op.opNumber}
                        {isLate && <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">Atrasada</span>}
                        {op.priority === 'URGENTE' && <Zap size={12} className="text-factory-scrap animate-pulse" />}
                      </p>
                      <p className="text-xs text-text-secondary font-semibold mt-0.5 truncate max-w-[150px] sm:max-w-[200px]">{op.clientName}</p>
                    </div>
                    
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm"
                            style={{ color: STATUS_COLORS[op.status] || '#9CA3AF', background: `${STATUS_COLORS[op.status] || '#9CA3AF'}20` }}>
                        {STATUS_LABELS[op.status] || op.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
