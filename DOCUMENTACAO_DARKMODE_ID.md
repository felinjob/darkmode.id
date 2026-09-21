# DOCUMENTAÇÃO TÉCNICA E ARQUITETURAL // darkmode.id
**Posicionamento:** Information Design & Software Engineering  
**Liderança Técnica & Fundação:** Felipe Teles (Technical Lead & Founder)  
**Data da Auditoria & Refatoração:** Setembro de 2026  
**Stack Tecnológica:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Turbopack, i18n Nativo (PT/EN)

---

## 1. TESE DE POSICIONAMENTO E DECISÕES DE COPYWRITING

### 1.1. O Problema Anterior e a Ruptura de Paradigma
Anteriormente, o site utilizava terminologias vagas e comuns ao mercado tradicional de agências digitais e estúdios promocionais — como "boutique studio de tecnologia criativa", menções dispersas a "code & design" e descrições genéricas que não transmitiam autoridade de engenharia de missão crítica nem a profundidade da formação matemática e técnica do fundador.

Havia três falhas estratégicas no posicionamento prévio:
1. **Termos Inflados e Jargão de Agência:** Palavras como "boutique" ou expressões puramente visuais atraem clientes em busca de serviços cosméticos, afastando CTOs, diretores de operações e líderes técnicos que contratam capacidade de resolver gargalos arquiteturais de software.
2. **Diluição da Liderança Técnica:** Não estava claro quem assumia o código e a responsabilidade da entrega. Projetos complexos exigem um interlocutor puramente técnico e execução sem intermediários (gerentes de produto delegadores, contas de atendimento).
3. **Ausência do "Information Design" como Disciplina Central:** A interface era tratada como estética isolada, e não como uma ferramenta de **redução de atrito cognitivo**, aceleração de tomadas de decisão e estruturação visual de dados sob pressão operacional.

### 1.2. As Novas Decisões de Copywriting
A refatoração implementou um tom austero, assertivo e técnico:
- **Zero Termos Inflados:** Eliminação total de adjetivos publicitários vazios (*"apaixonados por inovação"*, *"soluções disruptivas"*).
- **Consolidação Institucional:** `darkmode.id // Information Design & Software Engineering`. A marca é uma prática técnica independente que projeta e implementa software na fronteira entre arquitetura de dados, ergonomia de hardware e legibilidade humana.
- **Modelo Founder-Led Studio:** Toda a interlocução e execução de engenharia é liderada e realizada diretamente por **Felipe Teles** (Technical Lead & Founder), garantindo responsabilidade de ponta a ponta sem assimetrias entre concepção e código em produção.
- **Foco em Sistemas em Produção Real:** Eliminação de qualquer formato de "currículo acadêmico" ou lista passiva de cursos. A autoridade é estabelecida exclusivamente por métricas de produção, SLAs cravados, integridade de dados transacionais e conformidade legal (LGPD).

---

## 2. ENGENHARIA ÓPTICA E DESIGN SYSTEM (DESIGN TOKENS)

O portfólio não adota o modo escuro como preferência cosmética, mas como uma **disciplina de engenharia física de display e ergonomia visual**.

### 2.1. Mitigação do *Black Smearing* em Painéis OLED/AMOLED (120Hz)
Em telas OLED/AMOLED, o preto absoluto (`#000000`) desliga fisicamente os diodos emissores de luz. Quando o usuário rola a página rapidamente em altas taxas de atualização (120Hz em telas móveis e monitores modernos), a reativação dos diodos sofre um atraso físico de milissegundos (*turn-on latency*), criando um arrasto visual roxo/azulado conhecido como *black smearing*.

- **Solução Arquitetural:** O fundo estrutural do site (`--bg-base`) foi calibrado para **`#0A0B0D`**. Esse valor fornece aproximadamente **4% de luminância**, mantendo uma corrente elétrica residual mínima que estabiliza os diodos sem desligá-los, eliminando 100% do arrasto em scroll rápido.

### 2.2. Degraus de Luminância em Vez de Sombras Falsas
No mundo físico e no design de sistemas brutalistas, sombras projetadas decorativas (*drop-shadows* difusas) geram ruído visual e diluem a definição das bordas.

- A profundidade visual foi construída exclusivamente através de degraus de luminância das superfícies:
  - `--bg-base`: `#0A0B0D` (Fundo estrutural e margens)
  - `--bg-surface`: `#131518` (+4% de luminância para cartões modulares e grades de informação)
  - `--bg-elevated`: `#1C1E22` (+4% adicional para modais, docks e gavetas de contato)
- **Bordas Táticas de 1px:** Divisores secos com corte milimétrico em `--border-subtle: #22262C` e foco em `--border-strong: #323742`.

### 2.3. Contraste Algorítmico APCA / WCAG 2.2 AAA
- **Texto Primário (`--text-primary: #EDEDF0`):** O uso deliberado de um cinza-claro em vez do branco absoluto (`#FFFFFF`) previne a halação luminosa e fadiga ocular crônica em ambientes com baixa luz.
- **Texto Secundário (`--text-secondary: #8F96A3`):** Proporciona hierarquia de leitura fluida para parágrafos analíticos e descrições operacionais.
- **Acentos Funcionais:**
  - `--accent-focus: #FF5500`: Laranja industrial de conversão e foco primário.
  - `--signal-state: #00DF81`: Verde terminal pulsante que comunica estabilidade de sistema (`SYSTEM: OPERATIONAL`).

### 2.4. Rigor Tipográfico e Numerais Tabulares (`tabular-nums`)
Para cumprir as diretrizes do Information Design (Edward Tufte):
- **Syne (`--font-display`):** Tipografia geométrica brutalista de alto contraste para kickers e títulos principais.
- **Geist (`--font-sans`):** Fonte técnica neutra desenvolvida pela Vercel para máxima legibilidade de parágrafos.
- **Geist Mono (`--font-mono`):** Utilizada em todos os metadados, identificadores (`CASE 01 // 03`), métricas e comandos.
- **`font-variant-numeric: tabular-nums`:** Regra global inserida em `app/globals.css` garantindo que todos os números de latências, porcentagens e contadores tenham larguras idênticas de glifo, eliminando saltos de layout e permitindo escaneamento ocular vertical instantâneo.

---

## 3. MAPEAMENTO DETALHADO DOS COMPONENTES E ARQUITETURA

### 3.1. Metadados Globais e SEO (`app/layout.tsx`)
- **Title Institucional:** `darkmode.id // Information Design & Software Engineering`
- **Description:** *"Prática técnica independente de engenharia de software e design da informação. Interfaces táteis de baixa latência, arquitetura de dados e sistemas de alto desempenho."*
- **Keywords:** Indexação técnica orientada a: `Information Design`, `Software Engineering`, `Complex Systems`, `MES Industrial`, `Tactile Interfaces`, `Data Architecture`, `OLED Ergonomics`, `Felipe Teles`.
- **OpenGraph & Twitter Cards:** Configurados com proporção 1200x630 e imagem oficial de alta fidelidade (`/og-image.png`).
- **Favicon de Terminal (`app/icon.svg`):** Substituição do ícone padrão do framework por um SVG circular preto com o caractere `_` em fonte monoespaçada branca, remetendo a um cursor de terminal ativo.

### 3.2. Cabeçalho do Sistema (`components/system-header.tsx`)
- **Logotipo Dinâmico (`DynamicLogo`):** Preservado com animação cadenciada de termos técnicos que trava no sufixo `.id_`.
- **Subtítulo Institucional:** Inclusão em telas médias e grandes (`hidden md:inline-block`) do descriptor:
  `// INFORMATION DESIGN & SOFTWARE ENGINEERING` em fonte mono atenuada (`--text-muted`).
- **Telemetria de Sistema:** Reativação do indicador de integridade operacional em tempo real:
  `SYSTEM: OPERATIONAL` acompanhado de um indicador luminoso em verde esmeralda (`#00DF81`) pulsante.
- **Alternador de Idioma (i18n):** Alternância instantânea entre rotas `/pt` e `/en` sem reload da aplicação.
- **Easter Egg do Modo Claro:** Botão solar que aciona um aviso visual no terminal alertando a recusa do estúdio a layouts de alto brilho: `[ ERROR: APENAS DARK MODE POR AQUI ]`.

### 3.3. Hero Section (`components/hero-manifesto.tsx`)
- **Kicker Superior:** `[ SPECIALIZED PRACTICE // 2026 ]` em acento industrial laranja.
- **Título Brutalista:** Renderizado em três linhas contundentes com espaçamento vertical comprimido (`leading-[0.92]`):
  ```
  INTERFACES TÁTEIS.
  SISTEMAS COMPLEXOS.
  DESIGN DA INFORMAÇÃO.
  ```
- **Copy de Suporte:**
  *"Projetamos e implementamos software na fronteira entre arquitetura de dados, ergonomia de hardware e legibilidade humana. Eliminamos o ruído cognitivo para acelerar decisões críticas e garantir integridade operacional."*
- **Linha de Comando Inferior:**
  `INFORMATION DESIGN // DATA ARCHITECTURE // LOW-LATENCY SYSTEMS` em numerais e glifos monoespaçados.

### 3.4. Seção Institucional: `STUDIO // PRACTICE` (`components/studio-practice.tsx`)
Substituiu o antigo módulo isolado do fundador por uma estrutura técnica integrada:
- **Bloco 01 — The Practice (A Prática Independente):**
  - Conceituação da prática técnica que recusa intermediários burocráticos, gerentes de produto e estruturas inchadas de agência.
  - Interlocução direta entre clientes técnicos e o arquiteto executor.
- **Bloco 02 — Technical Leadership & Direct Execution:**
  - Apresentação de **Felipe Teles** como diretor técnico e desenvolvedor de código em produção.
  - Telemetria de sistema: `ROLE: TECHNICAL LEAD & FOUNDER`, `STATUS: ACTIVE`.
  - Retrato austero em preto e branco com filtro de alto contraste e iluminação chiaroscuro.
- **Grid dos 4 Princípios Operacionais:**
  1. `01 // DADO-PIXEL & DENSIDADE:` Maximização da taxa dado-tinta (Edward Tufte). Eliminação de *chartjunk* e elementos cosméticos; cada pixel cumpre uma função informacional.
  2. `02 // ERGONOMIA ÓPTICA & HARDWARE:` Superfície base com 4% de luminância para painéis OLED 120Hz. Contraste APCA sem sombras decorativas.
  3. `03 // ORÇAMENTO RÍGIDO DE PERFORMANCE:` Padrões estritos de Core Web Vitals cravados em produção: LCP < 1.2s, CLS = 0, INP < 50ms. Zero *bloatware*.
  4. `04 // INTEGRIDADE & BAIXO NÍVEL:` Determinismo estrutural, pipelines auditáveis e conformidade técnica (LGPD). Rigor na manipulação de memória e alocação de bytes.

### 3.5. Vitrine de Projetos (Selected Works) e Dimensão "Information Challenge"
No componente `components/project-card.tsx`, cada projeto foi atualizado para expor três camadas complementares de engenharia:
1. **Desafio Operacional (`Operational Challenge`):** O contexto real do negócio e as restrições físicas encontradas.
2. **Desafio de Informação (`Information Challenge`):** Como os dados foram arquitetados, estruturados e representados visualmente para eliminar ruído e acelerar a tomada de decisão.
3. **Core Architecture & Métricas:** As tecnologias de infraestrutura e os números auditáveis de produção (com `tabular-nums`).

#### Os Três Projetos Canônicos da Vitrine:
- **Case 01 — Dora MES (Sistema Operacional de Manufatura Têxtil):**
  - *Information Challenge:* Arquitetura visual para chão de fábrica, decomposição de ordens matriciais e cálculo de perdas sob iluminação industrial e luvas.
  - *Stack:* Next.js PWA, Firestore (Real-time), Cloud Run, Estado Desacoplado.
  - *Métricas:* -100% Fichas de Papel, Rastreabilidade Por Fardo, Latência < 45ms, Tempo de Lote -35%.
  - *Ações:* Link para o Estudo Completo e Sandbox Interativo do chão de fábrica (`/sandbox/dora-mes`).
- **Case 02 — Santos PREP (Engine de Aquisição & Auditoria de Dados):**
  - *Information Challenge:* Auditoria estatística e estruturação visual de dados brutos do Diário Oficial com privacidade LGPD.
  - *Stack:* Next.js App Router, Tailwind CSS (Zero-runtime), Modal Proprietário, Python Data Pipeline.
  - *Métricas:* Core Web Vitals 100/100, 5 Aprovados no Top 10, CLS 0.00, LCP Mobile 0.8s.
- **Case 03 — EchoOrganize (Audio Firmware Patch & FAT32 Allocator):**
  - *Information Challenge:* Organização de metadados binários (ID3v2.3) e alocação física de diretórios em FAT32 para microcontroladores de memória restrita.
  - *Stack:* Python, Mutagen, FAT32 Table I/O, Lanczos Resampling, Byte Alignment.
  - *Métricas:* 0 Kernel Panics, 100% Compatibilidade FAT32, -82% Latência de Indexação, Heap < 12MB.
  - *Ações:* Link para Estudo Técnico Detalhado (`/case/case-03`) e Repositório no GitHub.

#### Preservação do Case Use Azevedo:
- O case **Use Azevedo (E-Commerce Headless & Algorithmic Fit Tech)** foi migrado para a seção **The Archive / Lab (LAB_01)**, preservando todo o seu histórico técnico de provador virtual dimensional e liberando a vitrine nobre para a tríade *Industrial MES*, *EdTech/Auditoria de Dados* e *Sistemas de Baixo Nível/FAT32*.
- Uma cópia de segurança completa do seu estudo de caso em Markdown foi armazenada em `content/cases/archive/use-azevedo.pt.md` e `content/cases/archive/use-azevedo.en.md`.

### 3.6. Estudo de Engenharia Reversa do EchoOrganize (`content/cases/pt/case-03.md` e `en/case-03.md`)
Foi redigido um estudo técnico profundo de 4 seções detalhando:
1. **Restrições de Microcontrolador:** Processadores MIPS/ARM com 16MB-32MB RAM gerenciando cartões microSD de 256GB em tempo real.
2. **Mitigação de Kernel Panics:** Downgrade determinístico de ID3v2.4 para ID3v2.3 UTF-16LE com finalizadores nulos duplos (`\x00\x00`), impedindo buffer overflows na pilha do RTOS.
3. **Resampling Lanczos de Capas:** Conversão forçada para matriz 500x500px em JPEG baseline puro, eliminando quebras causadas por JPEGs progressivos em barramentos SPI de telas LCD.
4. **Alinhamento Físico em FAT32:** Ordenação lexicográfica de clusters físicos na tabela de alocação de arquivos, reduzindo a latência de indexação de 14 minutos para 2 minutos (-82%).

### 3.7. Rodapé e Canais Diretos (`components/system-footer.tsx` e `components/action-drawer.tsx`)
- **Rodapé:**
  - `© 2026 darkmode.id // Felipe Teles. Todos os direitos reservados.`
  - `Information Design & Software Engineering // Direct Execution`
- **Action Drawer (Gaveta Tátil Inferior):**
  - Acesso direto a três canais de alta velocidade: Micro-terminal com envio assíncrono via API, link direto de WhatsApp formatado para Felipe Teles e agendamento de call técnica via Cal.com.

---

## 4. AUDITORIA DE COMPILAÇÃO E PERFORMANCE

O projeto foi submetido ao build de produção com Turbopack:
```bash
npm run build
```

### Resultados da Compilação:
- **Compilador:** Next.js 16.3.5 com Turbopack ativo.
- **Tipagem TypeScript:** 0 erros e 0 warnings detectados em todos os componentes e tipos.
- **Geração de Páginas Estáticas (SSG):** 12 rotas estáticas pré-renderizadas em apenas **755ms** (incluindo estudos de caso nos idiomas `/pt` e `/en`, manifesto web, sitemap e robots).
- **Orçamento de Performance:** Ausência total de bibliotecas pesadas de animação no cliente; layout executado com CSS puro e animações aceleradas por GPU via transformações de matriz e opacidade.

---

## 5. SUMÁRIO EXECUTIVO PARA AUDITORIAS FUTURAS

| Dimensão | Estado Anterior | Estado Atual (Refatorado) |
| :--- | :--- | :--- |
| **Posicionamento** | Boutique studio de tecnologia criativa | Prática independente de Information Design & Software Engineering |
| **Liderança** | "Code & Design" anônimo | Felipe Teles (Technical Lead & Founder) |
| **Arquitetura Visual** | Cards genéricos de projetos | Split-screen com Information Challenge explícito |
| **Base do Fundo** | Fundo escuro padrão | Fundo OLED-safe em `#0A0B0D` (4% luminância contra black smearing) |
| **Numerais** | Fontes variáveis sem alinhamento | `font-mono tabular-nums` estrito para todas as métricas |
| **Vitrine Nobre** | 3 cases com e-commerce e edtech | Tríade técnica: Dora MES, Santos Prep e EchoOrganize |
| **Interlocução** | Tom de agência / prestador | Prática técnica independente com responsabilidade ponta a ponta |
