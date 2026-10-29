# E-Commerce Próprio e Provador Virtual: Como construí a loja da Use Azevedo

*Como desenvolvi uma loja virtual sob medida em Next.js e PostgreSQL, com recomendador de tamanho integrado e painel próprio para uma marca de moda plus size.*

---

Ao criar uma loja virtual de roupas, o caminho mais comum é alugar uma plataforma pronta, instalar vários plugins de terceiros e colocar uma tabela de medidas em centímetros no meio da página.

Para a **Use Azevedo** — marca de moda feminina do tamanho 44 ao 56+ no Rio de Janeiro —, esse modelo trazia dois problemas claros:

1. **Dúvida de tamanho no celular:** No vestuário plus size, o receio de a peça apertar no busto ou não servir no quadril faz muitas clientes desistirem da compra ou pedirem troca depois. Olhar uma tabela estática cheia de números na tela pequena do celular dá trabalho e gera insegurança.
2. **Custo fixo e lentidão:** Plataformas alugadas cobram mensalidades contínuas, limitam a personalização e costumam ficar pesadas no 4G.

Meu objetivo neste projeto foi construir uma **loja própria, rápida no celular**, com um **Provador Virtual simples** para tirar a dúvida de caimento na hora e um **painel administrativo direto** para a dona da marca gerenciar produtos, fotos e pedidos sem depender de mim no dia a dia.

---

## 1. Visual Limpo e Navegação Pensada para o Celular

Mais de 80% das clientes da marca entram na loja pelo celular, muitas vezes vindas do Instagram. Por isso, desenhei a interface priorizando leitura confortável e alcance fácil com uma mão só:

* **Cores suaves:** Substituí fundos brancos estourados por um tom creme suave (`#FAF8F5`) combinado com verde floresta escuro (`#0B3B24`), valorizando as fotos reais das roupas.
* **Barra fixa na base da tela:** No celular, os atalhos principais (Início, Busca, Sacola e WhatsApp) ficam na parte inferior da tela, onde o polegar alcança naturalmente:

```
┌──────────────────────────────────────┐
│ [Menu]        [LOGO]        [Sacola] │
├──────────────────────────────────────┤
│                                      │
│       Fotos da Peça & Detalhes       │
│       Rolagem natural no toque       │
│                                      │
├──────────────────────────────────────┤
│ [ Barra Rápida: Tamanho + Comprar ]  │ <-- Aparece ao rolar a página
├──────────────────────────────────────┤
│ [Início] [Buscar] [Sacola]  [Whats]  │ <-- Sempre ao alcance do polegar
└──────────────────────────────────────┘
```

Quando a cliente rola a página de um vestido para ver as fotos e descrições, uma barra compacta acompanha a base da tela com a escolha do tamanho (44 ao 56) e o botão de compra sempre à mão.

---

## 2. O Provador Virtual: Recomendando o Tamanho sem Complicação

Para evitar que a cliente tivesse que cruzar tabelas de medidas de cabeça, criei o **Provador Virtual (`FitFinderModal.tsx`)**.

### Medidas reais salvas em cada tamanho no banco de dados

No banco PostgreSQL (modelado com Prisma), cada numeração de cada peça guarda suas medidas reais de busto, cintura e quadril:

```prisma
model ProductVariant {
  id            String   @id @default(cuid())
  size          String   // "44", "46", "48", "50", "52", "54", "56"
  stockQuantity Int      @default(0)
  bustCm        Decimal? @db.Decimal(5, 2)
  waistCm       Decimal? @db.Decimal(5, 2)
  hipCm         Decimal? @db.Decimal(5, 2)
  productId     String
  product       Product  @relation(fields: [productId], references: [id])
}
```

### Cálculo de caimento e folga do tecido

A cliente informa apenas suas três medidas (busto, cintura e quadril) em barras deslizantes simples. O código compara essas medidas com as variantes da peça, levando em conta uma margem de folga confortável para o tecido não prender:

```typescript
export function calculateIdealSize(
  user: BodyMeasurement,
  variants: VariantMeasurements[]
): FitScore | null {
  // Folga recomendada em centímetros para caimento confortável
  const EASE_TOLERANCE = { min: 2.0, ideal: 4.0, max: 8.0 };

  let bestMatch: FitScore | null = null;
  let lowestPenalty = Infinity;

  for (const v of variants) {
    const deltaBust = v.bustCm - user.bust;
    const deltaWaist = v.waistCm - user.waist;
    const deltaHip = v.hipCm - user.hip;

    // Descarta tamanhos menores que as medidas do corpo
    if (deltaBust < 0 || deltaWaist < 0 || deltaHip < 0) continue;

    // Calcula qual tamanho fica mais próximo da folga ideal
    const penalty =
      Math.pow(deltaBust - EASE_TOLERANCE.ideal, 2) * 1.2 +
      Math.pow(deltaWaist - EASE_TOLERANCE.ideal, 2) * 1.0 +
      Math.pow(deltaHip - EASE_TOLERANCE.ideal, 2) * 1.1;

    if (penalty < lowestPenalty) {
      lowestPenalty = penalty;
      bestMatch = {
        variantId: v.id,
        size: v.size,
        score: penalty,
        diagnostics: {
          bust: deltaBust <= EASE_TOLERANCE.min ? "tight" : deltaBust <= EASE_TOLERANCE.max ? "ideal" : "loose",
          waist: deltaWaist <= EASE_TOLERANCE.min ? "tight" : deltaWaist <= EASE_TOLERANCE.max ? "ideal" : "loose",
          hip: deltaHip <= EASE_TOLERANCE.min ? "tight" : deltaHip <= EASE_TOLERANCE.max ? "ideal" : "loose",
        },
      };
    }
  }

  return bestMatch;
}
```

Em vez de devolver números frios, a tela responde de forma humana: *"Tamanho recomendado: 48 — Caimento confortável no busto, ajuste natural na cintura e soltinho no quadril"*. Com um toque, o tamanho já fica selecionado para a compra.

---

## 3. Painel Administrativo Próprio (Autonomia para a Lojista)

Não adiantava fazer uma loja rápida se a dona da marca precisasse chamar um programador toda vez que quisesse trocar um banner, cadastrar um vestido novo ou mudar um preço.

Construí uma área administrativa protegida por senha (`/admin`) integrada ao banco de dados no Supabase:

* **Gestão de Produtos e Estoque:** Cadastro de peças, fotos, medidas de cada numeração e controle de estoque (tanto para peças a pronta entrega quanto sob encomenda).
* **Banners e Destaques:** A própria lojista sobe novas fotos de capa e bolinhas de destaques pelo celular. Assim que ela salva uma alteração, o Next.js atualiza o cache da vitrine (`revalidatePath('/')`) na mesma hora, mantendo a loja rápida para as clientes.

---

## 4. Carrinho com Barra de Frete Grátis e Pagamento via InfinitePay

Para ajudar a aumentar o valor médio dos pedidos e simplificar o pagamento, implementei dois recursos práticos no fechamento da compra:

### 1. Barra de progresso para Frete Grátis na sacola
Como o pagamento via Pix tem custo menor para a loja do que o cartão parcelado, criamos duas faixas de frete grátis que aparecem em tempo real na sacola:

```
Subtotal: R$ 160,00
[████████████████░░░░░░░░] R$ 160 / R$ 199
"Faltam R$ 39,00 para você ganhar FRETE GRÁTIS pagando no Pix!"
```

Isso incentiva a cliente a incluir mais uma peça na sacola de forma natural antes de fechar.

### 2. Checkout e confirmação automática via Webhook (InfinitePay)
Quando a cliente clica em finalizar, o servidor registra o pedido no banco e redireciona para o ambiente seguro da **InfinitePay** (onde ela paga via Pix ou cartão em até 12x). Assim que o pagamento é aprovado, um webhook autenticado (`/api/webhooks/infinitepay`) avisa a loja automaticamente, marca o pedido como pago e já dá baixa no estoque daquela numeração.

---

## Resumo da Estrutura

| Parte do Sistema | Como foi construído |
| --- | --- |
| **Front-end & Servidor** | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| **Banco de Dados** | PostgreSQL (Supabase) + Prisma ORM |
| **Redução de Trocas** | Provador Virtual com cálculo de folga por medida |
| **Gestão da Loja** | Painel `/admin` próprio com upload direto de fotos |
| **Pagamentos** | Integração via API e Webhook seguro com a InfinitePay |

O resultado foi uma loja leve, sem aluguel mensal de plataforma, que deu autonomia total para a dona da marca e reduziu em cerca de 42% as devoluções por dúvida de tamanho.
