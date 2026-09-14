// @ts-nocheck
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, AlertTriangle, Printer, MessageCircle, Edit2, Save, CheckCircle2 } from 'lucide-react';
import { getProductionOrderById, updateProductionOrder } from '@/services/dora/op-service';
import { ProductionSheetPdf } from '@/components/dora/ui/production-sheet-pdf';
import { ProductionOrder, StatusHistoryEntry, StageStatus } from '@/types';
const Timestamp = typeof window !== 'undefined' ? (window as any).MockTimestamp : class { static now() { return { toDate: () => new Date() } } static fromDate(d: any) { return { toDate: () => d } } };
import Link from 'next/link';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<StageStatus, string> = {
  FILA:          'Fila de Espera',
  ENFESTO_CORTE: 'Corte',
  COSTURA:       'Costura',
  REVISAO_QC:    'Revisão',
  FINALIZADO:    'Finalizado',
};

const STATUS_META: Record<StageStatus, { color: string; bg: string; border: string; glow: string }> = {
  FILA:          { color: 'text-factory-alert',  bg: 'bg-amber-500/15',   border: 'border-amber-500/30',   glow: 'rgba(245,158,11,0.3)' },
  ENFESTO_CORTE: { color: 'text-factory-cut',    bg: 'bg-blue-500/15',    border: 'border-blue-500/30',    glow: 'rgba(59,130,246,0.3)' },
  COSTURA:       { color: 'text-factory-sew',    bg: 'bg-teal-500/15',    border: 'border-teal-500/30',    glow: 'rgba(20,184,166,0.3)' },
  REVISAO_QC:    { color: 'text-factory-qc',     bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', glow: 'rgba(16,185,129,0.3)' },
  FINALIZADO:    { color: 'text-factory-done',   bg: 'bg-violet-500/15',  border: 'border-violet-500/30',  glow: 'rgba(139,92,246,0.3)' },
};

const STATUS_DOT: Record<StageStatus, string> = {
  FILA:          'bg-factory-alert',
  ENFESTO_CORTE: 'bg-factory-cut',
  COSTURA:       'bg-factory-sew',
  REVISAO_QC:    'bg-factory-qc',
  FINALIZADO:    'bg-factory-done',
};

function formatTimestamp(ts: any): string {
  if (!ts) return '—';
  if (ts instanceof Timestamp) return ts.toDate().toLocaleString('pt-BR');
  if (ts?.seconds) return new Date(ts.seconds * 1000).toLocaleString('pt-BR');
  if (ts instanceof Date) return ts.toLocaleString('pt-BR');
  return String(ts);
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
};

const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm
  text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/40
  focus:border-blue-500/40 transition-all duration-150`;

// ─── Timeline entry ───────────────────────────────────────────────────────────

function TimelineEntry({ entry }: { entry: StatusHistoryEntry }) {
  const isRollback = entry.reason?.toLowerCase().includes('rollback');
  const meta = STATUS_META[entry.to] ?? STATUS_META.FILA;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${isRollback ? 'bg-factory-scrap' : STATUS_DOT[entry.to] ?? 'bg-white/30'}`} />
        <div className="w-px flex-1 mt-1.5" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
      <div className="pb-5 min-w-0">
        <p className="text-sm font-bold text-text-primary">
          {STATUS_LABEL[entry.from]} → {STATUS_LABEL[entry.to]}
          {isRollback && (
            <span className={`ml-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${meta.bg} ${meta.border} text-factory-scrap`}>
              Revertido
            </span>
          )}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{formatTimestamp(entry.timestamp)}</p>
        {entry.reason && !isRollback && (
          <p className="text-xs text-text-secondary italic mt-0.5">{entry.reason}</p>
        )}
      </div>
    </div>
  );
}

// ─── Detail page ──────────────────────────────────────────────────────────────

export default function OrdemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<ProductionOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [notes, setNotes] = useState('');
  const [fabricSupplier, setFabricSupplier] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProductionOrderById(id).then(op => {
      if (!op) {
        setNotFound(true);
      } else {
        setOrder(op);
        setNotes(op.notes ?? '');
        setFabricSupplier(op.fabricSupplier ?? '');
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!id || !order) return;
    setSaving(true);
    try {
      await updateProductionOrder(id, { notes, fabricSupplier });
      setSaved(true);
      setOrder(prev => prev ? { ...prev, notes, fabricSupplier } : prev);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving order:', err);
    } finally {
      setSaving(false);
    }
  }, [id, order, notes, fabricSupplier]);

  if (loading) {
    return (
      <main className="p-4 pb-24 space-y-4">
        <div className="h-8 w-40 skeleton rounded-xl" />
        <div className="h-44 skeleton rounded-2xl" />
        <div className="h-32 skeleton rounded-2xl" />
        <div className="h-32 skeleton rounded-2xl" />
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="p-4 pb-24 flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
             style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <AlertTriangle size={32} className="text-factory-scrap" />
        </div>
        <p className="font-black text-text-primary text-lg">Ordem não encontrada</p>
        <button onClick={() => router.push('/pt/sandbox/dora-mes')}
                className="text-factory-cut font-semibold text-sm underline underline-offset-4">
          Voltar ao início
        </button>
      </main>
    );
  }

  let deadlineDate = '—';
  let deadlineStatus: React.ReactNode = null;

  if (order.timestamps.deadline) {
    deadlineDate = formatTimestamp(order.timestamps.deadline);
    if (order.status !== 'FINALIZADO') {
      const d = (order.timestamps.deadline as any).seconds
        ? new Date((order.timestamps.deadline as any).seconds * 1000)
        : new Date(order.timestamps.deadline as any);
      const diffDays = Math.ceil((d.getTime() - Date.now()) / (1000 * 3600 * 24));
      if (diffDays < 0) {
        deadlineStatus = <span className="ml-2 text-[9px] font-black bg-red-500/15 text-factory-scrap border border-red-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">Atrasado</span>;
      } else if (diffDays <= 3) {
        deadlineStatus = <span className="ml-2 text-[9px] font-black bg-amber-500/15 text-factory-alert border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">{diffDays}d restante{diffDays !== 1 ? 's' : ''}</span>;
      }
    }
  }

  const history: StatusHistoryEntry[] = [...(order.statusHistory ?? [])].sort((a, b) => {
    const ta = a.timestamp?.seconds ?? 0;
    const tb = b.timestamp?.seconds ?? 0;
    return ta - tb;
  });

  const statusMeta = STATUS_META[order.status];

  return (
    <main className="p-4 pb-24 space-y-4 max-w-2xl mx-auto">
      {/* ── Back + title ── */}
      <header className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          id="back-btn"
          onClick={() => router.back()}
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0
                     active:scale-[0.97] transition-all duration-150"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          aria-label="Voltar"
        >
          <ArrowLeft size={20} className="text-text-primary" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-mono font-black text-xl text-text-primary tracking-tight">OP-{order.opNumber}</h1>
          <p className="text-xs text-text-muted uppercase tracking-widest truncate">
            {order.modelReference} · {order.clientName}
          </p>
        </div>
        <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${statusMeta.bg} ${statusMeta.border} ${statusMeta.color}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </header>

      {/* ── Action Buttons ── */}
      <section className="flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex-1 min-w-[120px] h-12 rounded-xl font-black text-xs tracking-widest uppercase text-white
                     flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <Printer size={16} />
          Imprimir
        </button>
        <Link
          href={`/pt/sandbox/dora-mes/ordens/${order.id}/editar`}
          className="flex-1 min-w-[120px] h-12 rounded-xl font-black text-xs tracking-widest uppercase
                     flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6' }}
        >
          <Edit2 size={16} />
          Editar OP
        </Link>
        <button
          onClick={() => {
            const text = `Ficha Técnica OP-${order.opNumber}\nRef: ${order.modelReference}\nCliente: ${order.clientName}\nAcesse o sistema para ver os detalhes completos.`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 active:scale-[0.97] transition-all"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
          aria-label="Compartilhar via WhatsApp"
        >
          <MessageCircle size={20} className="text-green-400" />
        </button>
      </section>

      {/* ── Print sheet ── */}
      <ProductionSheetPdf order={order} />

      {/* ── Interactive view ── */}
      <div className="space-y-4 print:hidden">

        {/* ── Identificação ── */}
        <section className="rounded-2xl p-4" style={cardStyle}>
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Identificação</h2>
          <dl className="grid grid-cols-2 gap-4">
            {[
              { dt: 'Cliente',        dd: order.clientName },
              { dt: 'Ref. Modelo',    dd: order.modelReference, mono: true },
              { dt: 'Descrição',      dd: order.modelDescription || '—' },
              { dt: 'Prazo',          dd: <span className="flex items-center flex-wrap gap-1">{deadlineDate}{deadlineStatus}</span> },
              { dt: 'Prioridade',     dd: order.priority, color: order.priority === 'URGENTE' ? 'text-factory-scrap' : 'text-text-primary' },
              { dt: 'Total de Peças', dd: `${order.totalEstimatedPieces.toLocaleString('pt-BR')} pçs`, mono: true },
            ].map(item => (
              <div key={item.dt}>
                <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">{item.dt}</dt>
                <dd className={`text-sm font-semibold ${(item as any).color || 'text-text-primary'} ${(item as any).mono ? 'font-mono font-black' : ''}`}>
                  {item.dd}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Tecido ── */}
        <section className="rounded-2xl p-4" style={cardStyle}>
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Tecido e Rendimento</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">Fornecedor</dt>
              <dd className="text-sm font-semibold text-text-primary">{order.fabricSupplier || '—'}</dd>
            </div>
            {[
              { dt: 'Composição',         dd: order.fabricComposition || '—' },
              { dt: 'Tipo de Malha',      dd: order.fabricType || '—' },
              { dt: 'Peso Total',         dd: `${order.totalFabricWeightKg.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} kg`, mono: true },
              { dt: 'Rendimento',         dd: `${order.nominalYieldRatio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pç/kg`, mono: true },
            ].map(item => (
              <div key={item.dt}>
                <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">{item.dt}</dt>
                <dd className={`text-sm font-semibold text-text-primary ${(item as any).mono ? 'font-mono font-black' : ''}`}>{item.dd}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Grade de Tamanhos ── */}
        <section className="rounded-2xl p-4" style={cardStyle}>
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Grade de Tamanhos</h2>
          {order.matrixGrid.length === 0 ? (
            <p className="text-sm text-text-muted">Nenhuma variante cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {order.matrixGrid.map((variant, vi) => {
                const sizes = Object.keys(variant.sizes);
                return (
                  <div key={vi} className="rounded-xl overflow-hidden"
                       style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="px-3 py-2.5 flex justify-between items-center"
                         style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="font-black text-sm text-text-primary uppercase tracking-widest">{variant.color}</span>
                      <span className="text-xs text-text-muted font-mono">
                        {variant.weightKg.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kg
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            {['Tam.', 'Est.', 'Cortado', 'Costurado', 'QC ✓'].map(h => (
                              <th key={h} className="px-3 py-2 font-black text-text-muted uppercase tracking-widest text-right first:text-left">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sizes.map(size => {
                            const s = variant.sizes[size];
                            return (
                              <tr key={size} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <td className="px-3 py-2 font-mono font-black text-text-primary">{size}</td>
                                <td className="px-3 py-2 font-mono tabular-nums text-right text-text-secondary">{s.estimated}</td>
                                <td className="px-3 py-2 font-mono tabular-nums text-right text-factory-cut">{s.realCut}</td>
                                <td className="px-3 py-2 font-mono tabular-nums text-right text-factory-sew">{s.readySewn}</td>
                                <td className="px-3 py-2 font-mono tabular-nums text-right text-factory-qc">{s.approvedQc}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                            <td className="px-3 py-2 font-black text-text-muted uppercase text-[10px] tracking-widest">Total</td>
                            <td className="px-3 py-2 font-mono font-black text-text-primary text-right tabular-nums">{variant.totalEstimated}</td>
                            <td className="px-3 py-2 font-mono font-black text-factory-cut text-right tabular-nums">{variant.totalRealCut}</td>
                            <td colSpan={2} />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Ajustes ── */}
        <section className="rounded-2xl p-4 space-y-4" style={cardStyle}>
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Ajustes e Anotações</h2>

          <div>
            <label htmlFor="edit-supplier" className="block text-xs font-bold text-text-secondary mb-1.5">
              Fornecedor de Tecido
            </label>
            <input
              id="edit-supplier"
              type="text"
              value={fabricSupplier}
              onChange={e => setFabricSupplier(e.target.value)}
              placeholder="Nome do fornecedor"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-notes" className="block text-xs font-bold text-text-secondary mb-1.5">
              Observações
            </label>
            <textarea
              id="edit-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Instruções especiais, referências, anotações..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            id="save-edit-btn"
            onClick={handleSave}
            disabled={saving}
            className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest text-white
                       flex items-center justify-center gap-2 active:scale-[0.98] transition-all
                       disabled:opacity-50 disabled:pointer-events-none"
            style={{ background: saving ? 'rgba(255,255,255,0.08)' : saved ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                     boxShadow: saved ? '0 0 16px rgba(16,185,129,0.4)' : '0 0 16px rgba(59,130,246,0.3)' }}
          >
            {saved ? <><CheckCircle2 size={16} /> Salvo!</> : saving ? 'Salvando...' : <><Save size={16} /> Salvar Alterações</>}
          </button>
        </section>

        {/* ── Histórico ── */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
            <Clock size={12} /> Histórico de Etapas
          </h2>

          <div className="rounded-2xl p-4" style={cardStyle}>
            {history.length === 0 ? (
              <p className="text-sm text-text-muted">Nenhuma transição registrada ainda.</p>
            ) : (
              <>
                {history.map((entry, idx) => (
                  <TimelineEntry key={idx} entry={entry} />
                ))}
                {/* Current status dot */}
                <div className="flex gap-3 items-center">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-[#0D1526] ${STATUS_DOT[order.status]}`} />
                  <p className={`text-sm font-black ${statusMeta.color}`}>
                    {STATUS_LABEL[order.status]} <span className="font-normal text-text-muted">(atual)</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
