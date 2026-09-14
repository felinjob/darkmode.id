// @ts-nocheck
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
const Timestamp = typeof window !== 'undefined' ? (window as any).MockTimestamp : class { static now() { return { toDate: () => new Date() } } static fromDate(d: any) { return { toDate: () => d } } };
import { PlusCircle, Trash2, ChevronDown, AlertTriangle, Scale, Layers, Calculator, Check, X, FilePlus2 } from 'lucide-react';
import Numpad from '@/components/dora/ui/numpad';
import { createProductionOrder } from '@/services/dora/op-service';
import { MatrixGridVariant, UniformModelType, Priority, FabricEntry } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'G1', 'G2', 'G3'] as const;
type SizeKey = typeof ALL_SIZES[number];

const MODEL_OPTIONS = [
  { value: 'CAMISETA_BASICA', label: 'Camiseta Básica' },
  { value: 'POLO_PIQUET', label: 'Polo Piquet' },
  { value: 'POLO_MANGA_LONGA', label: 'Polo Manga Longa' },
  { value: 'CALCA_BRIM', label: 'Calça Brim' },
  { value: 'REGATA_DRY', label: 'Regata Dry-Fit' },
  { value: 'OUTRO', label: '+ Outro modelo...' },
];

const FABRIC_COMPOSITIONS = [
  '100% ALGODÃO',
  '100% POLIÉSTER',
  '50% ALGODÃO 50% POLI',
  'VISCOSE',
  'MALHA PV',
  'OUTRO',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SizeEntry { estimated: number; }

interface ColorVariantDraft {
  id: string;
  color: string;
  weightKg: string;
  sizes: Partial<Record<SizeKey, SizeEntry>>;
  showProportionTool?: boolean;
  proportions?: Partial<Record<SizeKey, string>>;
}

interface FabricDraft {
  id: string;
  fabricSupplier: string;
  fabricComposition: string;
  customFabricComposition: string;
  fabricType: string;
  totalWeightKg: string;
  yieldRatio: string;
  variants: ColorVariantDraft[];
}

interface ActiveCell {
  fabricId: string;
  variantId: string;
  size: SizeKey | '__weightKg';
  label: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9); }

function generateOpNumber(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const seq = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `${yy}${mm}-${seq}`;
}

function emptyVariant(id?: string): ColorVariantDraft {
  return { id: id || uid(), color: '', weightKg: '', sizes: { M: { estimated: 0 }, G: { estimated: 0 } } };
}

function emptyFabric(id?: string, variantId?: string): FabricDraft {
  return {
    id: id || uid(),
    fabricSupplier: '',
    fabricComposition: FABRIC_COMPOSITIONS[0],
    customFabricComposition: '',
    fabricType: '',
    totalWeightKg: '',
    yieldRatio: '',
    variants: [emptyVariant(variantId)],
  };
}

function sizeDisplayValue(variant: ColorVariantDraft, size: SizeKey): string {
  const entry = variant.sizes[size];
  if (!entry || entry.estimated === 0) return '';
  return String(entry.estimated);
}

function clampPositiveNumber(value: string): string {
  if (!value) return '';
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return '0';
  return value;
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-text-primary
  placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
  transition-all duration-150`;

const inputMonoClass = `${inputClass} font-mono font-black text-lg`;

const selectClass = `w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-3
  text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
  transition-all duration-150 pr-10`;

const labelClass = `block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1.5`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function NovaOpPage() {
  const router = useRouter();

  const [opNumber, setOpNumber] = useState<string>('');
  useEffect(() => setOpNumber(generateOpNumber()), []);

  const [modelReference, setModelReference] = useState('');
  const [clientName, setClientName] = useState('');
  const [modelType, setModelType] = useState<string>('CAMISETA_BASICA');
  const [customModelType, setCustomModelType] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('NORMAL');
  const [deadlineDate, setDeadlineDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  const [fabrics, setFabrics] = useState<FabricDraft[]>([emptyFabric('fab-default-1', 'var-default-1')]);

  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const activeCellRef = useRef<ActiveCell | null>(null);
  const [numpadValue, setNumpadValue] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { totalFabricWeightKg, totalEstimatedPieces } = useMemo(() => {
    let weight = 0; let pieces = 0;
    for (const f of fabrics) {
      const fw = parseFloat(f.totalWeightKg) || 0;
      weight += fw;
      const fy = parseFloat(f.yieldRatio) || 0;
      if (fw > 0 && fy > 0) pieces += Math.round(fw * fy);
    }
    return { totalFabricWeightKg: weight, totalEstimatedPieces: pieces };
  }, [fabrics]);

  const handleNumpadChange = useCallback((newVal: string) => {
    const cell = activeCellRef.current;
    if (!cell) return;
    setNumpadValue(newVal);
    setFabrics(prev => prev.map(f => {
      if (f.id !== cell.fabricId) return f;
      return {
        ...f,
        variants: f.variants.map(v => {
          if (v.id !== cell.variantId) return v;
          if (cell.size === '__weightKg') return { ...v, weightKg: clampPositiveNumber(newVal) };
          const size = cell.size as SizeKey;
          const parsed = parseInt(newVal, 10);
          return { ...v, sizes: { ...v.sizes, [size]: { ...(v.sizes[size] ?? { estimated: 0 }), estimated: isNaN(parsed) || parsed < 0 ? 0 : parsed } } };
        })
      };
    }));
  }, []);

  const openNumpad = useCallback((cell: ActiveCell, initialValue: string) => {
    activeCellRef.current = cell;
    setActiveCell(cell);
    setNumpadValue(initialValue);
  }, []);

  const closeNumpad = useCallback(() => {
    activeCellRef.current = null;
    setActiveCell(null);
    setNumpadValue('');
  }, []);

  const addFabric = useCallback(() => setFabrics(prev => [...prev, emptyFabric()]), []);
  const removeFabric = useCallback((id: string) => setFabrics(prev => prev.filter(f => f.id !== id)), []);

  const updateFabric = useCallback((id: string, field: keyof FabricDraft, value: string) => {
    setFabrics(prev => prev.map(f => {
      if (f.id !== id) return f;
      const updated = { ...f, [field]: value };
      if (field === 'totalWeightKg' || field === 'yieldRatio') updated[field] = clampPositiveNumber(value);
      return updated;
    }));
  }, []);

  const addVariant = useCallback((fabricId: string) => {
    setFabrics(prev => prev.map(f => f.id !== fabricId ? f : { ...f, variants: [...f.variants, emptyVariant()] }));
  }, []);

  const removeVariant = useCallback((fabricId: string, variantId: string) => {
    setFabrics(prev => prev.map(f => f.id !== fabricId ? f : { ...f, variants: f.variants.filter(v => v.id !== variantId) }));
  }, []);

  const updateVariantColor = useCallback((fabricId: string, variantId: string, color: string) => {
    setFabrics(prev => prev.map(f => f.id !== fabricId ? f : { ...f, variants: f.variants.map(v => v.id === variantId ? { ...v, color } : v) }));
  }, []);

  const toggleSize = useCallback((fabricId: string, variantId: string, size: SizeKey) => {
    setFabrics(prev => prev.map(f => {
      if (f.id !== fabricId) return f;
      return {
        ...f,
        variants: f.variants.map(v => {
          if (v.id !== variantId) return v;
          const sizes = { ...v.sizes };
          if (sizes[size]) {
            delete sizes[size];
            setActiveCell(curr => curr?.fabricId === fabricId && curr.variantId === variantId && curr.size === size ? null : curr);
          } else {
            sizes[size] = { estimated: 0 };
          }
          return { ...v, sizes };
        })
      };
    }));
  }, []);

  const setProportionTool = useCallback((fabricId: string, variantId: string, show: boolean) => {
    setFabrics(prev => prev.map(f => f.id !== fabricId ? f : { ...f, variants: f.variants.map(v => v.id === variantId ? { ...v, showProportionTool: show, proportions: v.proportions || {} } : v) }));
  }, []);

  const updateProportion = useCallback((fabricId: string, variantId: string, size: SizeKey, prop: string) => {
    setFabrics(prev => prev.map(f => f.id !== fabricId ? f : { ...f, variants: f.variants.map(v => v.id !== variantId ? v : { ...v, proportions: { ...v.proportions, [size]: clampPositiveNumber(prop) } }) }));
  }, []);

  const applyProportions = useCallback((fabricId: string, variantId: string) => {
    setFabrics(prev => prev.map(f => {
      if (f.id !== fabricId) return f;
      const yieldRatio = parseFloat(f.yieldRatio);
      if (isNaN(yieldRatio) || yieldRatio <= 0) return f;
      return {
        ...f,
        variants: f.variants.map(v => {
          if (v.id !== variantId) return v;
          const weight = parseFloat(v.weightKg);
          if (isNaN(weight) || weight <= 0) return v;
          const totalVariantPieces = weight * yieldRatio;
          let sumProps = 0;
          const activeSizes = Object.keys(v.sizes) as SizeKey[];
          const propValues: Record<SizeKey, number> = {} as Record<SizeKey, number>;
          for (const size of activeSizes) {
            const p = parseFloat(v.proportions?.[size] || '0');
            if (!isNaN(p) && p > 0) { sumProps += p; propValues[size] = p; } else { propValues[size] = 0; }
          }
          if (sumProps <= 0) return v;
          const quota = totalVariantPieces / sumProps;
          const newSizes = { ...v.sizes };
          for (const size of activeSizes) {
            if (propValues[size] > 0) newSizes[size] = { estimated: Math.round(quota * propValues[size]) };
          }
          return { ...v, sizes: newSizes, showProportionTool: false };
        })
      };
    }));
  }, []);

  const validateForm = (): string | null => {
    if (!modelReference.trim()) return 'Referência do modelo é obrigatória.';
    if (!clientName.trim()) return 'Nome do cliente é obrigatório.';
    if (!modelDescription.trim()) return 'Descrição do modelo é obrigatória.';
    if (modelType === 'OUTRO' && !customModelType.trim()) return 'Especifique o modelo.';
    if (!deadlineDate) return 'Data de prazo é obrigatória.';
    if (fabrics.length === 0) return 'Adicione ao menos um tecido.';
    for (let i = 0; i < fabrics.length; i++) {
      const f = fabrics[i];
      if (!f.fabricSupplier.trim()) return `Tecido ${i+1}: fornecedor é obrigatório.`;
      if (f.fabricComposition === 'OUTRO' && !f.customFabricComposition.trim()) return `Tecido ${i+1}: especifique a composição.`;
      if (!f.totalWeightKg || parseFloat(f.totalWeightKg) <= 0) return `Tecido ${i+1}: peso inválido.`;
      if (!f.yieldRatio || parseFloat(f.yieldRatio) <= 0) return `Tecido ${i+1}: rendimento inválido.`;
      if (f.variants.length === 0) return `Tecido ${i+1}: adicione ao menos uma cor.`;
      for (const v of f.variants) {
        if (!v.color.trim()) return `Tecido ${i+1}: uma variante está sem cor.`;
        if (!v.weightKg || parseFloat(v.weightKg) <= 0) return `Tecido ${i+1} › Cor "${v.color}": peso obrigatório.`;
        if (Object.keys(v.sizes).length === 0) return `Tecido ${i+1} › Cor "${v.color}": adicione ao menos um tamanho.`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setSubmitting(true);
    try {
      const finalFabrics: FabricEntry[] = fabrics.map(f => {
        const matrixGrid: MatrixGridVariant[] = f.variants.map(v => {
          const sizesRecord: MatrixGridVariant['sizes'] = {};
          let totalEst = 0;
          for (const size of ALL_SIZES) {
            const entry = v.sizes[size];
            if (entry) {
              sizesRecord[size] = { estimated: entry.estimated, realCut: 0, readySewn: 0, approvedQc: 0 };
              totalEst += entry.estimated;
            }
          }
          return { color: v.color.toUpperCase().trim(), weightKg: parseFloat(v.weightKg), sizes: sizesRecord, totalEstimated: totalEst, totalRealCut: 0 };
        });
        return {
          id: `FAB_${uid()}`,
          fabricSupplier: f.fabricSupplier.trim().toUpperCase(),
          fabricComposition: f.fabricComposition === 'OUTRO' ? f.customFabricComposition.trim().toUpperCase() : f.fabricComposition,
          fabricType: f.fabricType.trim().toUpperCase(),
          totalFabricWeightKg: parseFloat(f.totalWeightKg),
          nominalYieldRatio: parseFloat(f.yieldRatio),
          matrixGrid
        };
      });

      const actualModelType = modelType === 'OUTRO' ? customModelType.trim().toUpperCase() : modelType as UniformModelType;

      await createProductionOrder({
        opNumber,
        modelReference: modelReference.trim().toUpperCase(),
        clientId: `CLI_${uid()}`,
        clientName: clientName.trim().toUpperCase(),
        modelType: actualModelType as any,
        modelDescription: modelDescription.trim().toUpperCase(),
        fabricSupplier: finalFabrics[0].fabricSupplier,
        fabricComposition: finalFabrics[0].fabricComposition,
        fabricType: finalFabrics[0].fabricType,
        totalFabricWeightKg: finalFabrics[0].totalFabricWeightKg,
        nominalYieldRatio: finalFabrics[0].nominalYieldRatio,
        matrixGrid: finalFabrics[0].matrixGrid,
        fabrics: finalFabrics,
        totalEstimatedPieces,
        totalRealPiecesCut: 0,
        totalFinalApprovedPieces: 0,
        status: 'FILA',
        priority,
        timestamps: {
          createdAt: Timestamp.now(),
          deadline: Timestamp.fromDate(new Date(deadlineDate + 'T12:00:00Z')),
        },
        notes: notes.trim() || undefined,
      });

      router.push('/pt/sandbox/dora-mes');
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar. Verifique a conexão e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <main className="pb-44 p-4 space-y-5 max-w-2xl mx-auto">

        {/* ── Header ── */}
        <header className="pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
                  <FilePlus2 size={14} className="text-white" />
                </div>
                <h1 className="font-black text-xl tracking-tight text-text-primary">Nova Ordem de Produção</h1>
              </div>
              <p className="text-xs text-text-secondary">Preencha os dados e lance os tamanhos</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[9px] text-text-muted uppercase tracking-widest font-black">Nº OP</p>
              <p className="font-mono font-black text-text-primary text-lg tracking-tight">OP-{opNumber || '...'}</p>
            </div>
          </div>
        </header>

        {/* ── SEÇÃO 1: Identificação ── */}
        <section className="space-y-4 rounded-2xl p-4" style={cardStyle}>
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-[9px] font-black text-factory-cut">1</span>
            Identificação
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Ref. do Modelo</label>
              <input type="text" value={modelReference} onChange={e => setModelReference(e.target.value)}
                     placeholder="Ex: F2401" className={`${inputMonoClass} uppercase`} />
            </div>

            <div>
              <label className={labelClass}>Descrição do Modelo</label>
              <input type="text" value={modelDescription} onChange={e => setModelDescription(e.target.value)}
                     placeholder="Ex: Camisa M.Malha Alg." className={inputClass} />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Cliente</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                     placeholder="Ex: Frank Arts Estamparia" className={inputClass} />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Tipo de Modelo</label>
              <div className="relative">
                <select value={modelType} onChange={e => setModelType(e.target.value)} className={selectClass}>
                  {MODEL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
              {modelType === 'OUTRO' && (
                <input type="text" value={customModelType} onChange={e => setCustomModelType(e.target.value)}
                       placeholder="Especifique o modelo..." className={`${inputClass} mt-2 uppercase`} />
              )}
            </div>

            <div>
              <label className={labelClass}>Prioridade</label>
              <div className="relative">
                <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className={selectClass}>
                  <option value="NORMAL">Normal</option>
                  <option value="URGENTE">⚡ Urgente</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Prazo de Entrega</label>
              <input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)}
                     min={new Date().toISOString().split('T')[0]}
                     className={inputClass}
                     style={{ colorScheme: 'dark' }} />
            </div>
          </div>
        </section>

        {/* ── Múltiplos Tecidos ── */}
        {fabrics.map((fabric, fIndex) => {
          const w = parseFloat(fabric.totalWeightKg);
          const y = parseFloat(fabric.yieldRatio);
          const fabricEstimatedPieces = (!isNaN(w) && !isNaN(y) && w > 0 && y > 0) ? Math.round(w * y) : null;

          return (
            <div key={fabric.id} className="space-y-4 rounded-2xl p-4" style={cardStyle}>
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-teal-500/20 flex items-center justify-center text-[9px] font-black text-factory-sew">2</span>
                  Tecido {fIndex + 1}
                  {fabricEstimatedPieces && (
                    <span className="font-mono font-black text-factory-sew text-xs">
                      · {fabricEstimatedPieces.toLocaleString('pt-BR')} pçs
                    </span>
                  )}
                </h2>
                {fabrics.length > 1 && (
                  <button onPointerDown={() => removeFabric(fabric.id)}
                          className="text-[10px] font-black text-factory-scrap px-2.5 py-1 rounded-lg active:scale-[0.97]"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    Remover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl p-3"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="col-span-2">
                  <label className={labelClass}>Fornecedor de Tecido</label>
                  <input type="text" value={fabric.fabricSupplier} onChange={e => updateFabric(fabric.id, 'fabricSupplier', e.target.value)}
                         placeholder="Ex: Quatro K Textil Ltda" className={inputClass} />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass}>Composição</label>
                  <div className="relative">
                    <select value={fabric.fabricComposition} onChange={e => updateFabric(fabric.id, 'fabricComposition', e.target.value)} className={selectClass}>
                      {FABRIC_COMPOSITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                  {fabric.fabricComposition === 'OUTRO' && (
                    <input type="text" value={fabric.customFabricComposition} onChange={e => updateFabric(fabric.id, 'customFabricComposition', e.target.value)}
                           placeholder="Ex: 96% VISCOSE 4% ELASTANO" className={`${inputClass} mt-2 uppercase text-sm`} />
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className={labelClass}>Tipo de Malha</label>
                  <input type="text" value={fabric.fabricType} onChange={e => updateFabric(fabric.id, 'fabricType', e.target.value)}
                         placeholder="Ex: MM Pent. Esp." className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Peso Total (kg)</label>
                  <input type="number" inputMode="decimal" min="0" value={fabric.totalWeightKg}
                         onChange={e => updateFabric(fabric.id, 'totalWeightKg', e.target.value)}
                         onBlur={e => updateFabric(fabric.id, 'totalWeightKg', clampPositiveNumber(e.target.value))}
                         placeholder="0.00" className={inputMonoClass} />
                </div>

                <div>
                  <label className={labelClass}>Rendimento (pçs/kg)</label>
                  <input type="number" inputMode="decimal" min="0" value={fabric.yieldRatio}
                         onChange={e => updateFabric(fabric.id, 'yieldRatio', e.target.value)}
                         onBlur={e => updateFabric(fabric.id, 'yieldRatio', clampPositiveNumber(e.target.value))}
                         placeholder="0.00" className={inputMonoClass} />
                </div>
              </div>

              {/* Grade */}
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Layers size={12} /> Grade de Tamanhos — Tecido {fIndex + 1}
              </h3>

              {fabric.variants.map(variant => {
                const variantTotal = Object.values(variant.sizes).reduce((a, s) => a + (s?.estimated ?? 0), 0);

                return (
                  <div key={variant.id} className="rounded-xl overflow-hidden"
                       style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* Cor header */}
                    <div className="flex items-center gap-2 p-3"
                         style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={e => updateVariantColor(fabric.id, variant.id, e.target.value)}
                        placeholder="COR (Ex: PRETO)"
                        className="flex-1 bg-transparent font-black text-text-primary placeholder-text-muted focus:outline-none uppercase text-sm tracking-widest"
                      />

                      <button
                        onPointerDown={() => openNumpad(
                          { fabricId: fabric.id, variantId: variant.id, size: '__weightKg', label: `Peso — ${variant.color || 'Cor'}` },
                          variant.weightKg
                        )}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-mono font-black min-w-[72px] justify-center transition-all border ${
                          activeCell?.variantId === variant.id && activeCell.size === '__weightKg'
                            ? 'border-blue-500/60 bg-blue-500/15 text-factory-cut ring-1 ring-blue-500/40'
                            : 'border-white/10 text-text-secondary hover:border-white/20'
                        }`}
                      >
                        <Scale size={12} />
                        {variant.weightKg ? `${variant.weightKg}kg` : '? kg'}
                      </button>

                      {fabric.variants.length > 1 && (
                        <button onPointerDown={() => removeVariant(fabric.id, variant.id)}
                                className="p-1.5 text-text-muted hover:text-factory-scrap rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {/* Tamanhos */}
                    <div className="p-3 pb-2 flex items-center justify-between"
                         style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mb-2">Tamanhos ativos</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ALL_SIZES.map(size => {
                            const isActive = !!variant.sizes[size];
                            return (
                              <button
                                key={size}
                                onPointerDown={() => toggleSize(fabric.id, variant.id, size)}
                                className={`h-9 min-w-[40px] px-2 rounded-lg text-sm font-black border transition-all active:scale-[0.95] select-none ${
                                  isActive
                                    ? 'text-white'
                                    : 'text-text-muted border-white/10 hover:border-white/20'
                                }`}
                                style={isActive ? {
                                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                  border: '1px solid rgba(59,130,246,0.5)',
                                  boxShadow: '0 0 8px rgba(59,130,246,0.3)',
                                } : { background: 'rgba(255,255,255,0.04)' }}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {Object.keys(variant.sizes).length > 0 && (
                        <button
                          onPointerDown={() => setProportionTool(fabric.id, variant.id, !variant.showProportionTool)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                            variant.showProportionTool
                              ? 'border-violet-500/40 bg-violet-500/15 text-violet-400'
                              : 'border-white/10 text-text-muted hover:border-white/20'
                          }`}
                          title="Calculadora de proporção"
                        >
                          <Calculator size={18} />
                          <span className="text-[9px] font-black mt-1 uppercase tracking-widest">Risco</span>
                        </button>
                      )}
                    </div>

                    {/* Ferramenta de Proporção */}
                    {variant.showProportionTool && Object.keys(variant.sizes).length > 0 && (
                      <div className="p-3 space-y-3"
                           style={{ background: 'rgba(139,92,246,0.06)', borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
                        <div className="flex items-center gap-2 text-violet-400 text-sm font-black">
                          <Calculator size={15} /> Calculadora de Proporção
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Digite os fatores para distribuir as peças entre os tamanhos (ex: P=1, M=2, G=1).
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ALL_SIZES.filter(s => variant.sizes[s]).map(size => (
                            <div key={size} className="flex flex-col gap-1 w-16">
                              <span className="text-[10px] font-black text-text-secondary text-center">{size}</span>
                              <input
                                type="number" min="0" inputMode="numeric"
                                value={variant.proportions?.[size] || ''}
                                onChange={e => updateProportion(fabric.id, variant.id, size, e.target.value)}
                                onBlur={e => updateProportion(fabric.id, variant.id, size, clampPositiveNumber(e.target.value))}
                                className="w-full h-10 rounded-lg text-center font-black text-sm text-text-primary
                                           bg-white/5 border border-violet-500/20 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                                placeholder="0"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <button
                            onPointerDown={() => applyProportions(fabric.id, variant.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-white transition-all active:scale-[0.97]"
                            style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', boxShadow: '0 0 12px rgba(139,92,246,0.4)' }}
                          >
                            <Check size={15} /> Aplicar Proporção
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Células de tamanho */}
                    {Object.keys(variant.sizes).length > 0 && (
                      <div className="p-3 grid grid-cols-3 gap-2">
                        {ALL_SIZES.filter(s => variant.sizes[s]).map(size => {
                          const cellVal = sizeDisplayValue(variant, size);
                          const isEditing = activeCell?.fabricId === fabric.id && activeCell?.variantId === variant.id && activeCell.size === size;

                          return (
                            <button
                              key={size}
                              onPointerDown={() => openNumpad(
                                { fabricId: fabric.id, variantId: variant.id, size, label: `${variant.color || 'Cor'} — ${size}` },
                                cellVal
                              )}
                              className={`rounded-xl border-2 p-3 flex flex-col items-center gap-0.5 transition-all active:scale-[0.96] ${
                                isEditing
                                  ? 'border-blue-500/70'
                                  : cellVal
                                  ? 'border-white/15 hover:border-white/25'
                                  : 'border-dashed border-white/10 hover:border-white/20'
                              }`}
                              style={isEditing ? {
                                background: 'rgba(59,130,246,0.15)',
                                boxShadow: '0 0 12px rgba(59,130,246,0.3)',
                              } : cellVal ? { background: 'rgba(255,255,255,0.05)' } : { background: 'rgba(255,255,255,0.02)' }}
                            >
                              <span className={`text-[10px] font-black uppercase tracking-widest ${isEditing ? 'text-factory-cut' : 'text-text-muted'}`}>{size}</span>
                              <span className={`text-2xl font-mono font-black tabular-nums ${isEditing ? 'text-factory-cut' : cellVal ? 'text-text-primary' : 'text-text-muted/40'}`}>
                                {cellVal || '0'}
                              </span>
                              <span className="text-[9px] text-text-muted font-bold">pçs</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Total da cor */}
                    {Object.keys(variant.sizes).length > 0 && (
                      <div className="flex items-center justify-between px-4 py-2.5"
                           style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">Total da cor</span>
                        <span className="font-mono font-black text-text-primary tabular-nums">
                          {variantTotal.toLocaleString('pt-BR')} pçs
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onPointerDown={() => addVariant(fabric.id)}
                className="w-full border-2 border-dashed rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm font-bold
                           text-text-muted hover:text-text-secondary transition-colors active:scale-[0.98]"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <PlusCircle size={16} /> Adicionar Cor — {fabric.fabricType || `Tecido ${fIndex + 1}`}
              </button>
            </div>
          );
        })}

        {/* ── Add fabric ── */}
        <button
          onPointerDown={addFabric}
          className="w-full rounded-xl py-4 flex items-center justify-center gap-2 text-sm font-black
                     text-text-secondary active:scale-[0.98] transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)' }}
        >
          <PlusCircle size={18} /> Adicionar Outro Tecido
        </button>

        {/* ── Total OP ── */}
        <div className="rounded-2xl p-5 flex items-center justify-between"
             style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))', border: '1px solid rgba(59,130,246,0.3)' }}>
          <div>
            <p className="text-[10px] text-factory-cut font-black uppercase tracking-widest mb-1">Total da OP</p>
            <p className="font-mono text-sm text-text-secondary">{totalFabricWeightKg.toFixed(2)} kg</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-4xl font-black tabular-nums text-text-primary">{totalEstimatedPieces.toLocaleString('pt-BR')}</p>
            <p className="text-[10px] text-factory-cut font-black uppercase tracking-widest mt-1">Peças Estimadas</p>
          </div>
        </div>

        {/* ── Observações ── */}
        <section className="space-y-2">
          <label className={labelClass}>Observações (opcional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Instruções especiais, referências, anotações..."
            className={`${inputClass} resize-none text-sm`}
          />
        </section>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl p-4"
               style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle size={18} className="text-factory-scrap mt-0.5 shrink-0" />
            <p className="text-factory-scrap text-sm font-semibold">{error}</p>
          </div>
        )}
      </main>

      {/* ── Fixed submit bar ── */}
      {!activeCell && (
        <div className="fixed bottom-16 left-0 right-0 z-40 p-3"
             style={{ background: 'linear-gradient(to top, #060B18 80%, transparent)', paddingBottom: '8px' }}>
          <button
            id="submit-op-btn"
            onPointerDown={handleSubmit}
            disabled={submitting}
            className="w-full max-w-2xl mx-auto flex h-14 rounded-xl font-black text-base text-white items-center
                       justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 0 24px rgba(59,130,246,0.5)' }}
          >
            {submitting ? 'Criando Ordem...' : 'Criar Ordem de Produção'}
          </button>
        </div>
      )}

      {/* ── Numpad ── */}
      {activeCell && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onPointerDown={closeNumpad} aria-hidden="true" />
          <div className="fixed bottom-0 left-0 right-0 z-50 shadow-2xl">
            <Numpad
              value={numpadValue}
              onChange={handleNumpadChange}
              onEnter={closeNumpad}
              onClose={closeNumpad}
              label={activeCell.label}
            />
          </div>
        </>
      )}
    </>
  );
}
