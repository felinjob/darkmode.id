'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  BatteryCharging,
  Gauge,
  Weight,
  Wrench,
  ShieldCheck,
  Video,
  Palette,
  Truck,
  Server,
  MessageCircle,
  Download,
  ExternalLink,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Navigation,
  Mail,
  Code2,
} from 'lucide-react';

const PDF_URL = '/proposta-aw-bikes.pdf';
const PDF_FILENAME = 'Proposta-AW-Bikes-Felipe-Teles.pdf';

type ProposalTheme = 'oled' | 'asphalt-light';
type PackageOption = 'fixed' | 'dynamic';
type PaymentMethod = 'standard' | 'pix' | 'card';

interface BikeColorPreset {
  id: string;
  name: string;
  tag: string;
  primaryHex: string;
  accentHex: string;
  frameGlow: string;
}

const BIKE_COLORS: BikeColorPreset[] = [
  {
    id: 'stealth',
    name: 'Preto Fosco',
    tag: 'Acabamento Matte',
    primaryHex: '#272B33',
    accentHex: '#FFD400',
    frameGlow: 'rgba(255, 212, 0, 0.14)',
  },
  {
    id: 'volt',
    name: 'Amarelo Volt',
    tag: 'Destaque Urbano',
    primaryHex: '#EAB308',
    accentHex: '#FEF08A',
    frameGlow: 'rgba(234, 179, 8, 0.2)',
  },
  {
    id: 'military',
    name: 'Verde Militar',
    tag: 'Pintura Texturizada',
    primaryHex: '#3F6212',
    accentHex: '#84CC16',
    frameGlow: 'rgba(132, 204, 22, 0.16)',
  },
  {
    id: 'titanium',
    name: 'Cinza Titânio',
    tag: 'Alumínio Escovado',
    primaryHex: '#64748B',
    accentHex: '#38BDF8',
    frameGlow: 'rgba(56, 189, 248, 0.16)',
  },
];

export function AwBikesProposalView() {
  const [theme, setTheme] = useState<ProposalTheme>('oled');
  const [selectedPackage, setSelectedPackage] = useState<PackageOption>('dynamic');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('standard');
  const [activeColor, setActiveColor] = useState<BikeColorPreset>(BIKE_COLORS[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'asphalt-light') {
      root.setAttribute('data-theme', 'asphalt-light');
    } else {
      root.removeAttribute('data-theme');
    }
    return () => root.removeAttribute('data-theme');
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === 'oled' ? 'asphalt-light' : 'oled'));

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const packageDetails = {
    fixed: {
      name: 'Opção 1 — Landing Page Direta (Catálogo Fixo no Código)',
      shortName: 'Opção 1 (Catálogo Fixo — R$ 950)',
      total: 'R$ 950,00',
      entry: 'R$ 475,00',
      delivery: 'R$ 475,00',
      pix: 'R$ 880,00',
      pixDiscount: 'R$ 70',
      cardInstallment: '3x de R$ 335,00',
      cardTotal: 'R$ 1.005,00',
      deadline: '12 a 18 dias úteis',
    },
    dynamic: {
      name: 'Opção 2 — Landing Page Dinâmica + Painel Administrativo Próprio',
      shortName: 'Opção 2 (Com Painel Admin — R$ 1.350)',
      total: 'R$ 1.350,00',
      entry: 'R$ 675,00',
      delivery: 'R$ 675,00',
      pix: 'R$ 1.250,00',
      pixDiscount: 'R$ 100',
      cardInstallment: '3x de R$ 475,00',
      cardTotal: 'R$ 1.425,00',
      deadline: '15 a 22 dias úteis',
    },
  };

  const currentPkg = packageDetails[selectedPackage];

  const paymentLabels: Record<PaymentMethod, string> = {
    standard: `50% de entrada (${currentPkg.entry}) + 50% na entrega (${currentPkg.delivery})`,
    pix: `À vista no Pix com desconto (${currentPkg.pix})`,
    card: `Cartão de crédito (até ${currentPkg.cardInstallment})`,
  };

  const whatsappMessage = encodeURIComponent(
    `Olá Felipe! Analisamos a proposta da AW Bikes e queremos avançar com a ${currentPkg.shortName} na condição: ${paymentLabels[selectedPayment]}.`
  );
  const whatsappUrl = `https://wa.me/5521975659408?text=${whatsappMessage}`;

  return (
    <div className="w-full text-[var(--text-primary)] print:bg-white print:text-black selection:bg-[var(--volt)] selection:text-black">
      {/* ========================================================
          CABEÇALHO FIXO DISCRETO
          ======================================================== */}
      <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 md:px-8 py-3 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>darkmode.id</span>
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-primary)]">
              <Zap className="w-3 h-3 text-[var(--volt)] fill-[var(--volt)]" />
              <span className="font-semibold">AW BIKES</span>
              <span className="hidden sm:inline text-[var(--text-muted)]">// PROPOSTA</span>
            </div>
          </div>

          <nav
            aria-label="Seções da Proposta"
            className="hidden lg:flex items-center gap-5 font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
          >
            <a href="#visao" className="hover:text-[var(--text-primary)] transition-colors">
              Visão Geral
            </a>
            <a href="#estrutura" className="hover:text-[var(--text-primary)] transition-colors">
              Estrutura
            </a>
            <a href="#bastidores" className="hover:text-[var(--text-primary)] transition-colors">
              Bastidores
            </a>
            <a href="#investimento" className="hover:text-[var(--text-primary)] transition-colors">
              Valores
            </a>
            <a href="#prazos" className="hover:text-[var(--text-primary)] transition-colors">
              Prazos
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema claro ou escuro"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {theme === 'oled' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Modo Escuro</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Copiar link desta proposta"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--signal-state)]" />
                  <span className="text-[var(--signal-state)]">Copiado</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Link</span>
                </>
              )}
            </button>

            <a
              href={PDF_URL}
              download={PDF_FILENAME}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[var(--border-subtle)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--accent-focus)] hover:brightness-110 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Aprovar</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================
          CONTEÚDO PRINCIPAL
          ======================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 space-y-14 sm:space-y-18">
        {/* ----------------------------------------------------
            HERO: DIRETO, HUMANO E CLARO
            ---------------------------------------------------- */}
        <section className="relative border border-[var(--border-strong)] bg-[var(--bg-surface)] overflow-hidden">
          {/* Linha superior LED animada */}
          <div className="h-1 w-full led-border-flow" />

          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--volt-wash)] border border-[var(--volt-border)] font-mono text-[11px] text-[var(--volt)] font-semibold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Proposta de Desenvolvimento Web // AW Bikes</span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl md:text-[40px] font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08]">
                  Página de vendas rápida para bicicletas elétricas e divulgação da oficina presencial.
                </h1>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  Montei esta proposta pensando no funcionamento real da{' '}
                  <strong className="text-[var(--text-primary)]">AW Bikes</strong>: você trabalha com
                  um produto de alto valor — que o cliente escolhe pelo visual em movimento e pela
                  confiança técnica — e tem uma{' '}
                  <strong className="text-[var(--text-primary)]">
                    oficina física de manutenção
                  </strong>{' '}
                  que passa uma segurança enorme para quem está comprando pela internet.
                </p>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--volt)] pl-4 py-0.5">
                  A ideia não é fazer apenas um &ldquo;site bonito&rdquo;, mas construir uma
                  ferramenta de vendas leve para quem clica no anúncio pelo celular no 4G/5G, quer
                  ver a bike rodando em vídeo sem travar, entender a autonomia na hora e chamar sua
                  equipe no WhatsApp decidido a fechar.
                </p>
              </div>

              {/* Resumo Rápido Lateral */}
              <div className="lg:col-span-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase block">
                      Cliente
                    </span>
                    <strong className="font-display text-lg text-[var(--text-primary)]">
                      AW Bikes
                    </strong>
                  </div>
                  <span className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)] uppercase">
                    Rio de Janeiro, RJ
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Desenvolvedor:</span>
                    <span className="text-[var(--text-primary)] font-semibold">Felipe Teles</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Validade:</span>
                    <span className="text-[var(--text-primary)]">10 dias corridos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Mensalidade:</span>
                    <span className="text-[var(--signal-state)] font-bold">R$ 0,00 / mês</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">
                      Opção 1 (Fixa)
                    </span>
                    <strong className="text-sm text-[var(--text-primary)] tabular-nums">
                      R$ 950
                    </strong>
                  </div>
                  <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--volt-border)]">
                    <span className="text-[10px] text-[var(--volt)] block uppercase font-semibold">
                      Opção 2 (+ Painel)
                    </span>
                    <strong className="text-sm text-[var(--text-primary)] tabular-nums">
                      R$ 1.350
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            01. POR QUE UMA ESTRUTURA PRÓPRIA (4 PONTOS PRÁTICOS)
            ---------------------------------------------------- */}
        <section id="visao" className="space-y-6 scroll-mt-20">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--volt)] uppercase tracking-widest block">
              01 // VISÃO PRÁTICA
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Por que ter uma página própria em vez de plataformas alugadas?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
            <div className="bg-[var(--bg-surface)] p-5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-[var(--volt)] uppercase font-semibold">
                <span>01. Zero aluguel</span>
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Sem mensalidade de sistema
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Depois de entregue, você não paga aluguel mensal para manter o site no ar. O retorno
                das vendas e da oficina fica 100% no seu caixa.
              </p>
            </div>

            <div className="bg-[var(--bg-surface)] p-5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-[var(--signal-state)] uppercase font-semibold">
                <span>02. Celular 4G/5G</span>
                <Video className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Vídeos e fotos leves
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Bike elétrica se vende mostrando os detalhes em movimento. Os vídeos e imagens são
                otimizados para abrir rápido no celular, sem travar.
              </p>
            </div>

            <div className="bg-[var(--bg-surface)] p-5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-[var(--accent-focus)] uppercase font-semibold">
                <span>03. Foco em venda</span>
                <Gauge className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Respostas logo de cara
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Autonomia da bateria, velocidade, peso suportado, cores, parcelamento, frete no RJ e
                endereço da oficina visíveis nos primeiros segundos.
              </p>
            </div>

            <div className="bg-[var(--bg-surface)] p-5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-primary)] uppercase font-semibold">
                <span>04. Patrimônio seu</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                O site pertence à AW Bikes
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Todo o código e as contas de hospedagem ficam registrados no nome da AW Bikes. Você
                não fica preso a ninguém.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            02. ESTRUTURA DA PÁGINA & DEMONSTRAÇÃO INTERATIVA
            ---------------------------------------------------- */}
        <section id="estrutura" className="space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--volt)] uppercase tracking-widest block">
              02 // COMO VAI FUNCIONAR A PÁGINA
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Visual urbano e os 6 blocos da página
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Antes de programar, faremos uma conversa rápida de alinhamento para definir as cores, o
              estilo das letras (seguindo uma linha urbana e moderna, inspirada na{' '}
              <em className="text-[var(--text-primary)]">Vire Store</em>) e escolher os melhores
              vídeos e fotos das suas bicicletas.
            </p>
          </div>

          {/* SIMULADOR INTERATIVO ENXUTO (SPLIT LAYOUT) */}
          <div className="border border-[var(--border-strong)] bg-[var(--bg-surface)]">
            <div className="px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/60 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="text-[var(--volt)] font-semibold uppercase tracking-wider">
                Demonstração prática // Teste a troca de cor e a mensagem automática
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Clique nas cores abaixo para testar
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
              {/* Esquerda: Preview da Bike + Ficha Visual (7 col) */}
              <div className="lg:col-span-7 p-5 sm:p-6 space-y-5 bg-[var(--bg-base)]/40">
                <div className="relative py-4 px-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] flex flex-col items-center justify-center">
                  <svg
                    viewBox="0 0 420 185"
                    className="w-full max-w-[340px] h-auto transition-all duration-300"
                    role="img"
                    aria-label={`Ilustração da bicicleta elétrica na cor ${activeColor.name}`}
                  >
                    <ellipse cx="210" cy="168" rx="155" ry="7" fill="currentColor" className="opacity-10" />
                    <circle cx="95" cy="125" r="38" fill="none" stroke="currentColor" strokeWidth="12" className="opacity-80" />
                    <circle cx="95" cy="125" r="26" fill="none" stroke={activeColor.accentHex} strokeWidth="2" strokeDasharray="8 6" />
                    <circle cx="95" cy="125" r="10" fill={activeColor.primaryHex} stroke={activeColor.accentHex} strokeWidth="2" />
                    <circle cx="325" cy="125" r="38" fill="none" stroke="currentColor" strokeWidth="12" className="opacity-80" />
                    <circle cx="325" cy="125" r="26" fill="none" stroke={activeColor.accentHex} strokeWidth="2" strokeDasharray="8 6" />
                    <circle cx="325" cy="125" r="9" fill={activeColor.primaryHex} stroke={activeColor.accentHex} strokeWidth="2" />
                    <path d="M95 125 L165 125 L235 72 L150 72 Z" fill="none" stroke={activeColor.primaryHex} strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
                    <path d="M165 125 L278 65 L325 125" fill="none" stroke={activeColor.primaryHex} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
                    <rect x="182" y="74" width="56" height="18" rx="5" transform="rotate(-28 182 74)" fill={activeColor.primaryHex} stroke={activeColor.accentHex} strokeWidth="2" />
                    <path d="M122 65 L172 65 C178 65 180 73 172 75 L125 75 C118 75 116 65 122 65 Z" fill="currentColor" className="opacity-90" />
                    <path d="M278 65 L268 36 L292 32" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="290" cy="48" r="6" fill={activeColor.accentHex} />
                    <path d="M298 44 L328 36 L328 58 Z" fill={activeColor.accentHex} opacity="0.22" />
                  </svg>

                  <div className="w-full flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]/60 text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">
                      Cor selecionada: <strong className="text-[var(--text-primary)]">{activeColor.name}</strong>
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">{activeColor.tag}</span>
                  </div>
                </div>

                {/* Botões de Cor */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BIKE_COLORS.map((color) => {
                    const isSelected = activeColor.id === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setActiveColor(color)}
                        className={`flex items-center gap-2 p-2.5 border text-left font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[var(--volt)] bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: color.primaryHex }}
                        />
                        <span className="truncate">{color.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Ficha Visual Rápida (Estilo Vire Store) */}
                <div className="grid grid-cols-3 divide-x divide-[var(--border-subtle)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-[var(--signal-state)] font-mono text-[10px] uppercase">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span>Autonomia</span>
                    </div>
                    <strong className="font-mono text-base sm:text-lg text-[var(--text-primary)] block mt-0.5 tabular-nums">
                      Até 65 km
                    </strong>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-[var(--volt)] font-mono text-[10px] uppercase">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>Velocidade</span>
                    </div>
                    <strong className="font-mono text-base sm:text-lg text-[var(--text-primary)] block mt-0.5 tabular-nums">
                      32 km/h
                    </strong>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-[var(--accent-focus)] font-mono text-[10px] uppercase">
                      <Weight className="w-3.5 h-3.5" />
                      <span>Capacidade</span>
                    </div>
                    <strong className="font-mono text-base sm:text-lg text-[var(--text-primary)] block mt-0.5 tabular-nums">
                      Até 150 kg
                    </strong>
                  </div>
                </div>
              </div>

              {/* Direita: Mensagem Inteligente Gerada (5 col) */}
              <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--signal-state)] font-semibold block">
                    Como o cliente chega no seu WhatsApp
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    Quando o cliente clica na cor ao lado e aperta o botão de compra, o site já monta
                    a mensagem pronta para o atendimento da{' '}
                    <strong className="text-[var(--text-primary)]">AW Bikes</strong>:
                  </p>
                  <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-strong)] font-mono text-xs text-[var(--text-primary)] leading-relaxed">
                    &ldquo;Olá! Vi a bike elétrica na cor{' '}
                    <span className="text-[var(--volt)] font-bold underline underline-offset-2">
                      {activeColor.name}
                    </span>{' '}
                    pelo site da AW Bikes e quero saber sobre as condições no Pix/Cartão e a entrega
                    para o meu bairro.&rdquo;
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-[10px] text-[var(--signal-state)] uppercase font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Frete RJ Claro
                    </span>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Destaque para áreas com Frete Grátis e valor fixo para o restante do RJ.
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-[10px] text-[var(--volt)] uppercase font-semibold flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" /> Rota da Oficina
                    </span>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Botão direto para abrir a localização no Google Maps ou Waze com 1 toque.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OS 6 BLOCOS DA PÁGINA (GRADE LIMPA E DIRETA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
            {[
              {
                num: '01',
                title: 'Abertura com Vídeo (Topo)',
                icon: Video,
                text: 'Vídeo da bicicleta em ação rodando de forma fluida e silenciosa no fundo (ou foto de destaque), menu rápido no topo e botão direto para comprar ou chamar no WhatsApp.',
              },
              {
                num: '02',
                title: 'Vitrine de Modelos, Cores e Preços',
                icon: Palette,
                text: 'O cliente clica nas cores de cada modelo e vê a foto mudar na hora, além de galeria do painel, bateria, freios e pneus. Preço no Pix e parcelamento ficam claros para filtrar curiosos.',
              },
              {
                num: '03',
                title: 'Painel Visual de Ficha Técnica',
                icon: Gauge,
                text: 'Sem textos longos: cartões visuais rápidos com ícones destacando o que mais importa na compra — autonomia da bateria (km por carga), velocidade máxima e peso suportado.',
              },
              {
                num: '04',
                title: 'Logística e Frete no Rio de Janeiro',
                icon: Truck,
                text: 'Mostra como a bike chega pronta para rodar, destacando os bairros/municípios do RJ com Frete Grátis e informando o valor de frete fixo para as demais regiões do estado.',
              },
              {
                num: '05',
                title: 'Oficina e Assistência Presencial',
                icon: Wrench,
                text: 'Seu maior diferencial contra quem só vende online: apresenta os serviços de revisão e reparo, endereço físico com botão para Google Maps / Waze e agendamento rápido.',
              },
              {
                num: '06',
                title: 'Garantia e História da AW Bikes',
                icon: ShieldCheck,
                text: 'Apresentação da história da marca, quadro explicando os prazos de garantia de motor, bateria e estrutura, mais rodapé com todos os canais e horário da oficina.',
              },
            ].map((block) => {
              const Icon = block.icon;
              return (
                <div key={block.num} className="bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs text-[var(--volt)]">
                    <span className="font-bold">BLOCO {block.num}</span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                    {block.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {block.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ----------------------------------------------------
            03. BASTIDORES, RESPONSABILIDADES & CUSTO ZERO
            ---------------------------------------------------- */}
        <section id="bastidores" className="space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--volt)] uppercase tracking-widest block">
              03 // BASTIDORES &amp; CUSTOS DE MANUTENÇÃO
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              O que funciona por trás da tela e divisão do trabalho
            </h2>
          </div>

          {/* 3 pontos de bastidores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--signal-state)] font-semibold">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp com contexto</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Cada botão identifica qual bike, cor ou serviço de oficina o cliente estava olhando e
                preenche a mensagem automaticamente.
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--volt)] font-semibold">
                <Mail className="w-4 h-4" />
                <span>Avisos no e-mail da loja</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Disparo automático para o e-mail da AW Bikes caso alguém envie pedido de orçamento de
                oficina ou mensagem fora do horário comercial.
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-focus)] font-semibold">
                <Code2 className="w-4 h-4" />
                <span>Carregamento rápido e Google</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Feito em código limpo (Next.js) com servidores configurados na Vercel e backup no
                GitHub oficial da marca, ajudando também nas buscas do Google no RJ.
              </p>
            </div>
          </div>

          {/* Divisão de Responsabilidades + Custos lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Tabela Quem Faz o Quê (7 col) */}
            <div className="lg:col-span-7 border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/60 font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                O que cada parte faz
              </div>
              <div className="divide-y divide-[var(--border-subtle)] text-xs">
                {[
                  {
                    title: 'Design, Programação e Vídeos',
                    who: 'Felipe Teles',
                    whoColor: 'text-[var(--accent-focus)]',
                    desc: 'Criação da página para celular e PC, compressão dos vídeos e programação.',
                  },
                  {
                    title: 'Configuração de Contas e Servidores',
                    who: 'Felipe Teles',
                    whoColor: 'text-[var(--accent-focus)]',
                    desc: 'Criação do e-mail do projeto, contas na Vercel/GitHub/Supabase e domínio.',
                  },
                  {
                    title: 'Suporte Pós-Lançamento (15 dias)',
                    who: 'Felipe Teles',
                    whoColor: 'text-[var(--accent-focus)]',
                    desc: 'Acompanhamento próximo após o site ir ao ar para qualquer ajuste fino.',
                  },
                  {
                    title: 'Fotos, Vídeos e Tabelas',
                    who: 'AW Bikes',
                    whoColor: 'text-[var(--volt)]',
                    desc: 'Envio das fotos/vídeos das bikes, preços, cores e regra de bairros do frete.',
                  },
                ].map((row, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <strong className="text-[var(--text-primary)] block">{row.title}</strong>
                      <span className="text-[var(--text-secondary)]">{row.desc}</span>
                    </div>
                    <span className={`font-mono text-[11px] font-bold ${row.whoColor} shrink-0`}>
                      {row.who}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quanto custa manter no ar (5 col) */}
            <div className="lg:col-span-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/60 flex items-center justify-between font-mono text-xs">
                <span className="uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                  Custos após a entrega
                </span>
                <Server className="w-3.5 h-3.5 text-[var(--signal-state)]" />
              </div>
              <div className="divide-y divide-[var(--border-subtle)] text-xs">
                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[var(--text-primary)]">Hospedagem (Vercel)</strong>
                    <span className="font-mono font-bold text-[var(--signal-state)]">
                      R$ 0,00 / mês
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Faixa gratuita suporta com folga o tráfego dos seus anúncios no Instagram e
                    Google.
                  </p>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[var(--text-primary)]">Link Padrão</strong>
                    <span className="font-mono font-bold text-[var(--signal-state)]">R$ 0,00</span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Endereço pronto para uso imediato (<code>awbikes.vercel.app</code>).
                  </p>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[var(--text-primary)]">
                      Domínio .com.br (Opcional)
                    </strong>
                    <span className="font-mono text-[var(--text-secondary)]">~R$ 40 / ano</span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    Pago apenas uma vez por ano direto ao Registro.br se quiser usar{' '}
                    <code>www.awbikes.com.br</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            04. OPÇÕES DE INVESTIMENTO (R$ 950 e R$ 1.350)
            ---------------------------------------------------- */}
        <section id="investimento" className="space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--volt)] uppercase tracking-widest block">
              04 // OPÇÕES DE INVESTIMENTO
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Duas formas de entrega: escolha a ideal para a sua rotina
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              O visual e a velocidade do site para o seu cliente serão exatamente os mesmos nas duas
              opções.{' '}
              <strong className="text-[var(--text-primary)]">
                A única diferença é como você prefere atualizar preços e modelos no dia a dia:
              </strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* OPÇÃO 1 — R$ 950,00 */}
            <div
              onClick={() => setSelectedPackage('fixed')}
              className={`border p-6 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer transition-all ${
                selectedPackage === 'fixed'
                  ? 'border-[var(--volt)] bg-[var(--bg-surface)] ring-1 ring-[var(--volt)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2.5 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-secondary)] uppercase font-semibold">
                    OPÇÃO 01 // CATÁLOGO FIXO NO CÓDIGO
                  </span>
                  {selectedPackage === 'fixed' && (
                    <span className="text-[var(--volt)] font-bold">✓ Selecionada</span>
                  )}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  Landing Page Direta (Catálogo Fixo)
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Entrego a página pronta já com todos os seus modelos atuais, cores, vídeos, preços
                  e regras de frete configurados diretamente no código.
                </p>

                <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1 text-xs">
                  <strong className="font-mono text-[11px] text-[var(--text-primary)] uppercase block">
                    Para quem é indicada:
                  </strong>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Ideal se a sua tabela de preços, modelos de bicicletas e valores de frete mudam
                    pouco ao longo do ano. Como não há um painel separado de cadastro, o projeto é
                    mais rápido e mais econômico.{' '}
                    <span className="text-[var(--text-muted)]">
                      (Caso precise alterar preços, modelos ou fotos no futuro, podemos negociar atualizações pontuais sob demanda).
                    </span>
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--signal-state)] shrink-0" />
                    <span>Todos os 6 blocos + vídeos leves para celular</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--signal-state)] shrink-0" />
                    <span>Seletor de cores + Ficha técnica visual</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--signal-state)] shrink-0" />
                    <span>Mensagens prontas no WhatsApp + Oficina com Mapa</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-[var(--border-subtle)] space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase text-[var(--text-muted)]">
                    Investimento Total
                  </span>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] tabular-nums">
                    R$ 950<span className="text-lg font-normal text-[var(--text-muted)]">,00</span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs bg-[var(--bg-base)] p-4 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">50% / 50%:</span>
                    <strong className="text-[var(--text-primary)] tabular-nums">
                      R$ 475 entrada + R$ 475 entrega
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[var(--signal-state)]">
                    <span>À vista no Pix (com desconto):</span>
                    <strong className="tabular-nums font-bold">R$ 880,00</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Cartão de Crédito:</span>
                    <strong className="text-[var(--text-primary)] tabular-nums">
                      Em até 3x de R$ 335,00
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPackage('fixed')}
                  className={`w-full py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedPackage === 'fixed'
                      ? 'bg-[var(--volt)] text-[var(--volt-fg)]'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {selectedPackage === 'fixed'
                    ? '✓ Opção 1 Selecionada (R$ 950)'
                    : 'Selecionar Opção 1 (R$ 950)'}
                </button>
              </div>
            </div>

            {/* OPÇÃO 2 — R$ 1.350,00 */}
            <div
              onClick={() => setSelectedPackage('dynamic')}
              className={`border p-6 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer transition-all ${
                selectedPackage === 'dynamic'
                  ? 'border-[var(--volt)] bg-[var(--bg-surface)] ring-1 ring-[var(--volt)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="px-2.5 py-0.5 bg-[var(--volt-wash)] border border-[var(--volt-border)] text-[var(--volt)] uppercase font-bold">
                    OPÇÃO 02 // LIBERDADE TOTAL (+ PAINEL ADMIN)
                  </span>
                  {selectedPackage === 'dynamic' && (
                    <span className="text-[var(--volt)] font-bold">✓ Selecionada</span>
                  )}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  Landing Page Dinâmica + Painel Próprio
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Além de toda a página da Opção 1, construo um{' '}
                  <strong className="text-[var(--text-primary)]">
                    banco de dados em nuvem (Supabase) e uma área restrita com login e senha
                  </strong>{' '}
                  exclusiva para você, mais treinamento prático de 1 hora.
                </p>

                <div className="p-4 bg-[var(--bg-base)] border border-[var(--volt-border)] space-y-1 text-xs">
                  <strong className="font-mono text-[11px] text-[var(--volt)] uppercase block">
                    Para quem é indicada:
                  </strong>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Ideal se você quer <strong className="text-[var(--text-primary)]">liberdade total na rotina</strong>.
                    Mudou o preço do lote? Chegou uma cor nova? Resolveu fazer promoção de frete no
                    fim de semana? Você mesmo abre o painel pelo celular, digita o novo valor ou
                    sobe a foto nova e o site atualiza na hora, sem depender de programador.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--volt)] shrink-0" />
                    <span>Tudo da Opção 1 + Banco de Dados configurado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--volt)] shrink-0" />
                    <span>Painel de Controle com Login e Senha (celular ou PC)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--volt)] shrink-0" />
                    <span>Treinamento prático de 1 hora + Guia rápido de uso</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-[var(--border-subtle)] space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase text-[var(--text-muted)]">
                    Investimento Total
                  </span>
                  <div className="font-display font-black text-3xl sm:text-4xl text-[var(--text-primary)] tabular-nums">
                    R$ 1.350<span className="text-lg font-normal text-[var(--text-muted)]">,00</span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs bg-[var(--bg-base)] p-4 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">50% / 50%:</span>
                    <strong className="text-[var(--text-primary)] tabular-nums">
                      R$ 675 entrada + R$ 675 entrega
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[var(--signal-state)]">
                    <span>À vista no Pix (com desconto):</span>
                    <strong className="tabular-nums font-bold">R$ 1.250,00</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Cartão de Crédito:</span>
                    <strong className="text-[var(--text-primary)] tabular-nums">
                      Em até 3x de R$ 475,00
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPackage('dynamic')}
                  className={`w-full py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedPackage === 'dynamic'
                      ? 'bg-[var(--volt)] text-[var(--volt-fg)]'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {selectedPackage === 'dynamic'
                    ? '✓ Opção 2 Selecionada (R$ 1.350)'
                    : 'Selecionar Opção 2 (R$ 1.350)'}
                </button>
              </div>
            </div>
          </div>

          {/* Seletor da Forma de Pagamento */}
          <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="text-[var(--text-secondary)]">
                FORMA DE PAGAMENTO PARA:{' '}
                <strong className="text-[var(--volt)] uppercase">{currentPkg.shortName}</strong>
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Clique abaixo para escolher como prefere pagar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div
                onClick={() => setSelectedPayment('standard')}
                className={`border p-4 cursor-pointer transition-all space-y-1 ${
                  selectedPayment === 'standard'
                    ? 'border-[var(--accent-focus)] bg-[var(--bg-base)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-base)]/50 hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-muted)] uppercase">1. Parcelado 50% / 50%</span>
                  <span className="text-[var(--text-primary)] font-bold">Sem juros</span>
                </div>
                <div className="font-display font-bold text-base text-[var(--text-primary)] tabular-nums">
                  {currentPkg.entry} + {currentPkg.delivery}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Metade no início e metade somente na entrega final.
                </p>
              </div>

              <div
                onClick={() => setSelectedPayment('pix')}
                className={`border p-4 cursor-pointer transition-all space-y-1 ${
                  selectedPayment === 'pix'
                    ? 'border-[var(--signal-state)] bg-[var(--bg-base)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-base)]/50 hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-muted)] uppercase">2. À Vista no Pix</span>
                  <span className="text-[var(--signal-state)] font-bold">
                    Desconto de {currentPkg.pixDiscount}
                  </span>
                </div>
                <div className="font-display font-bold text-lg text-[var(--signal-state)] tabular-nums">
                  {currentPkg.pix}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Pagamento único à vista com desconto direto.
                </p>
              </div>

              <div
                onClick={() => setSelectedPayment('card')}
                className={`border p-4 cursor-pointer transition-all space-y-1 ${
                  selectedPayment === 'card'
                    ? 'border-[var(--volt)] bg-[var(--bg-base)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-base)]/50 hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[var(--text-muted)] uppercase">3. Cartão de Crédito</span>
                  <span className="text-[var(--text-primary)] font-bold">Até 3x</span>
                </div>
                <div className="font-display font-bold text-base text-[var(--text-primary)] tabular-nums">
                  Em até {currentPkg.cardInstallment}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Parcelamento via link seguro de cartão de crédito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            05. PRAZO DE ENTREGA (3 ETAPAS SIMPLES)
            ---------------------------------------------------- */}
        <section id="prazos" className="space-y-6 scroll-mt-20">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--volt)] uppercase tracking-widest block">
              05 // PRAZOS &amp; ETAPAS
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Cronograma de entrega
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Prazo completo de <strong className="text-[var(--text-primary)]">12 a 18 dias úteis</strong>{' '}
              para a Opção 1, ou de <strong className="text-[var(--volt)]">15 a 22 dias úteis</strong>{' '}
              para a Opção 2, dividido em três etapas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
            <div className="bg-[var(--bg-surface)] p-5 sm:p-6 space-y-2">
              <span className="font-mono text-xs text-[var(--volt)] font-bold block">
                ETAPA 01 // ALINHAMENTO E BASE
              </span>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Visual, vídeos e servidores
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Conversa inicial sobre o visual, recebimento das fotos/vídeos das bikes, compressão
                dos arquivos para ficarem leves e configuração dos servidores.
              </p>
            </div>

            <div className="bg-[var(--bg-surface)] p-5 sm:p-6 space-y-2">
              <span className="font-mono text-xs text-[var(--volt)] font-bold block">
                ETAPA 02 // CONSTRUÇÃO E FUNÇÕES
              </span>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Vitrine, frete e oficina
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Programação do seletor de cores, vitrine de preços, ficha técnica visual, regras de
                frete do RJ, mapa da oficina e mensagens de WhatsApp (mais Painel na Opção 2).
              </p>
            </div>

            <div className="bg-[var(--bg-surface)] p-5 sm:p-6 space-y-2">
              <span className="font-mono text-xs text-[var(--signal-state)] font-bold block">
                ETAPA 03 // TESTES E LANÇAMENTO
              </span>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                Revisão no celular e publicação
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Revisão geral junto com a AW Bikes, testes práticos de carregamento no celular
                (4G/5G), treinamento de 1h (na Opção 2) e publicação oficial.
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            BLOCO FINAL DE FECHAMENTO (COM LINHA LED ANIMADA)
            ---------------------------------------------------- */}
        <section className="border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 led-border-flow z-10" />
          <div className="absolute top-0 left-0 right-0 h-2.5 led-border-glow pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--signal-state)] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[var(--signal-state)] animate-pulse" />
                <span>Pronto para começar // {currentPkg.deadline}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                Qual das duas opções faz mais sentido para o momento atual da AW Bikes?
              </h2>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Clique no botão ao lado para me chamar no WhatsApp já com a opção escolhida e
                organizarmos o início do projeto.
              </p>

              <div className="p-3.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] font-mono text-xs space-y-1">
                <div>
                  Opção selecionada:{' '}
                  <strong className="text-[var(--volt)]">{currentPkg.shortName}</strong>
                </div>
                <div>
                  Pagamento:{' '}
                  <strong className="text-[var(--text-primary)]">
                    {paymentLabels[selectedPayment]}
                  </strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] px-6 py-3.5 bg-[var(--accent-focus)] hover:brightness-110 font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all shadow-[0_0_24px_rgba(255,85,0,0.22)]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Aprovar no WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={PDF_URL}
                download={PDF_FILENAME}
                className="w-full min-h-[46px] px-6 py-3 border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-[var(--accent-focus)] font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Proposta em PDF</span>
              </a>

              <div className="pt-2 text-center font-mono text-[11px] text-[var(--text-muted)]">
                Felipe Teles • WhatsApp: +55 (21) 97565-9408 • Rio de Janeiro, RJ
              </div>
            </div>
          </div>
        </section>

        {/* RODAPÉ SIMPLES */}
        <footer className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <Link
            href="/"
            className="hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para darkmode.id</span>
          </Link>
          <span>© 2026 Felipe Teles // darkmode.id — Proposta válida por 10 dias corridos.</span>
        </footer>
      </main>
    </div>
  );
}
