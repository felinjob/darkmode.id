# DOCUMENTAÇÃO TÉCNICA E ARQUITETURAL // darkmode.id
**Posicionamento:** Software Engineering, Data & Product Systems  
**Liderança Técnica & Autoria:** Felipe Teles (Software Engineer & Data Scientist)  
**Data da Auditoria & Evolução:** Outubro de 2026  
**Stack Tecnológica:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Turbopack, i18n Nativo (PT/EN)

---

## 1. TESE DE POSICIONAMENTO E DECISÕES DE COPYWRITING

### 1.1. Superando o Rótulo de "Information Design" e a "Corporação Fantasma"
Anteriormente, o portfólio utilizava o rótulo principal `Information Design & Software Engineering` e adotava a primeira pessoa do plural (*"Projetamos"*, *"Eliminamos"*) com excesso de jargões clínicos (*"ergonomia tátil"*, *"retenção tátil"*).

Essa abordagem gerava dois problemas estratégicos:
1. **Desalinhamento de Mercado com "Information Design":** No mercado de tecnologia, o termo *Information Design* remete a visualização editorial de dados (infográficos, Tableau, D3.js) ou pesquisa de UX restrita ao Figma — escondendo a capacidade real de construir sistemas operacionais de manufatura (MES), backends transacionais, robôs de RPA em Python e modelos de Machine Learning.
2. **Barreira Institucional Impessoal:** O plural corporativo afastava recrutadores técnicos, CTOs e clientes que buscam contratar diretamente a mente técnica por trás da arquitetura: **Felipe Teles**.

### 1.2. O Novo Posicionamento: `Software Engineering, Data & Product Systems`
A refatoração de Outubro de 2026 consolidou uma voz autoral, técnica e orientada a operações reais:
- **Subtítulo Institucional:** `SOFTWARE ENGINEERING, DATA & PRODUCT SYSTEMS`.
- **Headline Principal:** `ENGENHARIA DE SOFTWARE, DADOS E SISTEMAS PARA OPERAÇÕES REAIS.`
- **Convergência de Repertório (15+ Anos de Audiovisual + Engenharia de Software/Dados):** A fluidez visual e a ausência de atrito nas telas são explicadas pelo seu fundamento real: 15 anos de direção e edição audiovisual (ritmo, controle de atenção e corte de ruído) aplicados à arquitetura full-stack e ciência de dados.
- **CTAs Diretos Acima da Dobra:** Inclusão de botões imediatos no Hero (`[ INICIAR CONVERSA TÉCNICA ↗ ]`, `[ AGENDAR CALL ]` e `[ VER SISTEMAS EM PRODUÇÃO ↓ ]`), além de links diretos para GitHub e LinkedIn e uma barra de telemetria com 4 indicadores auditáveis.

---

## 2. ENGENHARIA ÓPTICA E DESIGN SYSTEM (DESIGN TOKENS)

O portfólio preserva sua disciplina de engenharia óptica e contraste para telas OLED/AMOLED (120Hz):
- `--bg-base`: `#0A0B0D` (4% de luminância para mitigar *black smearing* em rolagem a 120Hz)
- `--bg-surface`: `#131518` (Cartões modulares e matrizes de engenharia)
- `--bg-elevated`: `#1C1E22` (Gaveta de contato, barras de navegação e estados de hover)
- `--border-subtle`: `#22262C` & `--border-strong`: `#323742` (Cortes secos de 1px sem sombras difusas)
- `--accent-focus`: `#FF5500` (Laranja industrial de conversão e ação primária)
- `--signal-state`: `#00DF81` (Verde terminal indicando disponibilidade e sistemas em produção)
- `font-variant-numeric: tabular-nums` aplicado estritamente a todas as métricas, latências e contadores.

---

## 3. ARQUITETURA DE SEÇÕES E COMPONENTES

### 3.1. Cabeçalho (`components/system-header.tsx`)
- Logotipo dinâmico `darkmode.id_` acompanhado do descritor `// SOFTWARE ENGINEERING, DATA & PRODUCT SYSTEMS`.
- Navegação rápida para desktop (`01.Sistemas`, `02.Trajetória`, `03.Domínios`, `04.Lab / P&D`).
- Gatilho de status (`DISPONÍVEL // CONTATO`) integrado por eventos à gaveta de contato (`ActionDrawer`) e seletor instantâneo de idioma (`PT / EN`).

### 3.2. Hero & Perfil de Engenharia (`components/hero-manifesto.tsx` e `components/founder-module.tsx`)
- **HeroManifesto:** Apresenta a tese central, botões de ação acima da dobra, links de verificação técnica (GitHub/LinkedIn) e grade de 4 métricas-chave (`03+ Sistemas Críticos`, `< 90ms TTFB Edge`, `-90% Tempo via RPA`, `15+ Anos Bagagem Visual & Sistemas`).
- **FounderModule:** Apresenta **Felipe Teles** (`Software Engineer & Data Scientist`), retrato em alto contraste com marcadores de viewfinder, bio técnica em primeira pessoa e matriz de stack principal (`Python 3.12`, `TypeScript 5`, `Next.js 16`, `SQL / Prisma`, `PyTorch / ML`, `Docker / Cloud`).

### 3.3. Sistemas em Produção (`components/selected-works.tsx` e `components/project-card.tsx`)
Cada um dos 3 sistemas principais (**Dora MES**, **Santos PREP** e **Use Azevedo**) foi expandido com uma **Decomposição Arquitetural em 2 Colunas**:
1. `01 // CENÁRIO & GARGALO OPERACIONAL`: O problema físico e de negócio real (ex.: chão de fábrica têxtil no RJ com Wi-Fi oscilante e lotes de 1.200 peças divididos em fardos assíncronos).
2. `02 // ARQUITETURA & SOLUÇÃO DE ENGENHARIA`: As decisões de modelagem de dados, algoritmos e infraestrutura que resolveram o problema.

### 3.4. O Engenheiro por Trás do Código (`components/engineering-trajectory.tsx`)
Seção `Da Ilha de Edição à Arquitetura de Sistemas e Dados`, conectando os 15 anos de direção/edição audiovisual com a execução em Engenharia de Software e Ciência de Dados através de 3 pilares:
1. `01 // Modelagem Orientada à Operação Real`
2. `02 // Engenharia de Dados & IA Aplicada`
3. `03 // Precisão Visual & Zero Atrito`

### 3.5. Domínios Técnicos (`components/capabilities-grid.tsx`)
Matriz 2x2 atualizada:
- `01 // 04` — Engenharia Full-Stack & Sistemas Operacionais (Next.js 16, React 19, TypeScript, PWA Offline-First)
- `02 // 04` — Engenharia de Dados & Arquitetura Backend (Python, SQL, PostgreSQL, Prisma, Firestore, Cloud Run)
- `03 // 04` — RPA & Automação de Processos (Python, Selenium, BotCity, Pandas)
- `04 // 04` — Machine Learning, IA & Simulação de Sistemas (PyTorch, Scikit-Learn, Arquitetura ECS, FastAPI, NLP)

### 3.6. The Archive / Lab (`components/lab-archive.tsx`)
Registro de P&D com descrições completas legíveis em desktop e mobile e tags de stack:
- **`LAB_01` — Digiente (Project Turi — Digital Organism & ECS Simulation):** `[ACTIVE R&D]` — Python 3.12, FastAPI, PyTorch, Esper ECS, Pytest (`https://github.com/felinjob/digient_proj`).
- **`LAB_02` — EchoOrganize (FAT32 Cluster Allocator & ID3v2.3 Patcher):** `[PRODUÇÃO]` — Python, Mutagen, FAT32 I/O.
- **`LAB_03` — RPA Freight & Onboarding Engine:** `[PRODUÇÃO]` — Python, BotCity, Selenium, Pandas.
- **`LAB_04` — Cinema Greenlight & IMDb Predictive Analytics:** `[FINALIZADO]` — Python, NLP, Scikit-Learn.
- **`LAB_05` — Resumos Campinas (Engine de Aquisição V1):** `[ARQUIVADO]` — Next.js, CRO Mobile-First.

### 3.7. Bloco de Conversão Final (`components/direct-cta-banner.tsx`)
Seção de fechamento conectada diretamente ao `ActionDrawer` (Mensagem Direta, Agendamento Cal.com e WhatsApp).
