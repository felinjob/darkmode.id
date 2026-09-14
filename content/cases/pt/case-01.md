# Da Bancada de Corte ao Cloud Run: Decisões de Arquitetura e Engenharia no Dora MES

*Como a modelagem orientada à física real de uma confecção têxtil transformou o que parecia um simples CRUD em uma plataforma industrial resiliente.*

---

Na teoria, uma Ordem de Produção (OP) parece um fluxo linear clássico: um pedido é criado, o tecido é cortado, as peças são costuradas, passam pelo controle de qualidade e seguem para o faturamento.

Na física de um galpão têxtil, essa linearidade simplesmente não existe.

Um lote de 500 peças raramente anda junto. Fardos de tamanho P costumam ser finalizados dias antes de tamanhos maiores; malhas do mesmo rolo variam de rendimento por umidade e tensão; operadoras experientes costuram fardos em paralelo a facções externas; e tablets em bancadas industriais operam sob condições severas de poeira de malha, luz solar indireta e conexões oscilantes.

Quando começamos a desenhar o **Dora MES** — sistema de chão de fábrica e Planejamento e Controle de Produção (PCP) desenvolvido sob medida para a confecção Dora Pinheiro —, a meta não era apenas digitalizar fichas de papel e planilhas de Excel. O objetivo era **projetar uma arquitetura de software que espelhasse a mecânica real da manufatura**, sem criar fricção operacional.

Abaixo, detalho as decisões de engenharia, os trade-offs arquiteturais e as lições aprendidas ao longo da evolução do sistema.

---

## 1. Quebrando o "Monolito da OP": Ciclo de Vida Assíncrono de Fardos

O primeiro instinto ao desenhar um sistema fabril é tratar a Ordem de Produção como uma máquina de estados finita convencional:

```
[FILA] ───> [CORTE] ───> [COSTURA] ───> [ACABAMENTO] ───> [FINALIZADO]
```

Esse modelo falha no primeiro dia de uso real.

Se uma OP de 1.200 camisas polo tem 12 fardos de 100 peças e 4 deles já estão sendo revisados enquanto 2 ainda aguardam máquina galoneira, em qual estado a OP está? Tratar a ordem inteira em um único status trava o chão de fábrica ou gera dados estatísticos falsos.

### A Decisão Arquitetural

Desacoplamos a entidade macro (**Ordem de Produção**) da sua unidade física mínima de movimentação (**Fardo / Bundle**):

* **A OP** atua como contêiner financeiro, comercial e de prazos (metadados, referências técnicas, tecidos alocados e deadline).
* **O Fardo** é uma entidade viva e autônoma, mapeada por cor, tamanho e operadora responsável. Cada fardo possui sua própria esteira de estados:

```
┌─────────────────────────────────────────────────────────────┐
│                    Ordem de Produção (Macro)                │
│  OP-2609-042 | Ref: F2401 | 1.200 peças | Deadline: 22/Set  │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       v                       v                       v
  Fardo #01 (P)           Fardo #05 (M)           Fardo #12 (GG)
  [Revisão QC]             [Costura]               [Aguardando]
  Resp: Ivanilde          Resp: Araceli           Resp: Facção X
```

O status visual da OP no painel do PCP tornou-se um **estado derivado**: a ordem só conclui quando todos os seus fardos individuais transitam pelo controle de qualidade.

Para a interface móvel nos tablets, adotamos uma arquitetura de acordeão expansível: a operadora enxerga o lote agrupado de forma limpa e, com um toque, expande apenas os fardos que estão fisicamente na sua máquina.

---

## 2. A "Física da Malha": Rendimento Teórico vs. Auditoria do Corte Real

Em desenvolvimento de software comum, espera-se que entradas determinísticas gerem saídas determinísticas. Na indústria têxtil, o corte é estocástico.

Quando o PCP projeta cortar 50 kg de malha com rendimento nominal de 3,2 m/kg, o cálculo matemático prevê exatamente $X$ peças. No entanto, o descanso inadequado do rolo, o encolhimento térmico ou perdas de ponta de enfesto fazem com que a quantidade real de peças cortadas quase nunca seja igual à estimada.

### A Decisão de Engenharia

Em vez de forçar a consistência com validações rígidas no banco, desenhamos um **módulo de auditoria em duas fases**:

1. **Fase Preditiva (PCP):** O sistema calcula a razão matricial do risco ($P:1, M:2, G:2 \dots$) e gera os números esperados de fardos e peças.
2. **Fase de Apontamento Real (Corte):** Ao final do enfesto, o operador registra as peças físicas reais apuradas.

```typescript
// Modelo simplificado do apontamento de auditoria pós-corte
interface FabricAudit {
  fabricId: string;
  nominalWeightKg: number;
  nominalYieldRatio: number;
  estimatedPieces: number;  // Calculado pelo PCP
  actualPiecesCut: number;    // Apontado na bancada de corte
  lossDiscrepancy: number;   // actualPiecesCut - estimatedPieces
}
```

O sistema armazena a discrepância histórica entre o estimado e o real. Essa métrica alimenta um ciclo contínuo de aprendizado para calibração das compras de tecido, transformando uma perda operacional em inteligência de dados para a empresa.

---

## 3. Segregação de Contextos: Gerência (PCP) vs. Operações (Tablet)

Sistemas corporativos frequentemente sofrem de sobrecarga cognitiva por colocarem todas as ações em uma tela só, protegidas apenas por botões desabilitados.

Em um chão de fábrica, cada segundo gasto rolando telas ou decifrando gráficos desnecessários representa atraso na esteira.

### Segregação Funcional e de Acesso (RBAC)

Criamos duas personas mutuamente exclusivas suportadas no Firebase Authentication e no Firestore Security Rules:

| Camada | Gerência (PCP / Admin) | Operações (Chão de Fábrica) |
| --- | --- | --- |
| **Dispositivo Principal** | Desktop / Notebook | Tablet em suporte de bancada |
| **Foco Cognitivo** | Planejamento, prazos, edição e custos | Execução física, apontamento ágil de fardos |
| **Visibilidade** | Enxerga pedidos em fila, ativos e arquivados | Enxerga **somente** ordens com corte liberado |
| **Métricas** | Análise de gargalos e balanceamento de linha | Focado estritamente na sua etapa de trabalho |

#### A Decisão Contra o "Ranking de Produtividade"

Uma decisão deliberada de design foi a remoção de rankings públicos de produtividade entre costureiras na visualização do chão de fábrica.

Em auditorias de processos industriais, a gamificação agressiva em linhas de costura costuma gerar atrito interpessoal e incentiva o aumento de velocidade à custa de defeitos no controle de qualidade. Substituímos qualquer métrica individual agressiva por uma tela gerencial de **Distribuição de Carga**: o PCP visualiza a distribuição dos lotes para evitar sobrecarregar uma costureira enquanto outra aguarda abastecimento.

---

## 4. Arquitetura de Software & Escolhas da Stack

```
   ┌────────────────────────────────────────────────────────┐
   │                  Cliente Web / PWA                     │
   │      Next.js 14+ (App Router) + Tailwind CSS           │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
    Leituras em Tempo Real              Chamadas de Servidor
       (IndexedDB Cache)                 (SSR / Next APIs)
               │                                │
               v                                v
   ┌───────────────────────┐        ┌───────────────────────┐
   │   Firebase Firestore  │        │   Cloud Run Container │
   │  Coleção /orders      │        │  (Firebase App Host)  │
   │  Coleção /users (RBAC)│        └───────────┬───────────┘
   └───────────────────────┘                    │
                                       Google Calendar API
                                       (Service Account Sync)
```

### Por que Next.js 14 (App Router) + Firebase?

* **Reatividade em Tempo Real:** O Firestore fornece WebSockets nativos com escuta reativa (`onSnapshot`). Quando a bancada de corte avança um lote, a tela do PCP no escritório atualiza instantaneamente sem necessidade de recarregar a página.
* **Tolerância a Quedas de Rede (Offline First):** Com o cache do IndexedDB habilitado, o tablet continua navegável mesmo durante oscilações momentâneas do sinal de Wi-Fi no galpão.
* **Segurança e APIs de Background:** A sincronização de cronogramas de entrega com a **Google Calendar API** utiliza Service Accounts com chaves criptográficas RSA privadas. Essas chaves não podem vazar para o cliente; a camada de Server Actions/Route Handlers do Next.js nos permitiu executar a integração com o Google Workspace de forma isolada e segura.

### Por que Migrar para o Firebase App Hosting (Cloud Run)?

Inicialmente, o hosting tradicional estático do Firebase parecia suficiente. Porém, a presença de rotas dinâmicas de servidor (SSR) e a comunicação com APIs externas exigiam um ambiente com backend escalável.

Optamos pelo **Firebase App Hosting**:

* A aplicação é empacotada em um contêiner Linux gerenciado no **Cloud Run** (Node 22).
* Ganhamos escalabilidade de 0 instâncias (custo zero quando a fábrica está fechada) até réplicas automáticas em picos de sincronização.
* O fluxo de CI/CD ficou integrado ao repositório no GitHub, compilando automaticamente novos commits da branch de produção.

---

## 5. Resiliência Operacional: O Diabo está nos Detalhes

Sistemas industriais não podem falhar silenciosamente. Três soluções pontuais de engenharia garantiram a solidez da ferramenta em produção:

1. **Lixeira com Retenção Lógica (*Soft Delete* de 7 dias):**
Exclusões acidentais em telas sensíveis ao toque são comuns. Nenhuma OP é apagada do Firestore com um clique. Ao deletar, o documento recebe `isDeleted: true` e uma data de expiração, saindo instantaneamente da esteira fabril, mas permanecendo recuperável pelo PCP em uma aba isolada.
2. **Semáforo Visual de Deadline:**
O PCP lida com dezenas de datas. Criamos um sistema de alerta visual baseado em dias corridos restantes:
* **Verde (`emerald`):** Folga operacional (> 5 dias).
* **Âmbar (`amber`):** Janela de risco (2 a 5 dias).
* **Carmim (`rose`):** Risco crítico de atraso (< 48 horas ou vencido).


3. **Disciplina Rigorosa com as Regras de Hooks do React:**
Durante o refatoramento da edição de múltiplos tecidos, eliminamos o uso de hooks (`useMemo`) dentro de laços de repetição dinâmicos (`array.map`), substituindo cálculos desnecessariamente memoizados por operações aritméticas síncronas diretas. O resultado foi a erradicação de bugs de hidratação e travamento de tela em produção.

---

## Conclusão: O Valor do Software Orientado ao Domínio

O diferencial de um bom software industrial não está na quantidade de bibliotecas importadas, mas na **fidelidade com que sua arquitetura traduz o mundo real**.

O Dora MES saiu da prancheta como um CRUD de pedidos e se consolidou como uma espinha dorsal operacional. Ao abraçar a descontinuidade dos fardos, a imprevisibilidade física da malha e a necessidade de interfaces sem ruído para tablets de fábrica, construímos uma plataforma que não tenta mudar a física do chão de fábrica — mas a organiza com precisão, previsibilidade e elegância técnica.
