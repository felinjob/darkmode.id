# Da Modelagem Plus Size ao Edge: Arquitetura Mobile-First, Fit Tech e Engenharia de E-Commerce na Use Azevedo

*Como decisões de UI/UX silenciosas, um algoritmo dimensional de recomendação de caimento e uma arquitetura headless em Next.js 16 transformaram um ateliê sob encomenda em uma plataforma de varejo de alta conversão.*

---

No ecossistema de comércio eletrônico, a tentação mais comum ao lançar uma marca de vestuário é recorrer a atalhos pré-fabricados: subir um template genérico no Shopify ou WooCommerce, instalar uma dúzia de plugins pesados para frete e pop-ups de desconto, e torcer para que o tráfego converta.

No nicho de moda feminina mid e plus size (tamanhos 44 ao 56+), esse modelo superficial quebra de imediato.

A compra de vestuário online no Brasil já lida naturalmente com uma das maiores taxas de devolução do varejo global — variando entre 25% e 40% —, impulsionada pela assimetria de expectativa de caimento. Quando transpomos essa realidade para o público plus size, a fricção dobra: o medo de a peça não fechar no busto, prender no quadril ou ter uma modelagem inconsistente gera abandono em massa no carrinho. Se a plataforma parece amadora ou se a cliente não sente segurança absoluta na ergonomia das medidas, ela simplesmente não passa o cartão.

Ao estruturar a engenharia e o design da **Use Azevedo**, o objetivo não era montar uma simples vitrine virtual de catálogo. O desafio residia em conceber uma plataforma headless transacional de alta velocidade, orientada a dispositivos móveis, capaz de resolver a dor de caimento (*Fit Tech*), orquestrar itens de pronta entrega com confecção sob demanda e entregar autonomia operacional total à lojista através de um CMS próprio.

Abaixo, registro as decisões de arquitetura de software, engenharia de produto, trade-offs estéticos e técnicas de otimização de conversão (CRO) adotadas no desenvolvimento da plataforma.

---

## 1. Identidade Visual "Quiet Luxury" e a Ergonomia do Polegar no Mobile-First

A primeira iteração visual da loja padecia de um vício comum em projetos conceituais de e-commerce: o uso de contrastes estridentes. Elementos em amarelo e dourado saturado sobrepostos ao verde floresta criavam uma estética de varejo promocional agressivo, colidindo com a proposta de valor da marca, que produz peças artesanais e alfaiataria autoral.

### A Transição Cromática: Marfim e Verde Floresta Profundo

Decidimos reformular a base de design tokens no Tailwind CSS orientando o projeto aos princípios do *quiet luxury* (referências editoriais como Jacquemus e The Row):

* **Base Cromática Nobre:** O Verde Floresta (`#0B3B24`) assumiu o papel institucional no cabeçalho, rodapé e botões primários.
* **Erradicação do Dourado/Amarelo:** Todos os textos e elementos decorativos sobre o fundo verde foram migrados para o Marfim Suave (`#F4F0E8` / Ivory). Isso garantiu uma razão de contraste WCAG AA nítida, sem reflexos visuais amarelados.
* **Canvas de Respiro:** O corpo da loja e as páginas de produto (PDP) adotaram o Canvas Off-White (`#FAF8F5`), criando um contraste macio que valoriza as fotos reais dos tecidos em vez de ofuscá-los com o branco puro (`#FFFFFF`).

### A Arquitetura da "Thumb Zone"

Mais de 84% das consumidoras de moda navegam via smartphone. Em telas de 390px a 430px de largura, elementos interativos essenciais não podem ficar isolados no topo da tela.

```
┌──────────────────────────────────────┐  ^
│ [Menu]        [LOGO]        [Sacola] │  │ Zona de Estiramento
├──────────────────────────────────────┤  │ (Acesso Difícil)
│                                      │  v
│     Hero Editorial / Vitrine         │
│     Scroll Natural com Swipe         │
│                                      │
├──────────────────────────────────────┤  ^
│ [ Barra de Compra Flutuante (PDP) ]  │  │ ZONA NATURAL DO POLEGAR
├──────────────────────────────────────┤  │ (Conversão Imediata:
│ [Home]  [Buscar]  [Sacola]  [Whats]  │  │  Bottom Nav & Sticky Cart)
└──────────────────────────────────────┘  v
```

Para garantir que a jornada inteira pudesse ser executada com uma única mão, implementamos três componentes dedicados:

1. **Bottom Navigation Bar (`MobileTabBar.tsx`):** Fixada no rodapé das visualizações móveis (`md:hidden`), disponibiliza atalhos imediatos para Home, Gaveta de Busca com sugestões rápidas, Sacola (com contagem reativa) e WhatsApp humanizado.
2. **Barra de Compra Fixa na PDP (`MobileStickyCartBar.tsx`):** Ao rolar a página de um vestido e ultrapassar o botão de compra tradicional, uma barra compacta desliza suavemente na base contendo a miniatura da peça, o seletor ágil de tamanhos (44 ao 56) e a chamada para ação. A cliente não precisa rolar a tela inteira de volta para comprar.
3. **Carrosséis Nativos com Aceleração de Hardware:** Substituímos bibliotecas genéricas por `embla-carousel-react`, garantindo arrasto com inércia física real nos carrosséis editoriais e nas categorias circulares (*Stories*), sem perda de frames por repintura de DOM.

---

## 2. O Algoritmo de Fit Tech: Eliminando a Barreira Dimensional do Plus Size

O principal gargalo de conversão no vestuário plus size não é o preço: é o ceticismo em relação à modelagem. Uma cliente que veste tamanho 48 em uma marca pode precisar do 52 em outra. Disponibilizar apenas uma tabela de texto estática com números em centímetros transfere todo o esforço cognitivo para a usuária, gerando paralisia de decisão.

Construímos um **Provador Virtual Interativo (`FitFinderModal.tsx`)** baseado em um algoritmo determinístico de recomendação dimensional.

### O Modelo Dimensional no Banco de Dados

Em vez de modelar apenas tamanhos textuais genéricos ("G", "GG"), cada variante física do produto carrega suas dimensões reais de modelagem:

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

### O Algoritmo de Proximidade e Folga de Vestibilidade

Quando a cliente insere suas três medidas corporais básicas (Busto, Cintura e Quadril) por meio de controles deslizantes sensíveis ao toque, o sistema executa o cálculo de caimento direto contra todas as variantes disponíveis para aquela peça:

```typescript
interface BodyMeasurement {
  bust: number;
  waist: number;
  hip: number;
}

interface FitScore {
  variantId: string;
  size: string;
  score: number;
  diagnostics: {
    bust: "tight" | "ideal" | "loose";
    waist: "tight" | "ideal" | "loose";
    hip: "tight" | "ideal" | "loose";
  };
}

export function calculateIdealSize(
  user: BodyMeasurement,
  variants: VariantMeasurements[]
): FitScore | null {
  // Folga mínima recomendada para conforto de tecido plano (em cm)
  const EASE_TOLERANCE = { min: 2.0, ideal: 4.0, max: 8.0 };

  let bestMatch: FitScore | null = null;
  let lowestPenalty = Infinity;

  for (const v of variants) {
    const deltaBust = v.bustCm - user.bust;
    const deltaWaist = v.waistCm - user.waist;
    const deltaHip = v.hipCm - user.hip;

    // Se a peça for menor que o corpo em qualquer ponto crítico, penaliza severamente
    if (deltaBust < 0 || deltaWaist < 0 || deltaHip < 0) {
      continue;
    }

    // Cálculo da distância euclidiana ponderada em relação à folga ideal
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

O resultado é apresentado em linguagem humanizada: *"Tamanho Recomendado: 48 — Caimento confortável no busto, ajuste natural na cintura e fluido no quadril"*. Ao clicar em "Aplicar Tamanho", a variante é selecionada na página sem que a cliente precise interpretar tabelas numéricas complexas.

---

## 3. Arquitetura Next.js 16, Prisma v6 e Reatividade com SearchParams Assíncronos

Na camada de engenharia de software, o projeto foi arquitetado sob o Next.js 16 (App Router) com TypeScript rigoroso e Prisma v6 conectando-se a uma instância PostgreSQL gerenciada no Supabase.

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 16 (App Router)                    │
│        Server Component: Vitrine Reativa (page.tsx)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            v                                     v
   Resolved searchParams               Prisma v6 Client
  (await searchParams)               (Connection Pooling :6543)
            │                                     │
            └──────────────────┬──────────────────┘
                               v
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Postgres                       │
│    Filtro Combinado: Categoria + Disponibilidade + Busca    │
└─────────────────────────────────────────────────────────────┘
```

### O Desafio dos `searchParams` Assíncronos

No Next.js 15 e 16, o acesso a parâmetros de URL em páginas de servidor passou a ser uma `Promise` nativa (`searchParams: Promise<{ ... }>`).

Em vez de forçar o uso de componentes de cliente com `useSearchParams` — o que causaria desidratação, layout shift e obrigaria o uso de `Suspense` em toda a página inicial —, estruturamos o `page.tsx` como um Server Component que aguarda a resolução dos parâmetros diretamente na borda:

```tsx
interface HomePageProps {
  searchParams: Promise<{
    filtro?: string;
    disponibilidade?: 'READY_TO_SHIP' | 'MADE_TO_ORDER';
    categoria?: string;
    busca?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Montagem dinâmica e tipada da query do Prisma
  const whereClause: Prisma.ProductWhereInput = {
    active: true,
    ...(params.disponibilidade && { availability: params.disponibilidade }),
    ...(params.categoria && { category: { slug: params.categoria } }),
    ...(params.busca && {
      OR: [
        { name: { contains: params.busca, mode: 'insensitive' } },
        { description: { contains: params.busca, mode: 'insensitive' } },
      ],
    }),
  };

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: params.filtro === 'novidades' ? { createdAt: 'desc' } : { order: 'asc' },
    include: { variants: true, category: true },
  });

  return <ProductGrid products={products} activeFilters={params} />;
}
```

Essa abordagem garante **Time to First Byte (TTFB)** consistente, elimina saltos visuais na renderização e permite que URLs com filtros compartilhadas via WhatsApp ou Instagram cheguem pré-renderizadas diretamente do servidor.

---

## 4. O Dilema do CMS: Autonomia Total sem Dependência Técnica

Um problema recorrente em aplicações customizadas é o acoplamento do layout com o código: o programador entrega o site, mas a lojista não consegue alterar uma foto de banner ou trocar a campanha da semana sem acionar suporte técnico.

### Modelagem Dinâmica de Banners e Destaques

Para desacoplar 100% da identidade visual, criamos uma camada de CMS integrada ao banco de dados relacional:

```prisma
enum HighlightType {
  HERO_SLIDE
  STORY_CIRCLE
}

model BannerHighlight {
  id        String        @id @default(cuid())
  title     String
  subtitle  String?
  imageUrl  String
  linkUrl   String
  type      HighlightType
  order     Int           @default(0)
  active    Boolean       @default(true)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}
```

No painel `/admin/personalizacao`, a fundadora gerencia os slides editoriais do carrossel e as bolinhas de *Stories* com upload direto via Supabase Storage. Para evitar que o front-end consulte o banco a cada requisição de imagem estática, toda mutação dispara uma revalidação atômica de cache (`revalidatePath('/')`). O resultado une a flexibilidade de um CMS moderno com a velocidade de páginas estáticas em cache.

---

## 5. Engenharia Financeira, CRO e a Integração com a InfinitePay

O encerramento da jornada de compra precisava responder a dois objetivos: proteger as margens de confecção da empresa e minimizar o atrito no momento do pagamento.

### Frete Escalonado como Alavanca de Ticket Médio

As taxas de parcelamento no cartão de crédito custam mais à operação do que pagamentos à vista via Pix. Em vez de simplesmente aplicar um desconto percentual genérico, implementamos uma régua de frete grátis calibrada no motor logístico (`shipping.ts`):

* **Frete Grátis no Pix:** Pedidos com subtotal a partir de **R$ 199,00**.
* **Frete Grátis no Cartão:** Pedidos com subtotal a partir de **R$ 299,00**.

Na gaveta do carrinho (`CartDrawer.tsx`), a consumidora visualiza uma barra de progresso reativa conectada à store Zustand:

```
Subtotal: R$ 160,00
[████████████████░░░░░░░░] R$ 160 / R$ 199
"Adicione mais R$ 39,00 para desbloquear FRETE GRÁTIS no Pix!"
```

Ao atingir a primeira faixa, a barra celebra o frete no Pix e recalcula instantaneamente a distância até os R$ 299,00 para liberar o benefício também no parcelamento em 12x. O resultado é o aumento natural do número de peças por pedido (*itens por cesta*).

### Arquitetura de Pagamento com a InfinitePay

Diferente de soluções legadas que exigem formulários complexos no front-end e impõem alto risco de conformidade PCI, estruturamos a transação financeira em duas etapas seguras:

```
┌─────────────────────────────────────────────────────────────┐
│ Cliente clica em "Finalizar Compra" (One-Step Guest Checkout)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               v
                 Server Action: createOrder()
              • Cria pedido PENDING no Supabase
              • Gera cobrança na API CloudWalk / InfinitePay
                               │
            ┌──────────────────┴──────────────────┐
            v                                     v
   Retorno da InfinitePay               Redirect Seguro
 (Handle / Link Transacional)          (Pix ou Cartão em 12x)
                                                  │
                                                  v
┌─────────────────────────────────────────────────────────────┐
│           Webhook Seguro (/api/webhooks/infinitepay)        │
│   • Validação de Assinatura Criptográfica HMAC (Secret)     │
│   • Transição Atômica: Order status -> PAID                 │
│   • Baixa de Estoque Real na ProductVariant                 │
└─────────────────────────────────────────────────────────────┘
```

Ao isolar a captura dos dados de cartão no ambiente homologado da adquirente e tratar o fechamento por meio de um webhook criptografado, o sistema garante segurança bancária rigorosa, reduz custos de antecipação e assegura baixa automática de estoque no exato momento da confirmação.

---

## 6. Comparativo de Arquitetura: Decisões de Engenharia

| Aspecto | Abordagem Típica de E-commerce | Abordagem Implementada na Use Azevedo |
| --- | --- | --- |
| **Arquitetura Base** | Monólito em Shopify / WooCommerce com temas prontos e plugins de terceiros. | Arquitetura Headless com Next.js 16 (App Router), Prisma v6 e Supabase. |
| **Dimensionamento & Fit** | Tabela estática de centímetros em imagem ou pop-up burocrático. | Provador Virtual Interativo (*Fit Tech*) com cálculo de tolerância de caimento. |
| **Gestão de Mídia / CMS** | Edição manual via código ou painéis de terceiros lentos e desacoplados. | CMS integrado no `/admin` com upload direto no Supabase Storage e `revalidatePath`. |
| **Navegação Mobile** | Menus verticais clássicos com sobrecarga visual e botões fora do alcance. | Bottom Navigation Bar dedicada, Sticky Cart na PDP e gestos touch com aceleração gráfica. |
| **Regra de Frete** | Frete fixo ou valor único genérico de corte. | Frete escalonado dinâmico (R$ 199 Pix / R$ 299 Cartão) com barra reativa na sacola. |
| **Segurança Financeira** | Armazenamento de dados sensíveis ou plugins de checkout lentos e fragmentados. | Integração direta via API/Webhook com InfinitePay e conformidade PCI nativa. |

---

## Conclusão

O projeto da Use Azevedo consolida uma visão fundamental sobre o desenvolvimento de software para o comércio digital moderno: **estética e engenharia não operam em silos separados**.

A paleta de cores equilibrada em marfim e verde floresta não é apenas uma escolha decorativa; ela estabelece a percepção de alto valor necessária para justificar o tíquete médio. O provador virtual algorítmico não é um recurso supérfluo; ele combate diretamente a dor mais severa de devoluções no vestuário plus size. E a escolha por uma stack de ponta em Next.js 16 e Prisma v6 não é fetiche tecnológico; é a garantia de que a loja responde em milissegundos na rede móvel, sem travamentos e com autonomia operacional absoluta nas mãos de quem realmente toca o negócio.
