'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  CreditCard,
  Truck,
  Settings2,
  DollarSign,
  Download,
  Sun,
  Moon,
  ArrowLeft,
  Check,
  Info,
  Server,
  MessageCircle,
  ExternalLink,
  Headphones,
  CheckCircle2
} from 'lucide-react';

const PDF_URL = '/proposta-boutique-ne.pdf';
const PDF_FILENAME = 'Proposta-Boutique-Ne-Felipe-Teles.pdf';

type ProposalTheme = 'oled' | 'atelier';

export function ProposalView() {
  const [selectedPayment, setSelectedPayment] = useState<'standard' | 'pix' | 'card'>('standard');
  const [copiedLink, setCopiedLink] = useState(false);
  const [theme, setTheme] = useState<ProposalTheme>('oled');

  // Tema escopado a esta rota: o atributo é aplicado no <html> apenas enquanto
  // a proposta está montada e removido ao sair, preservando o darkmode.id intacto.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'atelier') {
      root.setAttribute('data-theme', 'atelier');
    } else {
      root.removeAttribute('data-theme');
    }
    return () => root.removeAttribute('data-theme');
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'oled' ? 'atelier' : 'oled'));

  const whatsappMessage = encodeURIComponent(
    'Olá Felipe! Li a proposta técnica da Boutique Nê e gostaria de aprovar o projeto para darmos início.'
  );
  const whatsappUrl = `https://wa.me/5521975659408?text=${whatsappMessage}`;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full text-[var(--text-primary)] print:bg-white print:text-black">
      {/* ========================================================
          BARRA DE TOPO EXECUTIVA / ISOLAMENTO
          ======================================================== */}
      <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 md:px-8 py-3.5 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Voltar para a página inicial do estúdio"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>darkmode.id</span>
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-state)] animate-pulse" />
              <span className="uppercase tracking-wider">Proposta Ativa // Confidencial</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'oled' ? 'Ativar modo Atelier (claro)' : 'Ativar modo OLED (escuro)'}
              title={theme === 'oled' ? 'Alternar para o modo Atelier (claro)' : 'Alternar para o modo OLED (escuro)'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {theme === 'oled' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{theme === 'oled' ? 'Modo Atelier' : 'Modo OLED'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              title="Copiar link direto desta proposta"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--signal-state)]" />
                  <span className="text-[var(--signal-state)]">Link Copiado</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar Link</span>
                </>
              )}
            </button>

            <a
              href={PDF_URL}
              download={PDF_FILENAME}
              title="Baixar a proposta em PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="sm:hidden">PDF</span>
              <span className="hidden sm:inline">Baixar PDF</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent-focus)] hover:brightness-110 font-mono text-xs font-semibold text-white tracking-wider transition-all shadow-[0_0_15px_rgba(255,85,0,0.25)]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Aprovar</span>
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================
          CONTEÚDO PRINCIPAL DA PROPOSTA
          ======================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 space-y-12 sm:space-y-16">
        
        {/* ----------------------------------------------------
            BLOCO HEADER EXECUTIVO & METADADOS FORMAIS
            ---------------------------------------------------- */}
        <section className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 md:p-10 overflow-hidden shadow-2xl">
          {/* Luz ambiente de fundo sutil com tom rosé da Boutique Nê */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--rose)]/10 via-[var(--accent-focus)]/5 to-transparent blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-8 border-b border-[var(--border-subtle)] pb-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[var(--accent-focus)] uppercase tracking-widest">
                <span>[ PROPOSTA COMERCIAL &amp; ESPECIFICAÇÃO ]</span>
              </div>
              
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]">
                Proposta Comercial &amp; Especificação de Projeto
              </h1>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Desenvolvimento de Loja Virtual Própria &amp; Painel Administrativo Sob Medida para a <span className="text-[var(--text-primary)] font-medium">Boutique Nê</span>.
              </p>
            </div>

            {/* Selo Visual do Cliente com o Logotipo Oficial */}
            <div className="flex items-center gap-4 p-3.5 sm:p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] self-start shrink-0">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-[#D4A39A]/30 bg-[#FBEFEA] flex items-center justify-center p-1 shadow-sm">
                <Image
                  src="/boutique-ne-logo.jpg"
                  alt="Logotipo Boutique Nê"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Cliente Oficial</div>
                <div className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">Boutique Nê</div>
                <div className="font-mono text-xs text-[var(--signal-state)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-state)]" />
                  Loja Virtual &amp; Painel
                </div>
              </div>
            </div>
          </div>

          {/* Grade de Metadados Executivos */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[11px]">Desenvolvedor Responsável</span>
              <p className="text-[var(--text-primary)] font-semibold text-sm">Felipe Teles</p>
              <span className="text-[var(--accent-focus)] text-[11px] block">Technical Lead &amp; Arquiteto</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[11px]">Data de Emissão</span>
              <p className="text-[var(--text-primary)] font-medium text-sm tabular-nums">Outubro de 2026</p>
              <span className="text-[var(--text-muted)] text-[11px] block">Condições Vigentes</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[11px]">Validade da Proposta</span>
              <p className="text-[var(--signal-state)] font-semibold text-sm tabular-nums">10 dias corridos</p>
              <span className="text-[var(--text-muted)] text-[11px] block">Garantia de Condições</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[11px]">Investimento Total</span>
              <p className="text-[var(--text-primary)] font-bold text-base tabular-nums">R$ 1.900,00</p>
              <span className="text-[var(--text-muted)] text-[11px] block">Zero Mensalidades</span>
            </div>
          </div>
        </section>


        {/* ----------------------------------------------------
            MÓDULO 01: OS 4 PILARES DA SUA LOJA PRÓPRIA
            ---------------------------------------------------- */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-focus)] uppercase tracking-widest">
              <span>01 // VISÃO GERAL E CONCEITO</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Os 4 Pilares da Sua Loja Própria
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Esta proposta apresenta a criação de uma <strong className="text-[var(--text-primary)] font-semibold">loja virtual exclusiva e independente</strong> para a <strong className="text-[var(--text-primary)] font-semibold">Boutique Nê</strong>, acompanhada de um <strong className="text-[var(--text-primary)] font-semibold">painel de gestão intuitivo</strong> para o controle total do seu negócio.
            </p>
            <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Diferente de plataformas prontas de mercado (como Nuvemshop ou Shopify), que funcionam como um <span className="text-[var(--text-primary)] font-medium">&quot;aluguel digital&quot;</span> onde a lojista paga mensalidades perpétuas e perde uma porcentagem sobre cada venda, a Boutique Nê terá um <strong className="text-[var(--text-primary)] font-semibold">ativo digital próprio</strong>:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
            {/* Pilar 1 */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3.5 hover:border-[var(--border-strong)] transition-all relative overflow-hidden group">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-focus)]/10 border border-[var(--accent-focus)]/30 flex items-center justify-center text-[var(--accent-focus)]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                    Zero Mensalidades &amp; Zero Comissões por Venda
                  </h3>
                </div>
                <div className="inline-block px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--signal-state)] font-mono text-[10px] tracking-wider uppercase font-semibold">
                  100% do lucro fica com a Boutique Nê
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                  Você não paga aluguel de plataforma para manter seu site no ar e nenhuma comissão sobre o faturamento. Todo o lucro das suas peças permanece integralmente com a sua marca.
                </p>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3.5 hover:border-[var(--border-strong)] transition-all relative overflow-hidden group">
              <div className="w-10 h-10 rounded-lg bg-[var(--signal-state)]/10 border border-[var(--signal-state)]/30 flex items-center justify-center text-[var(--signal-state)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                  Propriedade Real do Ativo
                </h3>
                <div className="inline-block px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--signal-state)] font-mono text-[10px] tracking-wider uppercase font-semibold">
                  Patrimônio digital da sua marca
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                  Todo o código-fonte, o banco de dados e as contas de servidores serão registrados no seu nome e da sua empresa. A loja é um ativo permanente que pertence a você, não a terceiros.
                </p>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3.5 hover:border-[var(--border-strong)] transition-all relative overflow-hidden group">
              <div className="w-10 h-10 rounded-lg bg-[var(--text-primary)]/10 border border-[var(--text-primary)]/20 flex items-center justify-center text-[var(--text-primary)]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                  Design Exclusivo e Alta Velocidade (Mobile-First)
                </h3>
                <div className="inline-block px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--accent-focus)] font-mono text-[10px] tracking-wider uppercase font-semibold">
                  Carregamento instantâneo no celular
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                  O site não utiliza temas genéricos ou repetitivos. A estrutura é construída sob medida para a identidade da Boutique Nê, com carregamento instantâneo que não trava no 4G/5G da cliente.
                </p>
              </div>
            </div>

            {/* Pilar 4 */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3.5 hover:border-[var(--border-strong)] transition-all relative overflow-hidden group">
              <div className="w-10 h-10 rounded-lg bg-[var(--rose)]/15 border border-[var(--rose)]/40 flex items-center justify-center text-[var(--rose)]">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-base sm:text-lg text-[var(--text-primary)]">
                  Flexibilidade Total de Operação
                </h3>
                <div className="inline-block px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] font-mono text-[10px] tracking-wider uppercase font-semibold">
                  Rio express + Envio nacional
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                  As regras do site se adaptam à rotina real do seu negócio: desde a entrega rápida no Rio de Janeiro combinada diretamente pelo WhatsApp até o cálculo automático de frete para outros estados.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ----------------------------------------------------
            MÓDULO 02: PERSONALIZAÇÃO VISUAL & ESCOPO ESTRUTURAL
            ---------------------------------------------------- */}
        <section className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-focus)] uppercase tracking-widest">
              <span>02 // DESIGN &amp; ARQUITETURA DE PÁGINAS</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Personalização Visual &amp; Escopo Estrutural da Loja
            </h2>
          </div>

          {/* Alinhamento de Design em Conjunto */}
          <div className="rounded-xl border border-[#D4A39A]/30 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--rose-wash)] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[var(--rose)]" />
              <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                Alinhamento de Design em Conjunto
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              A identidade visual da loja virtual será desenvolvida a partir de uma conversa de alinhamento direto com você. Nessa etapa, definiremos em conjunto:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-[var(--bg-base)]/80 border border-[var(--border-subtle)] space-y-1">
                <span className="font-mono text-xs text-[var(--accent-focus)] font-semibold block">01. Logo &amp; Cores</span>
                <p className="text-xs text-[var(--text-secondary)]">Aplicação do seu logotipo e paleta de cores oficial.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-[var(--bg-base)]/80 border border-[var(--border-subtle)] space-y-1">
                <span className="font-mono text-xs text-[var(--accent-focus)] font-semibold block">02. Tipografia</span>
                <p className="text-xs text-[var(--text-secondary)]">Seleção da tipografia (fontes) ideal para valorizar suas roupas e acessórios.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-[var(--bg-base)]/80 border border-[var(--border-subtle)] space-y-1">
                <span className="font-mono text-xs text-[var(--accent-focus)] font-semibold block">03. Banners &amp; Botões</span>
                <p className="text-xs text-[var(--text-secondary)]">Estilo dos banners principais e acabamento dos botões da página.</p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] italic pt-1">
              Essa flexibilidade garante que a Boutique Nê tenha um visual único e autêntico. Para manter a segurança de prazos e custos contratuais, a estrutura funcional das páginas segue o escopo fixo e detalhado a seguir.
            </p>
          </div>

          {/* As 4 Telas Principais da Loja */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {'// ESCOPO ESTRUTURAL DAS 4 TELAS PRINCIPAIS'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tela 1: Home */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-xs text-[var(--accent-focus)] font-bold">
                    01
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Página Inicial (Home)</h4>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Vitrine de Alta Conversão</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Topo (Header):</strong> Logotipo em destaque, menu limpo de categorias, barra de busca rápida, sacola com contador e botão de contato.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Banners Principais:</strong> Espaço nobre para novas coleções, lançamentos ou ações sazonais da loja.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Vitrine de Produtos:</strong> Grade limpa e rápida no celular com fotos sem distorções, preços e acesso direto.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Filtros Rápidos:</strong> Categorias (ex: Roupas, Acessórios) e seletores rápidos por tamanho (grades até o 44 e Tamanho Único).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Rodapé Institucional (Footer):</strong> Informações de contato, políticas, formas de pagamento aceitas e selos de segurança.</span>
                  </li>
                </ul>
              </div>

              {/* Tela 2: Página de Produto */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-xs text-[var(--accent-focus)] font-bold">
                    02
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Página do Produto</h4>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Experiência Tátil &amp; Detalhes</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Galeria Visual:</strong> Apresentação das fotos da peça em proporção vertical elegante, sem cortes indevidos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Zoom no Tecido:</strong> Ferramenta de aproximação para destacar o acabamento, costuras e texturas das roupas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Seleção Dinâmica:</strong> A cliente clica na cor desejada e visualiza instantaneamente apenas os tamanhos disponíveis para ela.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Suporte a Tamanho Único:</strong> Indicação clara e automática para acessórios e peças sem variação de numeração.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Botão de Compra em Destaque:</strong> Ação direta e intuitiva para adicionar o produto à sacola com feedback imediato.</span>
                  </li>
                </ul>
              </div>

              {/* Tela 3: Sacola & Checkout */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-xs text-[var(--accent-focus)] font-bold">
                    03
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Sacola de Compras &amp; Checkout</h4>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Finalização Sem Atrito</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Resumo Visual:</strong> Conferência rápida de peças, cores, tamanhos e quantidades selecionadas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Cupons de Desconto:</strong> Campo para aplicação e cálculo imediato de códigos promocionais.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Simulador de Frete:</strong> Cálculo automático de prazo e valor para qualquer CEP do Brasil.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Checkout Descomplicado:</strong> Fluxo rápido sem cadastros cansativos, focado em evitar abandono de carrinho.</span>
                  </li>
                </ul>
              </div>

              {/* Tela 4: Confirmação */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center font-mono text-xs text-[var(--accent-focus)] font-bold">
                    04
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Tela de Confirmação do Pedido</h4>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">Conclusão &amp; Acionamento</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Resumo Completo:</strong> Dados do pedido com número de identificação exclusivo para controle.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">Pix Automático:</strong> Exibição do QR Code Pix e código Copia e Cola na tela (ou confirmação de cartão).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-state)] shrink-0 mt-0.5" />
                    <span><strong className="text-[var(--text-primary)]">WhatsApp com 1 Toque:</strong> Botão para abrir o WhatsApp da loja para agendamento de entregas locais no Rio de Janeiro.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recursos Técnicos e Integrações Inclusas */}
          <div className="space-y-4 pt-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {'// RECURSOS TÉCNICOS & INTEGRAÇÕES INCLUSAS'}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {/* Bloco A: Pagamento */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[var(--signal-state)]" />
                      <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                        A. Meio de Pagamento Seguro (Provedor à Sua Escolha)
                      </h4>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Arquitetura flexível permitindo conectar o provedor mais vantajoso para a Boutique Nê (<strong className="text-[var(--text-primary)]">Mercado Pago</strong>, <strong className="text-[var(--text-primary)]">InfinitePay</strong> ou similares), respeitando a aprovação de conta:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-[11px] text-[var(--accent-focus)] font-semibold block">Integração Direta API</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Conexão oficial e segura entre a loja e a conta jurídica da Boutique Nê.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-[11px] text-[var(--signal-state)] font-semibold block">Pix em Tempo Real</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Geração automática de QR Code e Copia e Cola, confirmando a compra na hora.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-[11px] text-[var(--text-primary)] font-semibold block">Cartão Transparente</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Compra direto no site sem links estranhos, com opções de parcelamento.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-[11px] text-[var(--signal-state)] font-semibold block">Status Automático</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Atualização imediata para &quot;Pago&quot; no painel, sem conferir comprovante manual.</p>
                  </div>
                </div>
              </div>

              {/* Bloco B: Logística */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--accent-focus)]" />
                  <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                    B. Logística e Fretes Híbridos
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="font-mono text-xs text-[var(--text-primary)] font-semibold">1. Vendas Nacionais (Outros Estados)</div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Integração com os <strong className="text-[var(--text-primary)]">Correios (PAC e SEDEX)</strong> com cálculo automático de prazo de entrega e custo de frete com base no CEP da cliente.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="font-mono text-xs text-[var(--accent-focus)] font-semibold">2. Entregas no Rio de Janeiro (&quot;A Combinar via WhatsApp&quot;)</div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Modalidade pensada para entregas expressas locais: a cliente paga as roupas no checkout e, com 1 toque no botão final, abre o WhatsApp com pedido e endereço para combinar motoboy, Uber Flash ou 99 Entrega.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloco C: Painel Administrativo */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[var(--text-primary)]" />
                  <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
                    C. Painel Administrativo Próprio (Sua Central de Controle)
                  </h4>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Uma ferramenta administrativa protegida por senha, desenvolvida para ser operada com extrema facilidade pelo celular ou computador:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-xs text-[var(--text-primary)] font-semibold block">Controle de Estoque</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Cadastro flexível associando cores e quantidades por tamanho (P, M, G ou até o 44).</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-xs text-[var(--text-primary)] font-semibold block">Fotos em 2º Plano</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Upload assíncrono que não trava o navegador do celular mesmo se a rede 4G oscilar.</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-xs text-[var(--accent-focus)] font-semibold block">Módulo de Cupons</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Criação de cupons (% ou fixo em R$) com regras de validade, mínimo e limite.</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                    <span className="font-mono text-xs text-[var(--signal-state)] font-semibold block">Gestão em Tempo Real</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Acompanhe pedidos (Pendente, Pago, Enviado) com alteração manual quando necessário.</p>
                  </div>
                </div>
              </div>

              {/* Bloco D & E: Infraestrutura & Treinamento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[var(--accent-focus)]" />
                    <h4 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
                      D. Ecossistema Tecnológico Configurado
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    <li>• <strong className="text-[var(--text-primary)]">E-mail Administrativo Dedicado:</strong> Centralização das contas.</li>
                    <li>• <strong className="text-[var(--text-primary)]">GitHub:</strong> Código-fonte seguro em repositório privado da marca.</li>
                    <li>• <strong className="text-[var(--text-primary)]">Supabase:</strong> Banco de dados e armazenamento das fotos na nuvem.</li>
                    <li>• <strong className="text-[var(--text-primary)]">Vercel:</strong> Servidor de alta velocidade para manter o site rápido.</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-[var(--signal-state)]" />
                    <h4 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
                      E. Treinamento &amp; Suporte Inclusos
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                    <li>• <strong className="text-[var(--text-primary)]">Treinamento Prático (1 hora):</strong> Sessão guiada em vídeo ensinando a cadastrar peças, gerenciar estoque, criar cupons e acompanhar pedidos.</li>
                    <li>• <strong className="text-[var(--text-primary)]">Garantia de Lançamento (15 dias):</strong> Acompanhamento prioritário pós-publicação para tirar dúvidas e garantir estabilidade.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ----------------------------------------------------
            MÓDULO 03: DIVISÃO DE RESPONSABILIDADES
            ---------------------------------------------------- */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-focus)] uppercase tracking-widest">
              <span>03 // MATRIZ OPERACIONAL</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Divisão de Responsabilidades
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Total clareza de papéis para garantir que o projeto seja entregue com agilidade, sem ruídos e dentro do prazo estipulado.
            </p>
          </div>

          {/* Versão Desktop: Tabela Estruturada */}
          <div className="hidden md:block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3.5 px-5 font-semibold">Atribuição</th>
                  <th className="py-3.5 px-5 font-semibold">Responsável</th>
                  <th className="py-3.5 px-5 font-semibold">Detalhamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr className="hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Arquitetura, Programação e Design</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--accent-focus)] font-semibold">Felipe Teles</td>
                  <td className="py-3.5 px-5">Construção visual, código, checkout e painel administrativo</td>
                </tr>
                <tr className="hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Configuração de Infraestrutura</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--accent-focus)] font-semibold">Felipe Teles</td>
                  <td className="py-3.5 px-5">Abertura e integração de GitHub, Vercel, Supabase e e-mail</td>
                </tr>
                <tr className="hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Integração de Pagamento</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--accent-focus)] font-semibold">Felipe Teles</td>
                  <td className="py-3.5 px-5">Conexão da API do provedor escolhido (Mercado Pago, InfinitePay, etc.)</td>
                </tr>
                <tr className="hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Treinamento e Suporte de 15 dias</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--accent-focus)] font-semibold">Felipe Teles</td>
                  <td className="py-3.5 px-5">Orientação de uso e garantia operacional de lançamento</td>
                </tr>
                <tr className="hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Conta de Pagamento</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--rose)] font-semibold">Boutique Nê</td>
                  <td className="py-3.5 px-5">Conta no nome/CNPJ da marca no provedor escolhido para recebimento das vendas</td>
                </tr>
                <tr className="hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Alimentação do Catálogo de Peças</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--rose)] font-semibold">Boutique Nê</td>
                  <td className="py-3.5 px-5">Envio das fotos e cadastro das peças através do painel administrativo</td>
                </tr>
                <tr className="hover:bg-[var(--text-primary)]/[0.04] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Registro de Domínio Oficial</td>
                  <td className="py-3.5 px-5 font-mono text-[var(--rose)] font-semibold">Boutique Nê</td>
                  <td className="py-3.5 px-5">Escolha, verificação de disponibilidade e contratação do endereço próprio (se optado)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Versão Mobile (Vertical First - Zero quebras de layout) */}
          <div className="md:hidden space-y-3">
            {[
              {
                task: 'Arquitetura, Programação e Design',
                resp: 'Felipe Teles',
                color: 'text-[var(--accent-focus)]',
                desc: 'Construção visual, código, checkout e painel administrativo'
              },
              {
                task: 'Configuração de Infraestrutura',
                resp: 'Felipe Teles',
                color: 'text-[var(--accent-focus)]',
                desc: 'Abertura e integração de GitHub, Vercel, Supabase e e-mail'
              },
              {
                task: 'Integração de Pagamento',
                resp: 'Felipe Teles',
                color: 'text-[var(--accent-focus)]',
                desc: 'Conexão da API do provedor escolhido (Mercado Pago, InfinitePay, etc.)'
              },
              {
                task: 'Treinamento e Suporte de 15 dias',
                resp: 'Felipe Teles',
                color: 'text-[var(--accent-focus)]',
                desc: 'Orientação de uso e garantia operacional de lançamento'
              },
              {
                task: 'Conta de Pagamento',
                resp: 'Boutique Nê',
                color: 'text-[var(--rose)]',
                desc: 'Conta no nome/CNPJ da marca no provedor escolhido para recebimento das vendas'
              },
              {
                task: 'Alimentação do Catálogo de Peças',
                resp: 'Boutique Nê',
                color: 'text-[var(--rose)]',
                desc: 'Envio das fotos e cadastro das peças através do painel'
              },
              {
                task: 'Registro de Domínio Oficial',
                resp: 'Boutique Nê',
                color: 'text-[var(--rose)]',
                desc: 'Escolha, verificação de disponibilidade e contratação do endereço próprio (se optado)'
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-[var(--text-primary)]">{item.task}</span>
                  <span className={`font-mono text-[11px] font-bold ${item.color} shrink-0`}>{item.resp}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ----------------------------------------------------
            MÓDULO 04: TRANSPARÊNCIA DE CUSTOS EXTRAS & INFRAESTRUTURA
            ---------------------------------------------------- */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--signal-state)] uppercase tracking-widest">
              <span>04 // ZERO MENSALIDADES OCULTAS</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Transparência de Custos Extras e Infraestrutura
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              A arquitetura foi planejada para operar dentro das camadas gratuitas dos servidores, <strong className="text-[var(--text-primary)]">eliminando completamente gastos fixos recorrentes</strong> de hospedagem:
            </p>
          </div>

          {/* Tabela de Custos de Infraestrutura */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="py-3.5 px-5 font-semibold">Serviço</th>
                    <th className="py-3.5 px-5 font-semibold">Custo Estimado</th>
                    <th className="py-3.5 px-5 font-semibold">Observações Técnicas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <tr className="hover:bg-[var(--text-primary)]/[0.04]">
                    <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Hospedagem da Loja (Vercel)</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--signal-state)] font-bold tabular-nums">R$ 0,00 / mês</td>
                    <td className="py-3.5 px-5">Camada gratuita de alta capacidade para o fluxo da loja</td>
                  </tr>
                  <tr className="hover:bg-[var(--text-primary)]/[0.04]">
                    <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Banco de Dados e Imagens (Supabase)</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--signal-state)] font-bold tabular-nums">R$ 0,00 / mês</td>
                    <td className="py-3.5 px-5">Gratuito até 500 MB de dados e 1 GB de fotos (suficiente para milhares de acessos)</td>
                  </tr>
                  <tr className="hover:bg-[var(--text-primary)]/[0.04]">
                    <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Endereço Web Padrão (Vercel)</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--signal-state)] font-bold tabular-nums">R$ 0,00</td>
                    <td className="py-3.5 px-5">Link direto e seguro fornecido sem custos (ex: <code className="text-[var(--text-primary)]">boutiquene.vercel.app</code>)</td>
                  </tr>
                  <tr className="hover:bg-[var(--text-primary)]/[0.04]">
                    <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Domínio Próprio Oficial (Opcional)</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--accent-focus)] font-semibold">Valor sob consulta (anual)</td>
                    <td className="py-3.5 px-5">Sujeito à disponibilidade do nome e variação de preço da terminação escolhida</td>
                  </tr>
                  <tr className="hover:bg-[var(--text-primary)]/[0.04]">
                    <td className="py-3.5 px-5 font-semibold text-[var(--text-primary)]">Taxas de Pagamento</td>
                    <td className="py-3.5 px-5 font-mono text-[var(--text-primary)] font-semibold">Apenas por venda</td>
                    <td className="py-3.5 px-5">Sem mensalidade fixa; taxas padrão de mercado cobradas pelo provedor apenas sobre vendas concluídas</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Versão Mobile em Cards */}
            <div className="md:hidden divide-y divide-[var(--border-subtle)]">
              {[
                {
                  serv: 'Hospedagem da Loja (Vercel)',
                  cost: 'R$ 0,00 / mês',
                  highlight: 'text-[var(--signal-state)]',
                  obs: 'Camada gratuita de alta capacidade para o fluxo da loja'
                },
                {
                  serv: 'Banco de Dados e Imagens (Supabase)',
                  cost: 'R$ 0,00 / mês',
                  highlight: 'text-[var(--signal-state)]',
                  obs: 'Gratuito até 500 MB de dados e 1 GB de fotos (suficiente para milhares de acessos)'
                },
                {
                  serv: 'Endereço Web Padrão (Vercel)',
                  cost: 'R$ 0,00',
                  highlight: 'text-[var(--signal-state)]',
                  obs: 'Link direto e seguro sem custos (ex: boutiquene.vercel.app)'
                },
                {
                  serv: 'Domínio Próprio Oficial (Opcional)',
                  cost: 'Sob consulta (anual)',
                  highlight: 'text-[var(--accent-focus)]',
                  obs: 'Sujeito à disponibilidade do nome e Registro.br (~R$ 40/ano)'
                },
                {
                  serv: 'Taxas de Pagamento',
                  cost: 'Apenas por venda',
                  highlight: 'text-[var(--text-primary)]',
                  obs: 'Sem mensalidade fixa; apenas taxa transacional padrão por venda concluída'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-[var(--text-primary)]">{item.serv}</span>
                    <span className={`font-mono text-xs font-bold ${item.highlight} tabular-nums shrink-0`}>{item.cost}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">{item.obs}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detalhes sobre o Domínio Próprio Oficial */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] p-5 sm:p-6 space-y-3 font-sans text-xs sm:text-sm text-[var(--text-secondary)]">
            <h4 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)] flex items-center gap-2">
              <Info className="w-4 h-4 text-[var(--accent-focus)]" />
              Detalhes sobre o Domínio Próprio Oficial (Nome do Site):
            </h4>
            <ul className="space-y-2 leading-relaxed">
              <li>
                • <strong className="text-[var(--text-primary)]">Disponibilidade:</strong> Ter um endereço exclusivo (como <span className="font-mono text-[var(--accent-focus)]">boutiquene.com.br</span>) depende de o nome exato estar livre para registro. Caso o termo exato já tenha sido registrado por outra empresa no passado, avaliaremos em conjunto as melhores variações disponíveis (como <span className="font-mono text-[var(--text-primary)]">useboutiquene.com.br</span>, <span className="font-mono text-[var(--text-primary)]">boutiqueneoficial.com.br</span>, etc.).
              </li>
              <li>
                • <strong className="text-[var(--text-primary)]">Variação de Preço:</strong> O valor anual cobrado pelos órgãos registradores pode variar conforme a terminação desejada. Domínios brasileiros tradicionais (<span className="font-mono text-[var(--text-primary)]">.com.br</span>) geralmente partem de <strong className="text-[var(--text-primary)] font-mono">R$ 40,00 por ano</strong> no Registro.br, enquanto terminações internacionais (<span className="font-mono text-[var(--text-primary)]">.com</span>) ou específicas podem ter valores diferentes atrelados à cotação do fornecedor.
              </li>
              <li>
                • <strong className="text-[var(--text-primary)]">Opção Sem Custo:</strong> O registro de um domínio próprio é opcional. Se a Boutique Nê optar por não registrar um endereço exclusivo de início, o site poderá ser publicado e operar normalmente pelo endereço web padrão e gratuito (<span className="font-mono text-[var(--text-primary)]">boutiquene.vercel.app</span>).
              </li>
            </ul>
          </div>
        </section>


        {/* ----------------------------------------------------
            MÓDULO 05: INVESTIMENTO E CONDIÇÕES DE PAGAMENTO
            ---------------------------------------------------- */}
        <section id="condicoes-comerciais" className="space-y-6 scroll-mt-24">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-focus)] uppercase tracking-widest">
              <span>05 // CONDIÇÕES COMERCIAIS</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Investimento e Condições de Pagamento
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Para o desenvolvimento completo da loja virtual, implementação do painel de controle, conexões de frete/pagamento e treinamento operacional:
            </p>
          </div>

          {/* Destaque do Valor Total */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider block">
                Valor Total do Projeto
              </span>
              <div className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)] tabular-nums tracking-tight">
                R$ 1.900<span className="text-xl sm:text-2xl font-normal text-[var(--text-muted)]">,00</span>
              </div>
              <p className="text-xs text-[var(--signal-state)] font-mono flex items-center gap-1.5 pt-1">
                <Check className="w-3.5 h-3.5" />
                Sem mensalidades de plataforma e sem comissão sobre as vendas
              </p>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent-focus)] hover:brightness-110 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all shadow-[0_0_20px_rgba(255,85,0,0.3)]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Aprovar Proposta</span>
              </a>
            </div>
          </div>

          {/* 3 Opções de Pagamento com Seleção Tátil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Opção 1: 50% / 50% */}
            <div 
              onClick={() => setSelectedPayment('standard')}
              className={`rounded-xl border p-5 sm:p-6 space-y-3 cursor-pointer transition-all ${
                selectedPayment === 'standard'
                  ? 'border-[var(--accent-focus)] bg-[var(--bg-surface)] ring-1 ring-[var(--accent-focus)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase font-semibold">1. Condição Padrão</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold">50% / 50%</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Entrada + Entrega</h4>
                <div className="text-sm font-mono text-[var(--text-secondary)] space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Entrada (50%):</span>
                    <strong className="text-[var(--text-primary)] tabular-nums">R$ 950,00</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega Final (50%):</span>
                    <strong className="text-[var(--text-primary)] tabular-nums">R$ 950,00</strong>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-1">
                R$ 950,00 na aprovação da proposta para início e R$ 950,00 apenas na publicação da loja e conclusão do treinamento.
              </p>
            </div>

            {/* Opção 2: Pix com Desconto */}
            <div 
              onClick={() => setSelectedPayment('pix')}
              className={`rounded-xl border p-5 sm:p-6 space-y-3 cursor-pointer transition-all relative overflow-hidden ${
                selectedPayment === 'pix'
                  ? 'border-[var(--signal-state)] bg-[var(--bg-surface)] ring-1 ring-[var(--signal-state)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase font-semibold">2. À Vista no Pix</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--signal-state)]/10 text-[var(--signal-state)] font-bold">Economia R$ 100</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Pix com Desconto</h4>
                <div className="font-display font-extrabold text-2xl text-[var(--signal-state)] tabular-nums">
                  R$ 1.800<span className="text-sm font-normal text-[var(--text-muted)]">,00</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-1">
                Valor único de R$ 1.800,00 quitado na aprovação da proposta para ativação imediata de todo o cronograma.
              </p>
            </div>

            {/* Opção 3: Cartão de Crédito */}
            <div 
              onClick={() => setSelectedPayment('card')}
              className={`rounded-xl border p-5 sm:p-6 space-y-3 cursor-pointer transition-all ${
                selectedPayment === 'card'
                  ? 'border-[var(--text-primary)]/50 bg-[var(--bg-surface)] ring-1 ring-[var(--text-primary)]/30'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase font-semibold">3. Cartão de Crédito</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold">Até 3x</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Parcelado no Cartão</h4>
                <div className="font-display font-bold text-xl text-[var(--text-primary)] tabular-nums">
                  3x de R$ 670<span className="text-sm font-normal text-[var(--text-muted)]">,00</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed pt-1">
                Total de R$ 2.010,00 via link de pagamento seguro com taxa de parcelamento inclusa.
              </p>
            </div>
          </div>
        </section>


        {/* ----------------------------------------------------
            MÓDULO 06: CRONOGRAMA DE EXECUÇÃO
            ---------------------------------------------------- */}
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-focus)] uppercase tracking-widest">
              <span>06 // ETAPAS E PRAZOS</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Cronograma de Execução
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              O prazo total estimado para a conclusão e entrega do sistema é de <strong className="text-[var(--text-primary)] font-mono">20 a 25 dias úteis</strong>, distribuídos nas seguintes etapas transparentes:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Etapa 1 */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="font-mono text-xs text-[var(--accent-focus)] font-bold">ETAPA 01</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] tabular-nums font-semibold">
                  Dias 1 a 6
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
                  Alinhamento Visual, Infraestrutura &amp; Contas
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                  Reunião de alinhamento para definição dos detalhes de design, criação das contas técnicas da marca, configuração do banco de dados e montagem da estrutura inicial responsiva.
                </p>
              </div>
            </div>

            {/* Etapa 2 */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="font-mono text-xs text-[var(--accent-focus)] font-bold">ETAPA 02</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] tabular-nums font-semibold">
                  Dias 7 a 15
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
                  Pagamento, Fretes &amp; Painel Administrativo
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                  Integração da API do provedor de pagamento definido (Mercado Pago, InfinitePay ou equivalente), regras de frete (Correios e WhatsApp para o Rio de Janeiro) e finalização do painel de controle de estoque e cupons.
                </p>
              </div>
            </div>

            {/* Etapa 3 */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="font-mono text-xs text-[var(--signal-state)] font-bold">ETAPA 03</span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[var(--signal-state)]/10 text-[var(--signal-state)] tabular-nums font-semibold">
                  Dias 16 a 25
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)]">
                  Validação, Treinamento &amp; Publicação Oficial
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                  Testes práticos de ponta a ponta (compras simuladas, geração de Pix, cupons e atualização de estoque), sessão de treinamento em vídeo com a equipe da Boutique Nê e publicação oficial da loja.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ----------------------------------------------------
            CARD DE FECHAMENTO / APROVAÇÃO EXECUTIVA (CTA)
            ---------------------------------------------------- */}
        <section className="rounded-2xl border border-[var(--border-strong)] bg-gradient-to-b from-[var(--bg-surface)] to-[var(--bg-base)] p-6 sm:p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-[var(--accent-focus)]/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--signal-state)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-state)] animate-pulse" />
              <span>Pronta para Início Imediato</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Vamos colocar a loja própria da Boutique Nê no ar?
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              Para aprovar esta proposta e agendarmos a reunião de alinhamento visual da Etapa 1, toque no botão abaixo para me chamar diretamente no WhatsApp.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[var(--accent-focus)] hover:brightness-110 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all shadow-[0_0_30px_rgba(255,85,0,0.35)]"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Aprovar Proposta no WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={PDF_URL}
                download={PDF_FILENAME}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] font-mono text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Proposta em PDF</span>
              </a>
            </div>

            {/* Informações de Contato Direto */}
            <div className="pt-6 border-t border-[var(--border-subtle)]/60 text-xs font-mono text-[var(--text-muted)] space-y-1">
              <p className="text-[var(--text-primary)] font-semibold">
                Felipe Teles <span className="text-[var(--text-muted)] font-normal">{'// Technical Lead & Arquiteto de Software'}</span>
              </p>
              <p>
                WhatsApp Direto: <a href="https://wa.me/5521975659408" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent-focus)] underline underline-offset-2">+55 (21) 97565-9408</a> • Rio de Janeiro, Brasil
              </p>
              <p className="pt-2 text-[11px] text-[var(--text-muted)]">
                Proposta válida por 10 dias corridos a partir da data de emissão (Outubro de 2026).
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            RODAPÉ EXECUTIVO DISCRETO
            ---------------------------------------------------- */}
        <footer className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <Link
            href="/"
            className="hover:text-[var(--accent-focus)] transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Conhecer o estúdio darkmode.id</span>
          </Link>
          <div className="tabular-nums text-center sm:text-right">
            © 2026 darkmode.id // Felipe Teles. Todos os direitos reservados.
          </div>
        </footer>

      </main>
    </div>
  );
}
