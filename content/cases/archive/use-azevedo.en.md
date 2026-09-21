# From Plus Size Modeling to the Edge: Mobile-First Architecture, Fit Tech, and E-Commerce Engineering at Use Azevedo

*How quiet UI/UX decisions, a dimensional fit recommendation algorithm, and a headless architecture in Next.js 16 transformed a custom-made atelier into a high-conversion retail platform.*

---

In the e-commerce ecosystem, the most common temptation when launching an apparel brand is to resort to pre-made shortcuts: uploading a generic template on Shopify or WooCommerce, installing a dozen heavy plugins for shipping and discount pop-ups, and hoping that the traffic converts.

In the mid and plus size women's fashion niche (sizes 14 to 26+), this superficial model breaks down immediately.

Purchasing apparel online in Brazil already naturally deals with one of the highest return rates in global retail — ranging between 25% and 40% —, driven by the asymmetry of fit expectation. When we transpose this reality to the plus size audience, the friction doubles: the fear of the piece not closing at the bust, snagging on the hips, or having an inconsistent modeling generates mass cart abandonment. If the platform looks amateurish or if the customer does not feel absolute security in the ergonomics of the measurements, she simply does not swipe her card.

When structuring the engineering and design of **Use Azevedo**, the goal was not to set up a simple virtual catalog storefront. The challenge lay in conceiving a high-speed, mobile-oriented headless transactional platform, capable of solving the fit pain (*Fit Tech*), orchestrating ready-to-ship items with on-demand manufacturing, and delivering total operational autonomy to the store owner through a proprietary CMS.

Below, I record the software architecture decisions, product engineering, aesthetic trade-offs, and conversion rate optimization (CRO) techniques adopted in the development of the platform.

---

## 1. "Quiet Luxury" Visual Identity and Thumb Ergonomics in Mobile-First

The first visual iteration of the store suffered from a common vice in conceptual e-commerce projects: the use of strident contrasts. Elements in saturated yellow and gold overlaid on forest green created a tone of aggressive promotional retail, colliding with the brand's value proposition, which produces handcrafted pieces and artisanal tailoring.

### The Chromatic Transition: Ivory and Deep Forest Green

We decided to reformulate the design tokens base in Tailwind CSS, orienting the project to the principles of *quiet luxury* (editorial references like Jacquemus and The Row):

* **Noble Chromatic Base:** Forest Green (`#0B3B24`) assumed the institutional role in the header, footer, and primary buttons.
* **Eradication of Gold/Yellow:** All texts and decorative elements over the green background were migrated to Soft Ivory (`#F4F0E8` / Ivory). This guaranteed a crisp WCAG AA contrast ratio, without yellowish visual reflections.
* **Breathing Canvas:** The body of the store and product display pages (PDP) adopted the Off-White Canvas (`#FAF8F5`), creating a soft contrast that values the real photos of the fabrics instead of overshadowing them with pure white (`#FFFFFF`).

### The "Thumb Zone" Architecture

More than 84% of fashion consumers browse via smartphone. On screens from 390px to 430px wide, essential interactive elements cannot be isolated at the top of the screen.

```
┌──────────────────────────────────────┐  ^
│ [Menu]        [LOGO]          [Cart] │  │ Stretch Zone
├──────────────────────────────────────┤  │ (Hard to Reach)
│                                      │  v
│       Hero Editorial / Storefront    │
│        Natural Scroll with Swipe     │
│                                      │
├──────────────────────────────────────┤  ^
│ [ Floating Purchase Bar (PDP) ]      │  │ NATURAL THUMB ZONE
├──────────────────────────────────────┤  │ (Immediate Conversion:
│ [Home]  [Search]  [Cart]  [Whats]    │  │  Bottom Nav & Sticky Cart)
└──────────────────────────────────────┘  v
```

To ensure that the entire journey could be executed with a single hand, we implemented three dedicated components:

1. **Bottom Navigation Bar (`MobileTabBar.tsx`):** Fixed to the footer in mobile views (`md:hidden`), it provides immediate shortcuts to Home, Search Drawer with quick suggestions, Cart (with reactive count), and humanized WhatsApp.
2. **Sticky Purchase Bar on PDP (`MobileStickyCartBar.tsx`):** Upon scrolling past the traditional purchase button on a dress page, a compact bar smoothly slides in at the base containing the piece's thumbnail, the agile size selector (14 to 26), and the call to action. The customer doesn't have to scroll all the way back up to buy.
3. **Native Carousels with Hardware Acceleration:** We replaced generic libraries with `embla-carousel-react`, ensuring swipe with real physical inertia in the editorial carousels and circular categories (*Stories*), without frame loss due to DOM repainting.

---

## 2. The Fit Tech Algorithm: Eliminating the Plus Size Dimensional Barrier

The main conversion bottleneck in plus size apparel isn't price: it's skepticism regarding sizing. A customer who wears size 18 in one brand might need size 22 in another. Providing only a static text table with numbers in centimeters transfers all the cognitive effort to the user, generating decision paralysis.

We built an **Interactive Virtual Fitting Room (`FitFinderModal.tsx`)** based on a deterministic dimensional recommendation algorithm.

### The Dimensional Model in the Database

Instead of modeling only generic textual sizes ("L", "XL"), each physical product variant carries its real modeling dimensions:

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

### The Proximity and Wearability Ease Algorithm

When the customer inputs her three basic body measurements (Bust, Waist, and Hips) through touch-sensitive sliders, the system executes the direct fit calculation against all available variants for that piece:

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
  // Minimum ease recommended for woven fabric comfort (in cm)
  const EASE_TOLERANCE = { min: 2.0, ideal: 4.0, max: 8.0 };

  let bestMatch: FitScore | null = null;
  let lowestPenalty = Infinity;

  for (const v of variants) {
    const deltaBust = v.bustCm - user.bust;
    const deltaWaist = v.waistCm - user.waist;
    const deltaHip = v.hipCm - user.hip;

    // If the piece is smaller than the body in any critical point, penalize severely
    if (deltaBust < 0 || deltaWaist < 0 || deltaHip < 0) {
      continue;
    }

    // Weighted Euclidean distance calculation relative to ideal ease
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

The result is presented in humanized language: *"Recommended Size: 48 — Comfortable fit on the bust, natural adjustment on the waist, and fluid on the hips"*. By clicking "Apply Size", the variant is selected on the page without the customer needing to interpret complex numerical tables.

---

## 3. Next.js 16 Architecture, Prisma v6, and Reactivity with Async SearchParams

At the software engineering layer, the project was architected under Next.js 16 (App Router) with strict TypeScript and Prisma v6 connecting to a managed PostgreSQL instance on Supabase.

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 16 (App Router)                    │
│        Server Component: Reactive Storefront (page.tsx)     │
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
│    Combined Filter: Category + Availability + Search        │
└─────────────────────────────────────────────────────────────┘
```

### The Challenge of Async `searchParams`

In Next.js 15 and 16, accessing URL parameters on server pages became a native `Promise` (`searchParams: Promise<{ ... }>`).

Instead of forcing the use of client components with `useSearchParams` — which would cause dehydration, layout shifts, and force the use of `Suspense` across the entire homepage —, we structured `page.tsx` as a Server Component that awaits the resolution of parameters directly at the edge:

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

  // Dynamic and typed construction of the Prisma query
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

This approach guarantees a consistent **Time to First Byte (TTFB)**, eliminates visual jumps during rendering, and allows URLs with filters shared via WhatsApp or Instagram to arrive pre-rendered directly from the server.

---

## 4. The CMS Dilemma: Total Autonomy Without Technical Dependency

A recurring problem in custom applications is the coupling of layout with code: the programmer delivers the site, but the store owner cannot change a banner photo or swap the weekly campaign without triggering technical support.

### Dynamic Modeling of Banners and Highlights

To decouple 100% of the visual identity, we created a CMS layer integrated with the relational database:

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

In the `/admin/personalizacao` panel, the founder manages the editorial carousel slides and the *Stories* bubbles with direct uploads via Supabase Storage. To prevent the front-end from querying the database on every static image request, every mutation triggers an atomic cache revalidation (`revalidatePath('/')`). The result combines the flexibility of a modern CMS with the speed of cached static pages.

---

## 5. Financial Engineering, CRO, and InfinitePay Integration

The closing of the purchase journey needed to respond to two objectives: protect the company's manufacturing margins and minimize friction at the time of payment.

### Scaled Shipping as an Average Ticket Lever

Credit card installment fees cost the operation more than upfront payments via Pix. Instead of simply applying a generic percentage discount, we implemented a free shipping ruler calibrated in the logistics engine (`shipping.ts`):

* **Free Shipping on Pix:** Orders with a subtotal starting at **R$ 199.00**.
* **Free Shipping on Credit Card:** Orders with a subtotal starting at **R$ 299.00**.

In the cart drawer (`CartDrawer.tsx`), the consumer visualizes a reactive progress bar connected to the Zustand store:

```
Subtotal: R$ 160.00
[████████████████░░░░░░░░] R$ 160 / R$ 199
"Add R$ 39.00 more to unlock FREE SHIPPING on Pix!"
```

Upon reaching the first tier, the bar celebrates free shipping on Pix and instantly recalculates the distance to R$ 299.00 to also unlock the benefit for 12x installments. The result is a natural increase in the number of items per order (*items per basket*).

### Payment Architecture with InfinitePay

Unlike legacy solutions that require complex forms on the front-end and impose high PCI compliance risk, we structured the financial transaction in two secure steps:

```
┌─────────────────────────────────────────────────────────────┐
│ Customer clicks "Finalizar Compra" (One-Step Guest Checkout)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               v
                  Server Action: createOrder()
               • Creates PENDING order in Supabase
               • Generates charge on CloudWalk / InfinitePay API
                               │
            ┌──────────────────┴──────────────────┐
            v                                     v
   InfinitePay Return                   Secure Redirect
 (Handle / Transactional Link)      (Pix or Card in 12x)
                                                  │
                                                  v
┌─────────────────────────────────────────────────────────────┐
│           Secure Webhook (/api/webhooks/infinitepay)        │
│   • HMAC Cryptographic Signature Validation (Secret)        │
│   • Atomic Transition: Order status -> PAID                 │
│   • Real Inventory Deduction in ProductVariant              │
└─────────────────────────────────────────────────────────────┘
```

By isolating the capture of card data in the acquirer's homologated environment and handling the closing via an encrypted webhook, the system guarantees rigorous banking security, reduces anticipation costs, and ensures automatic inventory deduction at the exact moment of confirmation.

---

## 6. Architecture Comparison: Engineering Decisions

| Aspect | Typical E-commerce Approach | Approach Implemented at Use Azevedo |
| --- | --- | --- |
| **Base Architecture** | Monolith on Shopify / WooCommerce with ready-made themes and third-party plugins. | Headless Architecture with Next.js 16 (App Router), Prisma v6, and Supabase. |
| **Sizing & Fit** | Static table of centimeters in an image or bureaucratic pop-up. | Interactive Virtual Fitting Room (*Fit Tech*) with wearability tolerance calculation. |
| **Media Management / CMS** | Manual editing via code or slow, decoupled third-party panels. | Integrated CMS in `/admin` with direct upload to Supabase Storage and `revalidatePath`. |
| **Mobile Navigation** | Classic vertical menus with visual overload and out-of-reach buttons. | Dedicated Bottom Navigation Bar, Sticky Cart on PDP, and touch gestures with graphics acceleration. |
| **Shipping Rule** | Flat rate or generic single cutoff value. | Dynamic scaled shipping (R$ 199 Pix / R$ 299 Card) with reactive bar in the cart. |
| **Financial Security** | Storage of sensitive data or slow and fragmented checkout plugins. | Direct integration via API/Webhook with InfinitePay and native PCI compliance. |

---

## Conclusion

The Use Azevedo project consolidates a fundamental vision about software development for modern digital commerce: **aesthetics and engineering do not operate in separate silos**.

The balanced color palette in ivory and forest green is not just a decorative choice; it establishes the perception of high value necessary to justify the average ticket. The algorithmic virtual fitting room is not a superfluous feature; it directly combats the most severe pain point of returns in plus size apparel. And the choice for a cutting-edge stack in Next.js 16 and Prisma v6 is not a technological fetish; it is the guarantee that the store responds in milliseconds on the mobile network, without crashing, and with absolute operational autonomy in the hands of those who truly run the business.
