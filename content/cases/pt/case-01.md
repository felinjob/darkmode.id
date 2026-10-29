# Da Bancada de Corte ao Cloud Run: Como construí o Dora MES

*Como substituir fichas de papel em uma confecção têxtil exigiu olhar para a rotina real do galpão antes de escrever a primeira linha de código.*

---

Na teoria, uma Ordem de Produção (OP) parece um fluxo simples em linha reta: o pedido chega, o tecido é cortado, as peças vão para a costura, passam pela revisão e seguem para a entrega.

Na prática de um galpão têxtil, as coisas não funcionam assim.

Um lote de 500 peças raramente anda junto. Os pacotes (fardos) de tamanho P costumam ficar prontos dias antes dos tamanhos maiores; rolos da mesma malha rendem quantidades diferentes dependendo da tensão; costureiras internas trabalham em paralelo com facções externas; e o sinal de Wi-Fi oscila justamente onde ficam as bancadas.

Quando desenhei e programei o **Dora MES** — sistema de Planejamento e Controle de Produção (PCP) feito sob medida para a confecção Dora Pinheiro, no Rio de Janeiro —, o objetivo era substituir as fichas de papel e planilhas por um sistema web que acompanhasse o ritmo real da fábrica, sem atrapalhar quem está produzindo.

Abaixo estão as principais decisões técnicas do projeto.

---

## 1. Separando a Ordem de Produção dos Fardos

O primeiro impulso ao criar um sistema de produção é colocar um único status na Ordem de Produção inteira:

```
[FILA] ───> [CORTE] ───> [COSTURA] ───> [ACABAMENTO] ───> [FINALIZADO]
```

Na fábrica, esse modelo trava no primeiro dia.

Se uma ordem de 1.200 camisas foi dividida em 12 fardos de 100 peças, e 4 fardos já estão na revisão enquanto 2 ainda esperam na máquina galoneira, em qual etapa a ordem está? Colocar a OP inteira em uma única coluna esconde o que realmente está acontecendo no galpão.

### Como resolvi no banco de dados

Separei o pedido geral (**Ordem de Produção**) da unidade física que realmente circula na fábrica (**Fardo**):

* **A Ordem de Produção (OP)** guarda os dados comerciais, prazos, referências e rolos de tecido previstos.
* **O Fardo** é a unidade física amarrada na bancada, identificada por cor, tamanho e responsável. Cada fardo anda no seu próprio ritmo:

```
┌─────────────────────────────────────────────────────────────┐
│                    Ordem de Produção (Macro)                │
│  OP-2609-042 | Ref: F2401 | 1.200 peças | Prazo: 22/Set     │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       v                       v                       v
  Fardo #01 (P)           Fardo #05 (M)           Fardo #12 (GG)
  [Revisão]               [Costura]               [Aguardando]
  Resp: Ivanilde          Resp: Araceli           Resp: Facção Externa
```

No painel do escritório (PCP), o progresso da OP é calculado automaticamente a partir dos fardos: o lote só aparece como concluído quando todos os fardos passam pela revisão final.

Nos tablets da fábrica, usei uma lista limpa em formato de sanfona (acordeão): a operadora bate o olho no lote e abre com um toque apenas os fardos que estão na sua bancada.

---

## 2. Rendimento Estimado vs. Corte Real da Malha

Quando o escritório planeja cortar 50 kg de malha com rendimento médio de 3,2 m/kg, a conta prevê um número exato de peças. Mas, na mesa de corte, o descanso do tecido, o encolhimento ou a perda nas pontas mudam esse resultado quase todo dia.

Em vez de travar o sistema exigindo que a conta teórica batesse com o corte físico, criei um registro em duas etapas:

1. **Previsão (Escritório):** O sistema calcula a proporção da grade (ex: `P:1, M:2, G:2`) e estima quantos fardos e peças devem sair do rolo.
2. **Apontamento Real (Mesa de Corte):** Assim que termina de cortar, o cortador informa quantas peças realmente saíram.

```typescript
interface FabricAudit {
  fabricId: string;
  nominalWeightKg: number;
  nominalYieldRatio: number;
  estimatedPieces: number;  // Previsto no planejamento
  actualPiecesCut: number;  // Contado na mesa de corte
  lossDiscrepancy: number;  // Diferença real (sobra ou quebra)
}
```

Com isso, a fábrica passou a ter um histórico fiel de aproveitamento por tipo de tecido e fornecedor, ajudando a comprar malha com muito mais precisão nos lotes seguintes.

---

## 3. Duas Telas Diferentes: Escritório (PCP) vs. Galpão (Tablet)

Colocar todas as funções na mesma tela deixa o sistema confuso para quem só precisa dar baixa em um pacote de roupa. Por isso, separei o sistema em dois modos de uso pelo login (Firebase Auth):

| Contexto | Escritório (PCP / Gerência) | Chão de Fábrica (Operação) |
| --- | --- | --- |
| **Aparelho principal** | Computador / Notebook | Tablet fixado na bancada |
| **Foco da tela** | Planejamento, prazos, custos e tecidos | Botões grandes para avançar fardos |
| **O que aparece** | Pedidos na fila, em produção e histórico | **Apenas** ordens já liberadas para corte |
| **Indicadores** | Visão de gargalos e prazos de entrega | Apenas a fila da sua própria etapa |

### Por que tirei o "ranking de produtividade"

Durante o projeto, descartei a ideia de colocar um ranking comparando a velocidade individual das costureiras na tela do galpão. Na prática, esse tipo de placar gera tensão na equipe e faz a pressa aumentar o número de peças com defeito na revisão.

No lugar disso, criei uma visão de **Distribuição de Carga** apenas para a gerência: o objetivo é ver quem está sobrecarregada e distribuir melhor os fardos para a linha fluir sem gargalos.

---

## 4. Arquitetura Técnica e Funcionamento Offline

```
   ┌────────────────────────────────────────────────────────┐
   │                  Aplicação Web / PWA                   │
   │          Next.js (App Router) + Tailwind CSS           │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
    Sincronização em Tempo Real       Rotas de Servidor (SSR)
       (Cache Offline Local)            (Next.js API Routes)
               │                                │
               v                                v
   ┌───────────────────────┐        ┌───────────────────────┐
   │   Firebase Firestore  │        │   Google Cloud Run    │
   │  Coleção /orders      │        │  (Container Node 22)  │
   │  Coleção /users       │        └───────────┬───────────┘
   └───────────────────────┘                    │
                                       Google Calendar API
                                     (Agenda de Entregas)
```

* **Atualização na hora (WebSockets):** Usando o `onSnapshot` do Firestore, assim que o cortador dá baixa em um fardo no tablet, a tela do escritório atualiza sozinha no mesmo segundo, sem precisar recarregar a página.
* **Cache Offline no Tablet:** Com a persistência local no navegador (IndexedDB), se o Wi-Fi do galpão oscilar, a operadora continua registrando os fardos normalmente. Assim que o sinal volta, os dados sincronizam sozinhos.
* **Integração com Google Agenda:** Os prazos de entrega das ordens são sincronizados automaticamente com a agenda da gerência via Google Calendar API no servidor, mantendo as chaves de acesso protegidas no backend.
* **Hospedagem em Contêiner (Cloud Run):** A aplicação roda em contêiner no Google Cloud Run via Firebase App Hosting, escalando para zero quando a fábrica está fechada à noite (reduzindo custos) e publicando atualizações automaticamente a cada commit no GitHub.

---

## 5. Detalhes Práticos que Fazem Diferença no Dia a Dia

1. **Lixeira de 7 dias (*Soft Delete*):** Em telas de toque, cliques acidentais acontecem. Nenhum pedido é apagado de vez no primeiro clique; ele vai para uma lixeira temporária de 7 dias e pode ser restaurado pelo escritório se tiver sido excluído por engano.
2. **Semáforo simples de prazos:** Para facilitar a leitura rápida de dezenas de pedidos em aberto, cada cartão muda de cor conforme o prazo restante:
   * **Verde:** Mais de 5 dias de folga.
   * **Amarelo:** Atenção (entre 2 e 5 dias).
   * **Vermelho:** Urgente (menos de 48 horas ou atrasado).

---

## Resultado

O **Dora MES** tirou 100% das fichas de papel da linha de produção e reduziu em cerca de 35% o tempo gasto para fechar e conferir cada lote. Mais do que colocar tecnologia nova na fábrica, o projeto funcionou porque respeitou o jeito como o trabalho real acontece na bancada.
