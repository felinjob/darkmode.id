'use client';

import { Delete, Check } from 'lucide-react';

interface NumpadProps {
  value: string;
  onChange: (val: string) => void;
  onEnter?: () => void;
  onClose?: () => void;
  label?: string;
}

export default function Numpad({ value, onChange, onEnter, onClose, label }: NumpadProps) {
  const handleDigit = (digit: string) => {
    // Prevent leading zeros on integer-only inputs (no decimal yet)
    if (digit === '0' && value === '') return;
    // Allow only one decimal point
    if (digit === '.' && value.includes('.')) return;
    // Limit integer part to 6 digits
    const parts = value.split('.');
    if (parts[0].length >= 6 && digit !== '.' && !value.includes('.')) return;
    // Limit decimal part to 2 digits
    if (value.includes('.') && parts[1]?.length >= 2) return;
    onChange(value + digit);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange('');
  };

  // 3x4 key grid: rows 1-3 are 1-9, row 4 is C / 0 / ⌫
  const topKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="bg-slate-800 rounded-t-2xl w-full select-none overflow-hidden">
      {/* ── Display bar ── */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-700 min-h-[56px]">
        {label && (
          <span className="text-slate-400 text-xs font-medium uppercase tracking-widest truncate mr-3 max-w-[55%]">
            {label}
          </span>
        )}
        <span className="text-white text-3xl font-mono tabular-nums ml-auto tracking-tight">
          {value === '' ? <span className="text-slate-600">0</span> : value}
        </span>
      </div>

      {/* ── Key grid 3×3 (digits 1–9) ── */}
      <div className="grid grid-cols-3 gap-px bg-slate-700">
        {topKeys.map((digit) => (
          <button
            key={digit}
            onPointerDown={(e) => { e.preventDefault(); handleDigit(digit); }}
            className="h-16 bg-slate-800 flex items-center justify-center text-2xl font-mono font-semibold text-white active:bg-slate-600 transition-colors"
            aria-label={`Dígito ${digit}`}
          >
            {digit}
          </button>
        ))}
      </div>

      {/* ── Row 4: C / 0 / ⌫ ── */}
      <div className="grid grid-cols-3 gap-px bg-slate-700">
        {/* Clear */}
        <button
          onPointerDown={(e) => { e.preventDefault(); handleClear(); }}
          className="h-16 bg-slate-800 flex items-center justify-center text-xl font-mono font-bold text-amber-400 active:bg-slate-600 transition-colors"
          aria-label="Limpar"
        >
          C
        </button>

        {/* 0 */}
        <button
          onPointerDown={(e) => { e.preventDefault(); handleDigit('0'); }}
          className="h-16 bg-slate-800 flex items-center justify-center text-2xl font-mono font-semibold text-white active:bg-slate-600 transition-colors"
          aria-label="Dígito 0"
        >
          0
        </button>

        {/* Backspace */}
        <button
          onPointerDown={(e) => { e.preventDefault(); handleBackspace(); }}
          className="h-16 bg-slate-800 flex items-center justify-center active:bg-slate-600 transition-colors"
          aria-label="Apagar último dígito"
        >
          <Delete size={22} className="text-slate-300" />
        </button>
      </div>

      {/* ── Row 5: Decimal / Fechar ── */}
      <div className="grid grid-cols-2 gap-px bg-slate-700">
        <button
          onPointerDown={(e) => { e.preventDefault(); handleDigit('.'); }}
          className="h-12 bg-slate-800 flex items-center justify-center text-xl font-mono font-bold text-white active:bg-slate-600 transition-colors gap-2"
          aria-label="Ponto decimal"
        >
          <span>,</span>
          <span className="text-xs text-slate-400 font-sans">(decimal)</span>
        </button>
        <button
          onPointerDown={(e) => { e.preventDefault(); onClose?.(); }}
          className="h-12 bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-semibold active:bg-slate-600 transition-colors"
          aria-label="Fechar teclado sem descartar"
        >
          Fechar
        </button>
      </div>

      {/* ── Confirm button — always visible, full width ── */}
      <button
        onPointerDown={(e) => { e.preventDefault(); onEnter?.(); }}
        className="w-full h-16 bg-blue-600 text-white flex items-center justify-center gap-2 text-xl font-bold active:bg-blue-700 transition-colors"
        aria-label="Confirmar valor"
      >
        <Check size={24} />
        Confirmar
      </button>
    </div>
  );
}
