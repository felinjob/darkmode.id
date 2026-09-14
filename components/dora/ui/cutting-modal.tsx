// @ts-nocheck
'use client';

import { useState } from 'react';
import { ProductionOrder } from '@/types';
import { finishCuttingAndGenerateBundles } from '@/services/dora/op-service';
import { Scissors, X, CheckCircle2, Info } from 'lucide-react';

interface CuttingModalProps {
  order: ProductionOrder;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass = `w-full text-center font-black text-lg font-mono bg-white/8 border border-white/15
  rounded-xl py-2.5 text-text-primary focus:ring-2 focus:ring-blue-500/50 focus:outline-none
  focus:border-blue-500/50 transition-all duration-150 [appearance:textfield]
  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

export default function CuttingModal({ order, onClose, onSuccess }: CuttingModalProps) {
  const [loading, setLoading] = useState(false);
  const [operatorCount, setOperatorCount] = useState<string>('');

  const [grid, setGrid] = useState(() => {
    if (order.fabrics && order.fabrics.length > 0) {
      return order.fabrics.map(f => ({
        ...f,
        matrixGrid: f.matrixGrid.map((v: any) => ({
          ...v,
          sizes: Object.fromEntries(
            Object.entries(v.sizes).map(([s, d]: [string, any]) => [s, { ...d, realCut: d.estimated }])
          )
        }))
      }));
    }
    return (order.matrixGrid || []).map(v => ({
      ...v,
      sizes: Object.fromEntries(
        Object.entries(v.sizes).map(([s, d]: [string, any]) => [s, { ...d, realCut: d.estimated }])
      )
    }));
  });

  const handleSave = async () => {
    setLoading(true);
    let total = 0;
    const isMultiFabric = order.fabrics && order.fabrics.length > 0;

    if (isMultiFabric) {
      (grid as any[]).forEach(f => {
        f.matrixGrid.forEach((v: any) => {
          let variantTotal = 0;
          Object.values(v.sizes).forEach((d: any) => { variantTotal += Number(d.realCut) || 0; });
          v.totalRealCut = variantTotal;
          total += variantTotal;
        });
      });
    } else {
      (grid as any[]).forEach((v: any) => {
        let variantTotal = 0;
        Object.values(v.sizes).forEach((d: any) => { variantTotal += Number(d.realCut) || 0; });
        v.totalRealCut = variantTotal;
        total += variantTotal;
      });
    }

    try {
      await finishCuttingAndGenerateBundles(
        order.id,
        isMultiFabric ? undefined : (grid as any),
        isMultiFabric ? (grid as any) : undefined,
        total,
        operatorCount ? parseInt(operatorCount, 10) : undefined
      );
      onSuccess();
    } catch (e) {
      console.error(e);
      alert('Erro ao confirmar corte. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateRealCut = (fabricIdx: number, variantIdx: number, size: string, value: number, isMulti: boolean) => {
    setGrid((prev: any) => {
      const next = [...prev];
      if (isMulti) {
        next[fabricIdx].matrixGrid[variantIdx].sizes[size].realCut = value;
      } else {
        next[variantIdx].sizes[size].realCut = value;
      }
      return next;
    });
  };

  const isMultiFabric = order.fabrics && order.fabrics.length > 0;

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const colorHeaderStyle = {
    background: 'rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
         style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[92vh]"
           style={{ background: '#0D1526', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 -20px 60px rgba(0,0,0,0.6)' }}>

        {/* ── Header ── */}
        <div className="px-5 py-4 flex items-center justify-between"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 0 14px rgba(59,130,246,0.4)' }}>
              <Scissors size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-text-primary text-sm tracking-tight">Confirmar Corte</h2>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">OP-{order.opNumber}</p>
            </div>
          </div>
          <button onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
            <X size={18} />
          </button>
        </div>

        {/* ── Info banner ── */}
        <div className="mx-5 mt-4 rounded-xl p-3 flex items-start gap-2.5"
             style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <Info size={14} className="text-factory-cut shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-factory-cut leading-relaxed">
            Informe a quantidade real cortada. Os fardos de costura serão gerados automaticamente.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {isMultiFabric ? (
            (grid as any[]).map((fabric: any, fIdx: number) => (
              <div key={fIdx} className="space-y-3">
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest pb-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  Tecido {fIdx + 1}{fabric.fabricType ? ` · ${fabric.fabricType}` : ''}
                </h3>
                {fabric.matrixGrid.map((v: any, vIdx: number) => (
                  <div key={vIdx} className="rounded-xl overflow-hidden" style={cardStyle}>
                    <div className="px-4 py-2.5" style={colorHeaderStyle}>
                      <span className="text-xs font-black text-text-primary uppercase tracking-widest">{v.color}</span>
                    </div>
                    <div className="p-3 grid grid-cols-3 gap-2">
                      {Object.entries(v.sizes).map(([s, data]: [string, any]) => (
                        <div key={s} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-text-muted uppercase">{s}</span>
                            <span className="text-[9px] font-bold text-text-muted">est. {data.estimated}</span>
                          </div>
                          <input
                            type="number" inputMode="numeric" min="0"
                            value={data.realCut}
                            onChange={e => updateRealCut(fIdx, vIdx, s, parseInt(e.target.value) || 0, true)}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            (grid as any[]).map((v: any, vIdx: number) => (
              <div key={vIdx} className="rounded-xl overflow-hidden" style={cardStyle}>
                <div className="px-4 py-2.5" style={colorHeaderStyle}>
                  <span className="text-xs font-black text-text-primary uppercase tracking-widest">{v.color}</span>
                </div>
                <div className="p-3 grid grid-cols-3 gap-2">
                  {Object.entries(v.sizes).map(([s, data]: [string, any]) => (
                    <div key={s} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-text-muted uppercase">{s}</span>
                        <span className="text-[9px] font-bold text-text-muted">est. {data.estimated}</span>
                      </div>
                      <input
                        type="number" inputMode="numeric" min="0"
                        value={data.realCut}
                        onChange={e => updateRealCut(0, vIdx, s, parseInt(e.target.value) || 0, false)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Costureiras */}
          <div className="rounded-xl p-4" style={cardStyle}>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-3">
              Costureiras no Grupo (opcional)
            </label>
            <input
              type="number" inputMode="numeric" min="1"
              value={operatorCount}
              onChange={e => setOperatorCount(e.target.value)}
              placeholder="Ex: 4"
              className={`${inputClass} text-base`}
            />
            <p className="text-[10px] text-text-muted text-center mt-2">
              Usado para distribuir os fardos automaticamente
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full h-14 rounded-xl font-black text-sm text-white uppercase tracking-widest
                       flex items-center justify-center gap-2 active:scale-[0.98] transition-all
                       disabled:opacity-50 disabled:pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
          >
            {loading ? 'Salvando...' : (
              <>
                <CheckCircle2 size={18} />
                Confirmar e Gerar Fardos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
