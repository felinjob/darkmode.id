'use client';

import { useEffect, useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialShowCal?: boolean;
}

export function ActionDrawer({ isOpen, onClose, initialShowCal = false }: ActionDrawerProps) {
  const [showCal, setShowCal] = useState(initialShowCal);

  useEffect(() => {
    if (isOpen) {
      setShowCal(initialShowCal);
    }
  }, [isOpen, initialShowCal]);

  // Inicializar a API do Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal('ui', {
        styles: { branding: { brandColor: '#FF5500' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  // Fechar com ESC e travar scroll do body enquanto aberto
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Overlay limpo sem distorção de matriz 3D nos filhos */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel alinhado em coordenadas inteiras (sem translate3d do Vaul que borrava fontes no Windows) */}
      <div className="relative z-10 w-full max-w-3xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded-t-xl sm:rounded-lg shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden">
        {/* Linha LED sutil no topo */}
        <div className="h-[2px] w-full led-border-flow" />

        {/* Cabeçalho */}
        <header className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[var(--signal-state)]" />
            <h2
              id="contact-modal-title"
              className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-semibold"
            >
              {showCal ? 'Agendar conversa // Felipe Teles' : 'Contato direto // Felipe Teles'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {showCal && (
              <button
                type="button"
                onClick={() => setShowCal(false)}
                className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-elevated)] transition-colors px-3 py-1.5 cursor-pointer"
              >
                Voltar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-wider text-white bg-[var(--accent-focus)] hover:brightness-110 transition-colors px-3.5 py-1.5 font-bold cursor-pointer"
              aria-label="Fechar janela de contato"
            >
              Fechar ✕
            </button>
          </div>
        </header>

        {/* Corpo */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {showCal ? (
            <div className="w-full min-h-[540px]">
              <Cal
                calLink="felinjob"
                style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                config={{ layout: 'month_view' }}
              />
            </div>
          ) : (
            <>
              {/* Canais Rápidos (WhatsApp & Agenda) no topo para acesso imediato */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/5521975659408?text=Ol%C3%A1%20Felipe%2C%20vi%20seu%20site%20e%20gostaria%20de%20conversar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--accent-focus)] text-white px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all hover:brightness-110 min-h-[48px]"
                >
                  Chamar no WhatsApp ↗
                </a>

                <button
                  type="button"
                  onClick={() => setShowCal(true)}
                  className="bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--accent-focus)] px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] transition-colors flex items-center justify-center min-h-[48px] cursor-pointer"
                >
                  Agendar horário (Cal.com) ↗
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                  ou envie um e-mail direto
                </span>
                <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              </div>

              {/* Formulário de E-mail (Web3Forms) com Honeypot Anti-Bot */}
              <form
                className="flex flex-col gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);

                  // Bloqueio silencioso de bots via honeypot
                  if (formData.get('botcheck')) {
                    return;
                  }

                  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  const originalText = submitBtn.innerText;
                  submitBtn.innerText = 'Enviando...';
                  submitBtn.disabled = true;

                  formData.append('access_key', '7645d5b0-ecd1-4c4f-b852-c442e7fa1467');

                  try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await response.json();

                    if (data.success) {
                      submitBtn.innerText = 'Mensagem enviada com sucesso ✓';
                      submitBtn.classList.replace('text-[var(--text-primary)]', 'text-[var(--signal-state)]');
                      form.reset();
                    } else {
                      submitBtn.innerText = 'Erro ao enviar. Tente pelo WhatsApp.';
                      submitBtn.classList.replace('text-[var(--text-primary)]', 'text-[var(--accent-focus)]');
                    }
                  } catch {
                    submitBtn.innerText = 'Erro ao enviar. Tente pelo WhatsApp.';
                  } finally {
                    setTimeout(() => {
                      submitBtn.innerText = originalText;
                      submitBtn.disabled = false;
                      submitBtn.classList.remove('text-[var(--signal-state)]', 'text-[var(--accent-focus)]');
                      submitBtn.classList.add('text-[var(--text-primary)]');
                    }, 3000);
                  }
                }}
              >
                {/* Honeypot invisível contra spam automatizado */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Seu nome"
                    autoComplete="name"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] px-4 py-3 font-sans text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-focus)] transition-colors placeholder:text-[var(--text-muted)] min-h-[46px]"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    maxLength={120}
                    inputMode="email"
                    placeholder="Seu e-mail"
                    autoComplete="email"
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] px-4 py-3 font-sans text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-focus)] transition-colors placeholder:text-[var(--text-muted)] min-h-[46px]"
                  />
                </div>
                <textarea
                  name="message"
                  required
                  maxLength={2000}
                  placeholder="Como posso ajudar no seu projeto ou operação?"
                  rows={3}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] p-4 font-sans text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-focus)] transition-colors placeholder:text-[var(--text-muted)] resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--accent-focus)] px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] disabled:opacity-50 transition-colors min-h-[48px] cursor-pointer"
                >
                  Enviar mensagem ↗
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
