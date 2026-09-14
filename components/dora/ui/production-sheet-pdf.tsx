// @ts-nocheck
import React from 'react';
import { ProductionOrder, StageStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
const Barcode = ({ value }: { value: string }) => <div className="font-mono text-xs border border-dashed border-gray-400 p-2 text-center bg-gray-100">||| |||| || ||| {value}</div>;

interface ProductionSheetPdfProps {
  order: ProductionOrder;
}

export function ProductionSheetPdf({ order }: ProductionSheetPdfProps) {
  const deadlineDate = order.timestamps.deadline
    ? (order.timestamps.deadline as any).toDate 
      ? (order.timestamps.deadline as any).toDate() 
      : new Date((order.timestamps.deadline as any).seconds * 1000)
    : null;

  return (
    <div className="hidden print:block w-full max-w-4xl mx-auto bg-white text-black p-4 text-sm font-sans" id="print-area">
      {/* Header */}
      <header className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Dora Pinheiro</h1>
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-700">Ficha de Produção</h2>
        </div>
        <div className="text-center">
          <Barcode value={order.opNumber} height={40} width={1.5} fontSize={14} displayValue={true} margin={0} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold">OP-{order.opNumber}</p>
          <p className="text-sm font-bold uppercase mt-1">Ref: {order.modelReference}</p>
        </div>
      </header>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 border border-black p-4 rounded-lg">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Cliente</p>
          <p className="font-bold text-lg">{order.clientName}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Descrição do Modelo</p>
          <p className="font-bold">{order.modelDescription || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Prazo de Entrega</p>
          <p className="font-bold font-mono">
            {deadlineDate ? format(deadlineDate, 'dd/MM/yyyy', { locale: ptBR }) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Prioridade</p>
          <p className="font-bold">{order.priority}</p>
        </div>
      </div>

      {/* Materials */}
      <h3 className="text-md font-bold uppercase mb-2 border-b border-black pb-1">Matéria-Prima</h3>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Tipo de Tecido</p>
          <p className="font-bold">{order.fabricType || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Composição</p>
          <p className="font-bold">{order.fabricComposition || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Fornecedor</p>
          <p className="font-bold">{order.fabricSupplier || '—'}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Peso Total</p>
          <p className="font-bold font-mono">{order.totalFabricWeightKg.toLocaleString('pt-BR')} kg</p>
        </div>
      </div>

      {/* Grid */}
      <h3 className="text-md font-bold uppercase mb-2 border-b border-black pb-1">Grade Matricial</h3>
      <div className="mb-6">
        <table className="w-full text-sm border-collapse border border-black text-center">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-black p-2 uppercase">Cor</th>
              <th className="border border-black p-2 uppercase">Tam</th>
              <th className="border border-black p-2 uppercase">Est.</th>
              <th className="border border-black p-2 uppercase">Cortado</th>
            </tr>
          </thead>
          <tbody>
            {order.matrixGrid?.map((variant, vi) => {
              const sizes = Object.keys(variant.sizes);
              return sizes.map((size, si) => {
                const s = variant.sizes[size];
                return (
                  <tr key={`${vi}-${si}`}>
                    {si === 0 && (
                      <td className="border border-black p-2 font-bold align-middle" rowSpan={sizes.length}>
                        {variant.color}
                      </td>
                    )}
                    <td className="border border-black p-2 font-bold">{size}</td>
                    <td className="border border-black p-2 font-mono">{s.estimated}</td>
                    <td className="border border-black p-2 font-mono">{s.realCut || '—'}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
        <p className="text-right text-xs font-bold mt-2">TOTAL GERAL ESTIMADO: {order.totalEstimatedPieces.toLocaleString('pt-BR')} pçs</p>
      </div>

      {/* Bundles */}
      {order.bundles && order.bundles.length > 0 && (
        <>
          <h3 className="text-md font-bold uppercase mb-2 border-b border-black pb-1 mt-6">Fardos de Costura</h3>
          <table className="w-full text-sm border-collapse border border-black text-center mb-6">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-black p-2 uppercase">Cód. Fardo</th>
                <th className="border border-black p-2 uppercase">Cor / Tam</th>
                <th className="border border-black p-2 uppercase">Qtd</th>
                <th className="border border-black p-2 uppercase">Operadora</th>
                <th className="border border-black p-2 uppercase">Obs (Manual)</th>
              </tr>
            </thead>
            <tbody>
              {order.bundles.map(b => (
                <tr key={b.id}>
                  <td className="border border-black p-2 font-mono font-bold">{b.bundleCode}</td>
                  <td className="border border-black p-2 font-bold">{b.color} - {b.size}</td>
                  <td className="border border-black p-2 font-mono">{b.quantity}</td>
                  <td className="border border-black p-2">{b.seamstressOperator || '______________'}</td>
                  <td className="border border-black p-2 text-transparent">____________________</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Observações */}
      {order.notes && (
        <div className="mb-6 p-4 border border-black rounded-lg">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Observações Gerais</p>
          <p className="font-medium whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}

      {/* Assinaturas */}
      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="border-t border-black pt-2">
            <p className="font-bold text-xs uppercase">Encarregado(a) de Corte</p>
            <p className="text-[10px] text-slate-500 mt-1">Data: ___/___/___</p>
          </div>
        </div>
        <div>
          <div className="border-t border-black pt-2">
            <p className="font-bold text-xs uppercase">Encarregado(a) de Costura</p>
            <p className="text-[10px] text-slate-500 mt-1">Data: ___/___/___</p>
          </div>
        </div>
        <div>
          <div className="border-t border-black pt-2">
            <p className="font-bold text-xs uppercase">Controle de Qualidade (QC)</p>
            <p className="text-[10px] text-slate-500 mt-1">Data: ___/___/___</p>
          </div>
        </div>
      </div>
    </div>
  );
}
