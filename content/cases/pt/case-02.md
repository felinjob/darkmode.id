# Do Diário Oficial ao Edge: Engenharia de Dados, CRO e Decisões de Arquitetura no Resumos Santos

*Como o cruzamento analítico de dados públicos, a modelagem ética de prova social e uma arquitetura frontend orientada à conversão transformaram uma landing page pós-edital em uma plataforma de vendas de alto desempenho.*

---

Na teoria do marketing digital, uma landing page de infoproduto parece uma fórmula trivial: um título chamativo, alguns botões coloridos, prints de mensagens empilhados e uma tabela de preços com cronômetro de escassez artificial.

Na realidade brutal do mercado de concursos públicos de alto nível — como os certames de Arquitetura e Engenharia —, esse modelo simplista gera atrito imediato e rejeição.

Concurseiros experientes são profissionais analíticos. Eles leem editais na íntegra, detectam inconsistências pedagógicas em segundos e desconfiam imediatamente de promessas vazias. Quando o edital nº 74/2026 da Prefeitura de Santos (Banca IBAM) foi publicado, a janela temporal de lançamento exigia mais do que "fazer barulho": exigia **tangibilidade técnica, prova social auditável e fricção zero de navegação no mobile**.

Abaixo, detalho as decisões de engenharia de software, o pipeline analítico de dados e os trade-offs de UX/UI adotados para construir a plataforma comercial do **Resumos Legislação Santos 2026**.

---

## 1. Do Dado Bruto à Prova Auditada: Pipeline de Cruzamento e Conformidade LGPD

O maior desafio de credibilidade em infoprodutos preparatórios é o ceticismo em relação a depoimentos. Qualquer página pode inventar frases aleatórias; poucas conseguem lastrear seus números em registros oficiais.

Possuíamos dois conjuntos de dados desestruturados referentes ao concurso anterior da Prefeitura de Campinas (Edital 01/2025):

1. Uma base transacional de vendas (`.xlsx`) com centenas de registros de alunos, e-mails e metadados de compra.
2. O Diário Oficial da Prefeitura de Campinas em formato PDF vetorial com centenas de páginas contendo a lista nominal de classificados, notas, cotas (LAC, PPP, PcD) e atos de convocação.

### O Pipeline de Reconciliação em Python

Em vez de aceitar estimativas empíricas de aprovação, implementamos um pipeline analítico de auditoria textual para cruzar as duas fontes:

```
┌──────────────────────────┐          ┌──────────────────────────┐
│   Planilha de Vendas     │          │  Diário Oficial (PDF)    │
│ (Clientes, CPFs, E-mails)│          │  (Atos de Convocação)    │
└────────────┬─────────────┘          └────────────┬─────────────┘
             │                                     │
             v                                     v
     Sanitização e N-Gram              Extração Vetorial (PyPDF)
   Normalização Unicode (NFD)         Remoção de Metadados / Header
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                                v
                   Algoritmo de Conciliação
               (Exact Matching + Token Fallback)
                                │
                                v
                  Métricas Oficiais Auditadas:
             • 12 Alunos Classificados na Lista
             • 5 Alunos no Top 10 Geral
             • 4 Convocados / Nomeados Imediatos
```

Utilizamos técnicas de normalização Unicode (`NFKD`) para remover acentuações e tratamos correspondências parciais por decomposição de tokens. O cruzamento revelou com precisão cirúrgica: **12 alunos classificados**, sendo **5 deles posicionados no Top 10** (incluindo o 5º lugar geral e o 3º lugar PcD), com convocações comprovadas no Diário Oficial.

### O Trade-off Ético: Privacidade vs. Impacto Comercial

Com a lista de nomes confirmada, a primeira sugestão de marketing foi publicar a lista completa com nome e colocação de cada aluno.

Essa ideia foi descartada. Exibir publicamente o nome civil de concurseiros sem consentimento explícito viola as diretrizes da LGPD e expõe a privacidade de quem muitas vezes presta concursos de forma reservada.

Optamos por um padrão inspirado nas melhores plataformas analíticas de estudo:

* **Mosaico Estatístico e Big Numbers:** O usuário é impactado pelos dados agregados consolidados (12 classificados, 5 no Top 10, 4 nomeações).
* **Spotlight Qualificado:** Apenas alunos que enviaram relatos voluntários e autorizados (como o Thiago Darlan, 5º colocado, e a Vanessa de Moraes, 10ª colocada) receberam destaque individual de relato.
* **Anonimização com Disclaimer Legal:** Inclusão de nota transparente informando a preservação nominal dos demais aprovados.

---

## 2. Tangibilizando o "Futuro": Desconstruindo a Insegurança do Pós-Edital

Um dos maiores gargalos de conversão em cursos pós-edital reside no fato de que o conteúdo completo quase nunca é entregue no ato da compra. Legislações municipais densas (como o Plano Diretor e a Lei de Licenciamento Ambiental de Santos) demandam tempo de esquematização e gravação.

Se a página oculta essa realidade, os índices de reembolso explodem nos primeiros 7 dias. Se a página expõe essa informação de forma burocrática, a taxa de conversão desaba.

### A Decisão de UI/UX: Cronograma de Entregas Como Feature

Transformamos o calendário de produção em um ativo de confiança (`ScheduleSection.tsx`):

| Atributo | Abordagem Comum de Mercado | Nossa Abordagem no Resumos Santos |
| --- | --- | --- |
| **Status do Conteúdo** | Promessas genéricas de "Acesso Imediato" | Linha do tempo visual com datas exatas por norma |
| **Formato de Entrega** | Venda apenas do PDF sem previsibilidade | Separação explícita entre data do PDF e da videoaula |
| **Amostra do Produto** | "E-book grátis" genérico com captura de lead | Amostra real e direta da primeira norma no próprio site |

Cada uma das 8 legislações municipais recebeu um card visual contendo a data precisa da liberação do resumo esquematizado e a data posterior da videoaula com questões comentadas.

Para eliminar qualquer atrito de decisão, a **Lei Complementar nº 1.196/2023** foi disponibilizada imediatamente para download direto (`/Nova-Amostra-Resumo-Santos.pdf`) em um clique, sem formulários ou barreiras. Quando o visitante abre o documento e percebe a profundidade do material, o valor percebido ancora no topo.

---

## 3. Ergonomia Mobile e o Redesenho do Componente de Depoimentos

Mais de 78% do tráfego qualificado de concursos públicos originado de anúncios e redes sociais acessa a landing page pelo smartphone. Em telas de 390px de largura, erros de ergonomia custam vendas.

Na primeira iteração da seção de depoimentos, os prints do WhatsApp foram organizados em cards brancos tradicionais, contendo badges coloridas, títulos em negrito, transcrições repetidas do texto e a miniatura da mensagem:

```
┌──────────────────────────────────────────────────┐
│ [BADGE: APROVADO]                           " "  │
│ "O material foi fundamental pra eu passar!"      │  <-- Redundância de texto
│ Muito obrigado! O material foi fundamental...    │
│ ┌──────────────────────────────────────────────┐ │
│ │  [Print do WhatsApp com letras ilegíveis]    │ │  <-- Espaço minúsculo
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

Essa estrutura gerava dois problemas críticos:

1. **Poluição Cognitiva e Redundância:** O visitante lia a mesma frase três vezes no mesmo card.
2. **Ilegibilidade da Imagem:** Em telas móveis, o texto da conversa dentro do print ficava microscópico, forçando o usuário a desistir da leitura.

### A Refatoração da Prova Social: Galeria Touch e Lightbox Nativo

Reescrevemos o componente (`TestimonialsSection.tsx`) adotando três princípios:

1. **Remoção de Ruído Visual:** Eliminamos caixas, sombras pesadas e tags artificiais ("Aprovado", "Aluno"). As capturas reais de tela foram posicionadas diretamente no layout, transmitindo autenticidade orgânica.
2. **Curadoria Progressiva:** Exibição inicial limitada aos prints mais fortes, complementada por um botão expansível sutil (*"Ver mais depoimentos reais"*), evitando a rolagem vertical infinita no mobile.
3. **Lightbox com Navegação por Gestos (*Touch Swipe*):** Ao tocar em qualquer imagem, a tela cheia abre instantaneamente com *backdrop blur*. Em vez de obrigar o usuário a fechar o modal para ver o próximo print, implementamos navegação contínua por gestos de arrasto lateral (*swipe*) no celular e botões semitransparentes no desktop.

```typescript
// Lógica simplificada do gesto de swipe para navegação mobile
const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.targetTouches[0].clientX;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  const diff = touchStartX.current - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0 && hasNext) nextSlide();
    if (diff < 0 && hasPrev) prevSlide();
  }
};
```

---

## 4. Arquitetura Frontend & Escolhas de Stack

A velocidade de carregamento em redes móveis 4G/5G oscilantes é um dos maiores fatores de ranqueamento e conversão. Adotar uma stack inchada com dezenas de dependências de terceiros degradaria os Core Web Vitals.

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 14+ (App Router)                    │
│             SSG / ISR com Otimização no Edge                │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       Next/Font (Google)                Tailwind CSS
  Plus Jakarta Sans + Inter           Design System Atômico
 (Zero Layout Shift - CLS = 0)         Purge de CSS (< 18KB)
               │                               │
               └───────────────┬───────────────┘
                               │
                               v
                    Vercel Edge Network
            (LCP < 1.1s | TTFB < 90ms no Brasil)
```

* **Next.js App Router com Renderização Estática:** A landing page é compilada no build como HTML/CSS puramente estático. O Time to First Byte (TTFB) opera abaixo de 90ms na borda da Vercel no Brasil, garantindo Largest Contentful Paint (LCP) inferior a 1,1 segundo.
* **Tipografia Racionalizada:** Eliminamos fontes experimentais de alto peso que causavam *Cumulative Layout Shift* (CLS). Adotamos a `Plus Jakarta Sans` para títulos e hierarquia de autoridade, combinada com a `Inter` para leitura longa, pré-carregadas nativamente pelo `next/font`.
* **Tailwind CSS e Zero Fuga de Tráfego:** O CSS compilado final pesa menos de 18 KB. O header da página foi deliberadamente desenhado sem links de navegação âncora ("Quem Somos", "Dúvidas"), canalizando 100% da atenção visual para os botões de conversão e para o download da amostra.

---

## 5. Engenharia de Preço e Redução do Atrito de Compra

Uma boa interface não sobrevive a uma estratégia comercial mal comunicada. O checkout precisava ancorar o valor do curso sem parecer confuso entre a compra avulsa da legislação e o combo de preparação integrada.

### Ancoragem Dinâmica e Apresentação do Parcelamento

Em compras digitais de tíquete médio, o valor total à vista muitas vezes assusta o comprador que está no início da preparação. Implementamos uma ancoragem tripla no card de checkout:

1. **Preço Cheio Ancorado:** Exibição do valor nominal (`R$ 234,00`) riscado.
2. **Desconto Ativo por Cupom:** Destaque do preço promocional à vista com código aplicado (`R$ 210,60 com SANTOS10`).
3. **Parcelamento de Baixo Atrito:** Cálculo visual direto do parcelamento no cartão (`12x de R$ 24,20`), reduzindo a barreira psicológica de entrada para um valor menor que uma refeição por mês.

Todos os fluxos foram configurados para direcionar diretamente ao gateway da Eduzz com selos nativos de segurança e garantia incondicional de 7 dias, neutralizando de forma antecipada as principais objeções de risco levantadas no FAQ interativo.

---

O resultado técnico e comercial do Resumos Santos comprova que uma landing page de alta performance não nasce de templates prontos ou fórmulas mágicas de marketing. Ela é fruto da convergência entre rigor na análise de dados, clareza sobre as dores reais do usuário e uma engenharia de frontend disciplinada que trata cada milissegundo de carregamento e cada pixel da interface como fatores determinantes para o sucesso do produto.
