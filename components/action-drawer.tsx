'use client';

import { useEffect, useState } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActionDrawer({ isOpen, onClose }: ActionDrawerProps) {
  const [showCal, setShowCal] = useState(false);

  // Inicializar a API do Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#e63946" } }, // Usando a cor de destaque se desejar, ou #000000
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  // Bloquear scroll e escutar ESC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      setShowCal(false); // Resetar estado ao fechar
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Gaveta (Drawer) */}
      <div 
        className="relative w-full max-w-2xl mx-auto bg-[var(--bg-elevated)] border-t border-l border-r border-[var(--border-subtle)] flex flex-col animate-slide-up"
        style={{
          animation: 'slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Cabeçalho */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            {showCal ? "TECHNICAL ALIGNMENT // SCHEDULING" : "COMMUNICATION PROTOCOL // DIRECT CHANNELS"}
          </span>
          <div className="flex gap-4">
            {showCal && (
              <button 
                onClick={() => setShowCal(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-focus)] border border-[var(--border-subtle)] hover:border-[var(--accent-focus)] bg-[var(--bg-elevated)] transition-colors px-3 py-1.5 focus:outline-none"
              >
                [ VOLTAR ]
              </button>
            )}
            <button 
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-widest text-black bg-[var(--accent-focus)] hover:brightness-110 transition-colors px-3 py-1.5 focus:outline-none font-bold"
              aria-label="Fechar gaveta de contato"
            >
              FECHAR ✕
            </button>
          </div>
        </header>

        {/* Corpo */}
        <div className="p-6 md:p-8 pb-32 flex flex-col gap-8 overflow-y-auto max-h-[80vh] min-h-[50vh]">
          
          {showCal ? (
            <div className="w-full h-full min-h-[600px]">
              <Cal 
                calLink="felinjob" 
                style={{ width: "100%", height: "100%", overflow: "scroll" }} 
                config={{ layout: 'month_view' }} 
              />
            </div>
          ) : (
            <>
              {/* Canal 01: Micro-Terminal (Web3Forms) */}
              <div className="flex flex-col space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--accent-focus)]">
                  01 // MICRO-TERMINAL
                </h3>
                <form className="flex flex-col gap-3" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  const originalText = submitBtn.innerText;
                  submitBtn.innerText = '[ TRANSMITINDO... ]';
                  submitBtn.disabled = true;

                  const formData = new FormData(form);
                  formData.append("access_key", "7645d5b0-ecd1-4c4f-b852-c442e7fa1467");

                  try {
                    const response = await fetch("https://api.web3forms.com/submit", {
                      method: "POST",
                      body: formData
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                      submitBtn.innerText = '[ DADOS RECEBIDOS ✓ ]';
                      submitBtn.classList.replace('text-[var(--text-primary)]', 'text-[var(--signal-state)]');
                      form.reset();
                    } else {
                      submitBtn.innerText = '[ ERRO DE TRANSMISSÃO ✕ ]';
                      submitBtn.classList.replace('text-[var(--text-primary)]', 'text-[var(--accent-focus)]');
                    }
                  } catch (err) {
                    submitBtn.innerText = '[ ERRO DE TRANSMISSÃO ✕ ]';
                  } finally {
                    setTimeout(() => {
                      submitBtn.innerText = originalText;
                      submitBtn.disabled = false;
                      submitBtn.classList.remove('text-[var(--signal-state)]', 'text-[var(--accent-focus)]');
                      submitBtn.classList.add('text-[var(--text-primary)]');
                    }, 3000);
                  }
                }}>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="NOME OU EMPRESA" 
                    autoComplete="name"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-secondary)] transition-colors placeholder:text-[var(--text-muted)] min-h-[48px]"
                  />
                  <input 
                    type="email" 
                    name="email"
                    required
                    inputMode="email"
                    placeholder="E-MAIL DE CONTATO" 
                    autoComplete="email"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-secondary)] transition-colors placeholder:text-[var(--text-muted)] min-h-[48px]"
                  />
                  <textarea 
                    name="message"
                    required
                    placeholder="ESCOPO TÉCNICO / DESAFIO" 
                    rows={3}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-secondary)] transition-colors placeholder:text-[var(--text-muted)] resize-none"
                  />
                  <button 
                    type="submit"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--border-subtle)] disabled:opacity-50 transition-colors min-h-[48px]"
                  >
                    [ TRANSMITIR DADOS ↗ ]
                  </button>
                </form>
              </div>

              <div className="w-full h-px bg-[var(--border-subtle)]/50" />

              {/* Canal 02: WhatsApp */}
              <div className="flex flex-col space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                  02 // HIGH-SPEED CHANNEL
                </h3>
                <a 
                  href="https://wa.me/5521975659408?text=Ol%C3%A1%20Felipe%2C%20analisei%20o%20darkmode.id%20e%20gostaria%20de%20avaliar%20a%20viabilidade%20de%20um%20projeto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[var(--accent-focus)] text-black p-4 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors hover:brightness-110 min-h-[48px]"
                >
                  [ WHATSAPP DIRECT ↗ ]
                </a>
              </div>

              <div className="w-full h-px bg-[var(--border-subtle)]/50" />

              {/* Canal 03: Calendário (Cal.com) */}
              <div className="flex flex-col space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                  03 // TECHNICAL ALIGNMENT
                </h3>
                <button 
                  onClick={() => setShowCal(true)}
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center min-h-[48px]"
                >
                  [ AGENDAR CALL NO CAL.COM ↗ ]
                </button>
              </div>
            </>
          )}

        </div>
      </div>
      
      {/* Inject animation keyframes safely inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
