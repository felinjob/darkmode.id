'use client';

import { useState, useEffect } from 'react';

const SUFFIXES = ['arte', 'code', 'flow', 'sys', 'id'];

export function DynamicLogo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (isLocked) return;

    if (currentIndex < SUFFIXES.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 220); // Cadência mecânica de 220ms por termo
      return () => clearTimeout(timeout);
    } else {
      setIsLocked(true);
    }
  }, [currentIndex, isLocked]);

  const handleManualTrigger = () => {
    setCurrentIndex(0);
    setIsLocked(false);
  };

  return (
    <button
      type="button"
      onClick={handleManualTrigger}
      className="group -m-2 flex p-2 min-h-[48px] min-w-[48px] items-center text-left font-display text-sm font-bold tracking-tight text-[var(--text-primary)] transition-opacity hover:opacity-80 focus:outline-none"
      aria-label="darkmode.id logo"
      aria-live="polite"
    >
      <span>darkmode</span>
      <span className="text-[var(--accent-focus)]">.</span>
      <span className="inline-block w-[6ch] text-left font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
        {SUFFIXES[currentIndex]}
        <span className={`inline-block ml-0.5 text-[var(--text-primary)] ${isLocked ? 'animate-pulse' : 'animate-pulse'}`} aria-hidden="true">
          _
        </span>
      </span>
    </button>
  );
}
