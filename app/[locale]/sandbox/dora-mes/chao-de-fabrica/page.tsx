// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Send, ChevronRight, AlertTriangle, Users, RotateCcw, Package, SplitSquareHorizontal, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import {
  subscribeToOrders,
  updateOrderStatus,
  rollbackOrderStatus,
  generateBundlesFromCut,
  splitBundle,
  updateBundleStatus
} from '@/services/dora/op-service';
import { ProductionOrder, StageStatus, ProductionBundle, BundleStatus } from '@/types';
import CuttingModal from '@/components/dora/ui/cutting-modal';

// ─── Status metadata ──────────────────────────────────────────────────────────

const STATUS_META: Record<StageStatus, {
  label: string;
  color: string;
  textColor: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  btnGradient: string;
}> = {
  FILA: {
    label: 'FILA DE ESPERA',
    color: 'border-l-factory-alert',
    textColor: 'text-factory-alert',
    badgeBg: 'bg-amber-500/15 border-amber-500/30 text-factory-alert',
    borderColor: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.3)',
    btnGradient: 'linear-gradient(135deg, #1F2937, #111827)',
  },
  ENFESTO_CORTE: {
    label: 'ENFESTO / CORTE',
    color: 'border-l-factory-cut',
    textColor: 'text-factory-cut',
    badgeBg: 'bg-blue-500/15 border-blue-500/30 text-factory-cut',
    borderColor: '#3B82F6',
    glowColor: 'rgba(59,130,246,0.35)',
    btnGradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  },
  COSTURA: {
    label: 'COSTURA',
    color: 'border-l-factory-sew',
    textColor: 'text-factory-sew',
    badgeBg: 'bg-teal-500/15 border-teal-500/30 text-factory-sew',
    borderColor: '#14B8A6',
    glowColor: 'rgba(20,184,166,0.35)',
    btnGradient: 'linear-gradient(135deg, #14B8A6, #0D9488)',
  },
  REVISAO_QC: {
    label: 'REVISÃO / QC',
    color: 'border-l-factory-qc',
    textColor: 'text-factory-qc',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-factory-qc',
    borderColor: '#10B981',
    glowColor: 'rgba(16,185,129,0.35)',
    btnGradient: 'linear-gradient(135deg, #10B981, #059669)',
  },
  FINALIZADO: {
    label: 'FINALIZADO',
    color: 'border-l-factory-done',
    textColor: 'text-factory-done',
    badgeBg: 'bg-violet-500/15 border-violet-500/30 text-factory-done',
    borderColor: '#8B5CF6',
    glowColor: 'rgba(139,92,246,0.3)',
    btnGradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
  },
};

const NEXT_STATUS: Partial<Record<StageStatus, StageStatus>> = {
  FILA: 'ENFESTO_CORTE',
  ENFESTO_CORTE: 'COSTURA',
  COSTURA: 'REVISAO_QC',
  REVISAO_QC: 'FINALIZADO',
};

const ACTION_LABEL: Partial<Record<StageStatus, string>> = {
  FILA: 'INICIAR ENFESTO / CORTE',
  ENFESTO_CORTE: 'FINALIZAR CORTE → COSTURA',
  COSTURA: 'FINALIZAR COSTURA → QC',
  REVISAO_QC: 'APROVAR & FINALIZAR OP',
};

const ROLLBACK_STATUSES: Set<StageStatus> = new Set(['ENFESTO_CORTE', 'COSTURA', 'REVISAO_QC']);

// ─── WhatsApp helper ──────────────────────────────────────────────────────────

function openWhatsAppRomaneio(order: ProductionOrder) {
  const fabricDescription = [order.fabricType, order.fabricComposition].filter(Boolean).join(' · ');
  const text =
    `*OP:* ${order.opNumber} | *Ref:* ${order.modelReference}\n` +
    `*Cliente:* ${order.clientName}\n` +
    `*Modelo:* ${order.modelDescription}\n` +
    `*Peças:* ${order.totalEstimatedPieces.toLocaleString('pt-BR')} pçs\n` +
    `*Tecido:* ${fabricDescription}\n` +
    `*Status:* ${STATUS_META[order.status].label}\n` +
    `_Gerado via Dora MES_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden h-52 skeleton" />
  );
}

// ─── Bundle Panel ─────────────────────────────────────────────────────────────

const SEAMSTRESSES = ['Ivanilde', 'Araceli', 'Leila', 'Gorete', 'Facção Externa', '+ Outra'];

function BundlePanel({ order }: { order: ProductionOrder }) {
  const [splittingBundle, setSplittingBundle] = useState<string | null>(null);
  const [splitQuantity, setSplitQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const bundles = order.bundles || [];

  const handleGenerate = async () => {
    setLoading(true);
    await generateBundlesFromCut(order.id);
    setLoading(false);
  };

  const handleSplit = async (bundle: ProductionBundle) => {
    setError('');
    const qty = parseInt(splitQuantity, 10);
    if (isNaN(qty) || qty <= 0 || qty >= bundle.quantity) { setError('Quantidade inválida.'); return; }
    setLoading(true);
    try { await splitBundle(order.id, bundle.id, qty); setSplittingBundle(null); setSplitQuantity(''); }
    catch (e: any) { setError(e.message || 'Erro ao dividir.'); }
    finally { setLoading(false); }
  };

  const cycleStatus = async (bundle: ProductionBundle) => {
    setLoading(true);
    let next: BundleStatus = 'EM_COSTURA';
    if (bundle.status === 'EM_COSTURA') next = 'CONCLUIDO';
    else if (bundle.status === 'CONCLUIDO') next = 'AGUARDANDO';
    await updateBundleStatus(order.id, bundle.id, next);
    setLoading(false);
  };

  const handleOperatorChange = async (bundle: ProductionBundle, op: string) => {
    await updateBundleStatus(order.id, bundle.id, bundle.status, op);
  };

  if (bundles.length === 0) {
    return (
      <div className="mt-4 p-4 rounded-xl flex flex-col items-center gap-3"
           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <Package size={24} className="text-text-muted" />
        <p className="text-sm font-semibold text-text-secondary">Nenhum fardo gerado</p>
        <button
          onPointerDown={handleGenerate}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-black text-factory-sew bg-teal-500/10 border border-teal-500/20 active:scale-[0.98] transition-all"
        >
          {loading ? 'Gerando...' : 'Gerar Fardos (Automático)'}
        </button>
      </div>
    );
  }

  const completed = bundles.filter(b => b.status === 'CONCLUIDO').length;
  const pct = Math.round((completed / bundles.length) * 100);

  return (
    <div className="mt-4 pt-4 border-t border-white/8 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
          <Package size={13} /> Fardos ({bundles.length})
        </h3>
        <span className="text-[10px] font-black text-factory-sew bg-teal-500/10 border border-teal-500/20 px-2 py-1 rounded-full">
          {completed}/{bundles.length} · {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #14B8A6, #10B981)' }}
        />
      </div>

      <div className="space-y-2">
        {bundles.map(bundle => (
          <div
            key={bundle.id}
            className={`rounded-xl p-3 flex flex-col gap-3 transition-all duration-200 ${
              bundle.status === 'CONCLUIDO'
                ? 'bg-emerald-500/8 border border-emerald-500/20'
                : 'border border-white/8'
            }`}
            style={bundle.status !== 'CONCLUIDO' ? { background: 'rgba(255,255,255,0.03)' } : {}}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-black font-mono text-text-primary uppercase">
                  {bundle.color} — {bundle.size}
                </p>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mt-0.5">
                  {bundle.bundleCode} · {bundle.quantity} pçs
                </p>
              </div>
              <div className="flex items-center gap-2">
                {bundle.status !== 'CONCLUIDO' && (
                  <button
                    onPointerDown={() => setSplittingBundle(splittingBundle === bundle.id ? null : bundle.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-white/8 transition-all"
                    title="Dividir"
                  >
                    <SplitSquareHorizontal size={16} />
                  </button>
                )}
                <button
                  onPointerDown={() => cycleStatus(bundle)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all min-w-[100px] text-center ${
                    bundle.status === 'AGUARDANDO' ? 'bg-white/8 text-text-secondary border border-white/10' :
                    bundle.status === 'EM_COSTURA' ? 'bg-teal-500/15 text-factory-sew border border-teal-500/25' :
                    'text-white border-0'
                  }`}
                  style={bundle.status === 'CONCLUIDO' ? {
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    boxShadow: '0 0 10px rgba(16,185,129,0.35)'
                  } : {}}
                >
                  {bundle.status === 'AGUARDANDO' ? 'AGUARDANDO' :
                   bundle.status === 'EM_COSTURA' ? 'EM COSTURA' :
                   <span className="flex items-center justify-center gap-1"><CheckCircle2 size={13}/> PRONTO</span>}
                </button>
              </div>
            </div>

            {splittingBundle === bundle.id && (
              <div className="rounded-xl p-3 flex flex-col gap-2"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-bold text-text-secondary">Quantas peças retirar para um novo fardo?</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={splitQuantity}
                    onChange={e => setSplitQuantity(e.target.value)}
                    placeholder={`Máx ${bundle.quantity - 1}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-black text-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                  />
                  <button
                    onPointerDown={() => handleSplit(bundle)}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl text-sm font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
                  >
                    Dividir
                  </button>
                </div>
                {error && <p className="text-xs text-factory-scrap font-bold">{error}</p>}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Users size={13} className="text-text-muted shrink-0" />
              <select
                value={bundle.seamstressOperator || ''}
                onChange={e => handleOperatorChange(bundle, e.target.value)}
                className="text-xs font-semibold bg-transparent text-text-secondary focus:outline-none cursor-pointer flex-1 py-1"
              >
                <option value="">Atribuir operadora...</option>
                {SEAMSTRESSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        onPointerDown={handleGenerate}
        className="text-xs text-text-muted font-bold flex items-center justify-center w-full py-2 gap-2 hover:text-text-secondary transition-colors"
      >
        <RefreshCw size={12} /> Regerar Fardos
      </button>
    </div>
  );
}

// ─── Action Panel ─────────────────────────────────────────────────────────────

interface ActionPanelProps {
  order: ProductionOrder;
  onTransition: (order: ProductionOrder, next: StageStatus) => Promise<void>;
  onRollback: (id: string, current: StageStatus) => Promise<void>;
  onStartCutting: (order: ProductionOrder) => void;
  transitioning: boolean;
}

function ActionPanel({ order, onTransition, onRollback, onStartCutting, transitioning }: ActionPanelProps) {
  const nextStatus = NEXT_STATUS[order.status];
  const actionLabel = ACTION_LABEL[order.status];
  const canRollback = ROLLBACK_STATUSES.has(order.status);
  const meta = STATUS_META[order.status];

  const isCostura = order.status === 'COSTURA';
  const bundles = order.bundles || [];
  const allBundlesCompleted = bundles.length > 0 && bundles.every(b => b.status === 'CONCLUIDO');

  if (!nextStatus || !actionLabel) return null;

  const handleTransition = async () => {
    if (order.status === 'ENFESTO_CORTE') { onStartCutting(order); return; }
    if (isCostura && !allBundlesCompleted) {
      const ok = window.confirm(`Apenas ${bundles.filter(b => b.status === 'CONCLUIDO').length} de ${bundles.length} fardos concluídos. Avançar mesmo assim?`);
      if (!ok) return;
    }
    await onTransition(order, nextStatus);
  };

  const handleRollback = async () => {
    if (window.confirm(`Voltar a OP-${order.opNumber} para o estágio anterior?`)) await onRollback(order.id, order.status);
  };

  return (
    <div className="pt-4 mt-4 border-t border-white/8 space-y-3">
      {isCostura && <BundlePanel order={order} />}

      <div className="flex gap-2 mt-3">
        {/* Primary action button */}
        <button
          id={`action-${order.id}`}
          onPointerDown={handleTransition}
          disabled={transitioning}
          className="touch-target-industrial flex-1 h-14 rounded-xl font-black text-sm tracking-widest uppercase
                     text-white flex items-center justify-center gap-2
                     active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
          style={{
            background: meta.btnGradient,
            boxShadow: `0 0 20px ${meta.glowColor}`,
          }}
          aria-label={actionLabel}
        >
          {transitioning ? (
            <span className="opacity-70">Atualizando...</span>
          ) : (
            <>
              <Zap size={16} className="shrink-0" />
              {actionLabel}
              <ChevronRight size={16} className="shrink-0" />
            </>
          )}
        </button>

        {/* Rollback button */}
        {canRollback && (
          <button
            id={`rollback-${order.id}`}
            onPointerDown={handleRollback}
            disabled={transitioning}
            className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0
                       text-text-muted hover:text-text-secondary
                       active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-label="Voltar etapa"
            title="Voltar etapa anterior"
          >
            <RotateCcw size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChaoDesFabricaPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cuttingOrder, setCuttingOrder] = useState<ProductionOrder | null>(null);
  const [today] = useState(() =>
    new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  );

  useEffect(() => {
    const unsubscribe = subscribeToOrders(all => {
      setOrders(all.filter(op => !op.isDeleted && op.status !== 'FILA' && op.status !== 'FINALIZADO'));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const withTransitionGuard = useCallback(
    async (id: string, fn: () => Promise<void>) => {
      setTransitioning(prev => ({ ...prev, [id]: true }));
      setErrors(prev => ({ ...prev, [id]: '' }));
      try { await fn(); }
      catch { setErrors(prev => ({ ...prev, [id]: 'Erro ao atualizar. Tente novamente.' })); }
      finally { setTransitioning(prev => ({ ...prev, [id]: false })); }
    },
    []
  );

  const handleTransition = useCallback(
    (order: ProductionOrder, next: StageStatus) =>
      withTransitionGuard(order.id, async () => {
        await updateOrderStatus(order.id, next);
        if (next === 'COSTURA' && (!order.bundles || order.bundles.length === 0)) {
          await generateBundlesFromCut(order.id);
        }
      }),
    [withTransitionGuard]
  );

  const handleRollback = useCallback(
    (id: string, current: StageStatus) =>
      withTransitionGuard(id, () => rollbackOrderStatus(id, current)),
    [withTransitionGuard]
  );

  return (
    <main className="p-4 pb-24 space-y-4 max-w-2xl mx-auto">
      {/* ── Header ── */}
      <header className="pb-4 border-b border-app-border flex items-start justify-between gap-4">
        <div>
          <h1 className="font-black text-2xl tracking-tight text-text-primary leading-tight">
            Produção
          </h1>
          <p className="text-xs text-text-secondary mt-1 capitalize">{today} · Toque para avançar a etapa</p>
        </div>
        <div
          className="shrink-0 mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs text-white"
          style={{ background: 'linear-gradient(135deg, #14B8A6, #0D9488)', boxShadow: '0 0 14px rgba(20,184,166,0.4)' }}
        >
          {loading ? '—' : orders.length} {orders.length === 1 ? 'OP' : 'OPs'}
        </div>
      </header>

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
               style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)' }}>
            <ChevronRight size={32} className="text-factory-sew" />
          </div>
          <div>
            <p className="font-black text-text-primary text-lg">Tudo em dia!</p>
            <p className="text-sm text-text-secondary mt-1">Nenhum pedido em produção no momento.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {orders.map(order => {
            const meta = STATUS_META[order.status];
            const isTransitioning = !!transitioning[order.id];
            const cardError = errors[order.id];

            return (
              <article
                key={order.id}
                className="rounded-2xl overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              >
                {/* Left status glow border */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{
                    background: meta.borderColor,
                    boxShadow: `0 0 16px ${meta.glowColor}`,
                  }}
                />

                <div className="pl-6 pr-4 pt-4 pb-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h2 className="font-mono font-black text-xl text-text-primary tracking-tight">
                          OP-{order.opNumber}
                        </h2>
                        <span className="text-xs font-mono font-bold text-text-muted">
                          Ref: {order.modelReference}
                        </span>
                      </div>
                      <p className="text-text-secondary font-semibold text-sm mt-0.5 truncate">{order.clientName}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`wa-${order.id}`}
                        onPointerDown={() => openWhatsAppRomaneio(order)}
                        className="h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-[0.97]"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                        title="Enviar via WhatsApp"
                      >
                        <Send size={14} className="text-green-400" />
                      </button>
                      {order.priority === 'URGENTE' && (
                        <AlertTriangle size={18} className="text-factory-scrap animate-pulse-glow" />
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${meta.badgeBg}`}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Metrics */}
                  <dl className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { dt: 'Peças Est.', dd: `${order.totalEstimatedPieces.toLocaleString('pt-BR')}`, unit: 'pçs' },
                      { dt: 'Tecido', dd: `${order.totalFabricWeightKg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`, unit: 'kg' },
                      { dt: 'Rend.', dd: `${order.nominalYieldRatio.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`, unit: 'pç/kg' },
                    ].map(m => (
                      <div key={m.dt} className="rounded-xl px-3 py-2"
                           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <dt className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{m.dt}</dt>
                        <dd className="font-mono font-black text-text-primary text-base leading-none mt-1">
                          {m.dd}
                          <span className="text-[10px] font-normal text-text-muted ml-1">{m.unit}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {/* Fabric info */}
                  <p className="text-text-muted text-xs mt-2">
                    {[order.fabricType, order.fabricComposition].filter(Boolean).join(' · ')}
                    {order.modelDescription ? ` — ${order.modelDescription}` : ''}
                  </p>

                  {/* Error */}
                  {cardError && (
                    <div className="flex items-center gap-2 mt-3 rounded-xl px-3 py-2"
                         style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <AlertTriangle size={14} className="text-factory-scrap shrink-0" />
                      <p className="text-xs text-factory-scrap font-medium">{cardError}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <ActionPanel
                    order={order}
                    onTransition={handleTransition}
                    onRollback={handleRollback}
                    onStartCutting={o => setCuttingOrder(o)}
                    transitioning={isTransitioning}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {cuttingOrder && (
        <CuttingModal
          order={cuttingOrder}
          onClose={() => setCuttingOrder(null)}
          onSuccess={() => setCuttingOrder(null)}
        />
      )}
    </main>
  );
}
