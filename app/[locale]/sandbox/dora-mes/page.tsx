'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Trash2, AlertTriangle, Clock, ChevronRight, RotateCcw, Layers, Zap, Activity } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type StageStatus = 'FILA' | 'ENFESTO_CORTE' | 'COSTURA' | 'REVISAO_QC' | 'FINALIZADO';
type Priority = 'NORMAL' | 'URGENTE';

interface ProductionOrder {
  id: string;
  opNumber: string;
  clientName: string;
  modelReference: string;
  totalEstimatedPieces: number;
  status: StageStatus;
  priority: Priority;
  timestamps: {
    deadline?: number;
  };
  deletedAt?: Date;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ORDERS: ProductionOrder[] = [
  { id: '1', opNumber: '1024', clientName: 'Zara Brasil', modelReference: 'VEST-ALFAIATARIA', totalEstimatedPieces: 1500, status: 'FILA', priority: 'NORMAL', timestamps: { deadline: Date.now() + 86400000 * 3 } },
  { id: '2', opNumber: '1025', clientName: 'Renner S/A', modelReference: 'BLUSA-TRICOT-V2', totalEstimatedPieces: 800, status: 'ENFESTO_CORTE', priority: 'URGENTE', timestamps: { deadline: Date.now() + 86400000 * 1 } },
  { id: '3', opNumber: '1026', clientName: 'C&A Modas', modelReference: 'CALCA-CARGO-BR', totalEstimatedPieces: 3200, status: 'COSTURA', priority: 'NORMAL', timestamps: { deadline: Date.now() - 86400000 * 2 } }, // Late
  { id: '4', opNumber: '1027', clientName: 'Riachuelo', modelReference: 'CAMISA-LINHO-01', totalEstimatedPieces: 450, status: 'REVISAO_QC', priority: 'URGENTE', timestamps: { deadline: Date.now() + 86400000 * 2 } },
  { id: '5', opNumber: '1020', clientName: 'Boutique Alto Verão', modelReference: 'SAIA-MIDI-FLORAL', totalEstimatedPieces: 300, status: 'FINALIZADO', priority: 'NORMAL', timestamps: { deadline: Date.now() - 86400000 * 5 } },
];

const MOCK_DELETED: ProductionOrder[] = [
  { id: '6', opNumber: '0999', clientName: 'Pedido Cancelado S/A', modelReference: 'TESTE-PILOTO', totalEstimatedPieces: 50, status: 'FILA', priority: 'NORMAL', timestamps: {}, deletedAt: new Date(Date.now() - 86400000 * 2) }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type TabView = 'ATIVAS' | 'HISTORICO' | 'LIXEIRA';

const STATUS_CONFIG: Record<StageStatus, { label: string; color: string; bg: string; glow: string; borderColor: string; stepIndex: number }> = {
  FILA:          { label: 'FILA',       color: 'text-amber-500', bg: 'bg-amber-500/15',   glow: 'rgba(245,158,11,0.25)',  borderColor: '#F59E0B', stepIndex: 0 },
  ENFESTO_CORTE: { label: 'CORTE',      color: 'text-blue-500',   bg: 'bg-blue-500/15',    glow: 'rgba(59,130,246,0.25)',  borderColor: '#3B82F6', stepIndex: 1 },
  COSTURA:       { label: 'COSTURA',    color: 'text-teal-500',   bg: 'bg-teal-500/15',    glow: 'rgba(20,184,166,0.25)',  borderColor: '#14B8A6', stepIndex: 2 },
  REVISAO_QC:    { label: 'REVISÃO',    color: 'text-emerald-500',    bg: 'bg-emerald-500/15', glow: 'rgba(16,185,129,0.25)',  borderColor: '#10B981', stepIndex: 3 },
  FINALIZADO:    { label: 'FINALIZADO', color: 'text-violet-500',  bg: 'bg-violet-500/15',  glow: 'rgba(139,92,246,0.15)',  borderColor: '#8B5CF6', stepIndex: 4 },
};

function formatOperationalDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

// ─── Order Card ───────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: ProductionOrder;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  onLiberar?: (e: React.MouseEvent) => void;
}

function OrderCard({ order, onClick, onDelete, onLiberar }: OrderCardProps) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.FILA;
  const isUrgent = order.priority === 'URGENTE';
  
  let isLate = false;
  if (order.timestamps.deadline && order.status !== 'FINALIZADO') {
    if (order.timestamps.deadline < Date.now()) isLate = true;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className="relative overflow-hidden rounded-2xl cursor-pointer select-none group transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.02)`,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 group-hover:w-1.5"
        style={{ background: cfg.borderColor, boxShadow: `0 0 16px ${cfg.glow}` }}
      />

      {isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-[2px] animate-pulse"
             style={{ background: 'linear-gradient(90deg, transparent, #EF4444, transparent)' }} />
      )}

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-mono font-black text-xl text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                OP-{order.opNumber}
              </p>
              {isLate && (
                <span className="text-[9px] font-black uppercase bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
                  Atrasada
                </span>
              )}
            </div>
            <p className="text-gray-400 font-semibold text-sm truncate">{order.clientName}</p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} uppercase tracking-widest shadow-sm`}>
              {cfg.label}
            </span>
            {isUrgent && (
              <span className="flex items-center gap-1 text-[10px] font-black text-red-500 animate-pulse">
                <AlertTriangle size={11} /> URGENTE
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 px-1">
            <span className={cfg.stepIndex >= 0 ? 'text-amber-500' : ''}>Fila</span>
            <span className={cfg.stepIndex >= 1 ? 'text-blue-500' : ''}>Corte</span>
            <span className={cfg.stepIndex >= 2 ? 'text-teal-500' : ''}>Costura</span>
            <span className={cfg.stepIndex >= 3 ? 'text-emerald-500' : ''}>QC</span>
            <span className={cfg.stepIndex >= 4 ? 'text-violet-500' : ''}>Pronto</span>
          </div>
          <div className="w-full h-1.5 rounded-full flex gap-1 bg-transparent">
            {[0, 1, 2, 3, 4].map((step) => {
              const isPast = cfg.stepIndex > step;
              const isCurrent = cfg.stepIndex === step;
              
              let stepBg = 'rgba(255,255,255,0.06)';
              if (isPast || isCurrent) {
                if (step === 0) stepBg = '#F59E0B';
                if (step === 1) stepBg = '#3B82F6';
                if (step === 2) stepBg = '#14B8A6';
                if (step === 3) stepBg = '#10B981';
                if (step === 4) stepBg = '#8B5CF6';
              }

              return (
                <div key={step} className="flex-1 h-full rounded-full transition-all duration-500"
                     style={{ 
                       background: stepBg, 
                       opacity: isCurrent ? 1 : isPast ? 0.4 : 1,
                       boxShadow: isCurrent ? `0 0 8px ${stepBg}80` : 'none'
                     }} 
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-white/5">
          <div>
            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
              <span className="font-mono text-xs font-bold uppercase">{order.modelReference}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Layers size={13} className="text-gray-500" />
              <span className="font-mono font-black text-sm">
                {order.totalEstimatedPieces.toLocaleString('pt-BR')} <span className="text-[10px] text-gray-500 uppercase">pçs</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={onDelete}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/5 hover:border-red-500/30
                           flex items-center justify-center text-gray-500 hover:text-red-400 transition-all"
                title="Mover para Lixeira"
              >
                <Trash2 size={15} />
              </button>
            )}
            
            {order.status === 'FILA' && onLiberar && (
              <button
                onClick={onLiberar}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white
                           transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}
              >
                Liberar Corte
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DoraMesSandbox() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [deletedOrders, setDeletedOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [tab, setTab] = useState<TabView>('ATIVAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [today] = useState(() => formatOperationalDate(new Date()));

  useEffect(() => {
    // Simulate network fetch
    const t = setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setDeletedOrders(MOCK_DELETED);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setIsSeeding(false);
    }, 1000);
  };

  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'FINALIZADO'), [orders]);
  
  const stats = useMemo(() => {
    let urgent = 0;
    let late = 0;
    let totalPieces = 0;
    const now = Date.now();

    activeOrders.forEach(o => {
      if (o.priority === 'URGENTE') urgent++;
      if (o.timestamps.deadline && o.timestamps.deadline < now) late++;
      totalPieces += o.totalEstimatedPieces;
    });

    return { urgent, late, totalPieces, active: activeOrders.length };
  }, [activeOrders]);

  const finishedOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders
      .filter(o => o.status === 'FINALIZADO')
      .filter(o => !q || o.opNumber.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q) || o.modelReference.toLowerCase().includes(q));
  }, [orders, searchQuery]);

  const displayOrders = tab === 'ATIVAS' ? activeOrders : finishedOrders;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('SANDBOX: Mover esta OP para a lixeira?')) {
      const orderToMove = orders.find(o => o.id === id);
      if (orderToMove) {
        setOrders(prev => prev.filter(o => o.id !== id));
        setDeletedOrders(prev => [{ ...orderToMove, deletedAt: new Date() }, ...prev]);
      }
    }
  };

  const handleLiberar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'ENFESTO_CORTE' } : o));
  };

  const restoreOrder = (id: string) => {
    const orderToRestore = deletedOrders.find(o => o.id === id);
    if (orderToRestore) {
      setDeletedOrders(prev => prev.filter(o => o.id !== id));
      setOrders(prev => [{ ...orderToRestore, deletedAt: undefined }, ...prev]);
    }
  };

  const permanentDeleteOrder = (id: string) => {
    setDeletedOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleCardClick = () => {
    alert("SANDBOX: Na aplicação real, isso abriria os detalhes da OP (Fardos, Relatórios de Qualidade e Linha do Tempo).");
  };

  return (
    <div className="min-h-screen bg-[#0A101C] text-gray-200 selection:bg-blue-500/30">
      <div className="w-full bg-blue-500/10 border-b border-blue-500/20 text-center py-2 text-xs font-mono text-blue-400">
        // SANDBOX INTERATIVO — DORA MES (MOCK DATA) //
      </div>
      
      <main className="p-4 pb-24 space-y-5 max-w-2xl mx-auto">
        {/* ── Executive Header ── */}
        <header className="pt-2 pb-2">
          <h1 className="font-black text-2xl tracking-tight text-white leading-tight">
            Painel de Controle
          </h1>
          <p className="text-xs text-gray-500 mt-1 capitalize flex items-center gap-1.5">
            <Activity size={12} className="text-emerald-500" />
            {today}
          </p>
        </header>

        {/* ── Actionable Alerts (Dashboard Feel) ── */}
        {!loading && stats.active > 0 && tab === 'ATIVAS' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl p-3 flex flex-col justify-center"
                 style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Volume</p>
              <p className="font-mono font-black text-xl text-white">{stats.totalPieces.toLocaleString('pt-BR')} <span className="text-xs font-bold text-gray-500">pçs</span></p>
            </div>
            
            <div className="rounded-2xl p-3 flex flex-col justify-center"
                 style={{ background: stats.urgent > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${stats.urgent > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${stats.urgent > 0 ? 'text-red-400' : 'text-gray-500'}`}>Urgentes</p>
              <div className="flex items-center gap-2">
                <p className="font-mono font-black text-xl text-white">{stats.urgent}</p>
                {stats.urgent > 0 && <Zap size={14} className="text-red-400 animate-pulse" />}
              </div>
            </div>

            <div className="rounded-2xl p-3 flex flex-col justify-center col-span-2 sm:col-span-1"
                 style={{ background: stats.late > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${stats.late > 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${stats.late > 0 ? 'text-amber-500' : 'text-gray-500'}`}>Atrasos</p>
              <p className="font-mono font-black text-xl text-white">{stats.late} <span className="text-xs font-bold text-gray-500">OPs</span></p>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 rounded-xl sticky top-2 z-10 backdrop-blur-md shadow-xl" 
             style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'ATIVAS', label: `Ativas (${stats.active})` },
            { id: 'HISTORICO', label: 'Concluídas' },
            { id: 'LIXEIRA', label: 'Lixeira' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id as TabView); if (t.id !== 'HISTORICO') setSearchQuery(''); }}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                tab === t.id ? 'text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
              style={tab === t.id ? {
                background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.2))',
                border: '1px solid rgba(59,130,246,0.3)',
              } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Search (Histórico) ── */}
        {tab === 'HISTORICO' && (
          <div className="relative animate-fade-in">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por número da OP, cliente..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm font-semibold
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40
                         transition-all duration-200 shadow-inner"
            />
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map(i => <div key={i} className="rounded-2xl h-44 bg-white/5 animate-pulse" />)}
          </div>
        ) : tab === 'LIXEIRA' ? (
          deletedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10">
                <Trash2 size={28} className="text-gray-600" />
              </div>
              <p className="text-gray-500 font-black text-sm uppercase tracking-widest">Lixeira vazia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deletedOrders.map(order => {
                const deletedDate = order.deletedAt || new Date();
                const expirationDate = new Date(deletedDate); expirationDate.setDate(expirationDate.getDate() + 7);
                const daysLeft = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 3600 * 24));

                return (
                  <div key={order.id} className="rounded-2xl p-4 opacity-75 hover:opacity-100 transition-opacity"
                       style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-mono font-black text-lg text-gray-400 line-through">OP-{order.opNumber}</p>
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
                        <Clock size={11} /> {Math.max(0, daysLeft)}d restantes
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm font-semibold mb-4">{order.clientName}</p>
                    <div className="flex gap-2">
                      <button onClick={() => restoreOrder(order.id)}
                              className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
                        <RotateCcw size={14} /> Restaurar
                      </button>
                      <button onClick={() => { if (confirm('Exclusão definitiva não pode ser desfeita. Confirmar?')) permanentDeleteOrder(order.id); }}
                              className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-red-400 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 active:scale-[0.98] transition-all">
                        Excluir p/ sempre
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : displayOrders.length === 0 && tab === 'ATIVAS' ? (
          <div className="rounded-3xl p-8 text-center space-y-5 mt-4 shadow-2xl"
               style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', boxShadow: '0 12px 24px rgba(59,130,246,0.4)' }}>
              <Layers size={32} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-xl tracking-tight">Fábrica Livre</p>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">Nenhuma ordem de produção em andamento. Adicione novas OPs para movimentar a produção.</p>
            </div>
            <button onClick={handleSeedData} disabled={isSeeding}
                    className="w-full mt-4 h-12 rounded-xl font-black text-xs uppercase tracking-widest text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
              {isSeeding ? 'Carregando Dados...' : 'Restaurar Dados Iniciais'}
            </button>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <p className="text-gray-500 font-black uppercase tracking-widest text-sm">
              {tab === 'HISTORICO' && searchQuery ? 'Nenhuma OP encontrada.' : 'Nenhuma OP finalizada.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in pt-1">
            {displayOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={handleCardClick}
                onDelete={tab === 'ATIVAS' ? (e) => handleDelete(e, order.id) : undefined}
                onLiberar={tab === 'ATIVAS' ? (e) => handleLiberar(e, order.id) : undefined}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
