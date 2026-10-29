# Custom E-Commerce & Virtual Fitting: How I Built the Use Azevedo Store

*How I developed a custom online store in Next.js and PostgreSQL with an integrated size recommender and a simple admin panel for a plus-size fashion brand.*

---

When launching an online clothing store, the most common path is renting a template platform, installing third-party plugins, and dropping a static centimeter chart onto the product page.

For **Use Azevedo** — a women's fashion brand in Rio de Janeiro specializing in sizes 44 to 56+ (US 14 to 26+) —, that approach had two clear drawbacks:

1. **Sizing hesitation on mobile:** In plus-size fashion, worrying whether a piece will pull at the bust or feel tight on the hips causes many shoppers to abandon their cart or request exchanges later. Reading a static number table on a small phone screen is frustrating.
2. **Monthly fees and slow mobile pages:** Rented platforms charge ongoing fees, limit customization, and often feel sluggish on mobile 4G.

My goal was to build a **fast, custom online store** featuring a **simple Virtual Fitting tool** to answer sizing questions on the spot, plus a **straightforward admin panel** so the brand owner could manage products, photos, and orders on her own.

---

## 1. Clean Visuals & Thumb-Friendly Mobile Navigation

Over 80% of the brand's customers browse on their phones, mostly coming from Instagram. I designed the interface around comfortable reading and one-handed navigation:

* **Soft color palette:** Replaced harsh pure-white backgrounds with a warm off-white canvas (`#FAF8F5`) paired with deep forest green (`#0B3B24`), letting the fabric photos stand out naturally.
* **Bottom navigation bar:** On mobile, the main shortcuts (Home, Search, Bag, and WhatsApp) sit fixed at the bottom of the screen where the thumb naturally rests:

```
┌──────────────────────────────────────┐
│ [Menu]        [LOGO]           [Bag] │
├──────────────────────────────────────┤
│                                      │
│       Product Photos & Details       │
│        Smooth touch scrolling        │
│                                      │
├──────────────────────────────────────┤
│ [ Quick Bar: Pick Size + Buy Now ]   │ <-- Slides in when scrolling
├──────────────────────────────────────┤
│ [Home]  [Search]   [Bag]  [WhatsApp] │ <-- Always within thumb reach
└──────────────────────────────────────┘
```

As the shopper scrolls down a dress page to read details, a compact bar slides in at the bottom with the size selector (44 to 56) and the buy button always within reach.

---

## 2. The Virtual Fitting Tool: Recommending Sizes Without the Math

To spare customers from mentally cross-referencing measurement tables, I built the **Virtual Fitting Room (`FitFinderModal.tsx`)**.

### Real garment measurements stored per size in the database

In PostgreSQL (modeled with Prisma), each size variant of a garment stores its actual bust, waist, and hip dimensions:

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

### Calculating fit and fabric ease

The customer simply adjusts three touch sliders with her measurements (bust, waist, and hips). The function compares those numbers against the garment's variants, accounting for comfortable fabric ease so the piece doesn't feel tight:

```typescript
export function calculateIdealSize(
  user: BodyMeasurement,
  variants: VariantMeasurements[]
): FitScore | null {
  // Recommended fabric ease in centimeters for a comfortable fit
  const EASE_TOLERANCE = { min: 2.0, ideal: 4.0, max: 8.0 };

  let bestMatch: FitScore | null = null;
  let lowestPenalty = Infinity;

  for (const v of variants) {
    const deltaBust = v.bustCm - user.bust;
    const deltaWaist = v.waistCm - user.waist;
    const deltaHip = v.hipCm - user.hip;

    // Skip sizes smaller than the shopper's body measurements
    if (deltaBust < 0 || deltaWaist < 0 || deltaHip < 0) continue;

    // Find the size closest to the ideal comfort ease
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

Instead of showing raw numbers, the screen replies in plain language: *"Recommended size: 48 — Comfortable fit on the bust, natural at the waist, and relaxed on the hips"*. One tap applies the size directly to the product page.

---

## 3. Custom Admin Panel (Full Autonomy for the Owner)

Building a fast store wouldn't help much if the owner had to call a developer every time she wanted to swap a homepage banner, add a new dress, or update a price.

I built a password-protected admin area (`/admin`) connected to Supabase:

* **Products & Inventory:** Easy forms to add items, upload photos, set measurements per size, and manage stock (both ready-to-ship and made-to-order pieces).
* **Banners & Highlights:** The owner uploads new hero banners and Story highlights straight from her phone. Whenever she saves a change, Next.js refreshes the storefront cache (`revalidatePath('/')`) immediately so the site stays fast.

---

## 4. Free-Shipping Progress Bar & InfinitePay Checkout

To help increase average order value and keep checkout simple, I added two practical features at the end of the purchase flow:

### 1. Live free-shipping progress bar in the bag
Because Pix payments cost the store less in fees than credit card installments, we set up two free-shipping thresholds shown live inside the bag drawer:

```
Subtotal: R$ 160.00
[████████████████░░░░░░░░] R$ 160 / R$ 199
"Add R$ 39.00 more to unlock FREE SHIPPING with Pix!"
```

This naturally encourages shoppers to add a second item before checking out.

### 2. Automated checkout & webhook confirmation (InfinitePay)
When the customer clicks checkout, the server records the pending order in PostgreSQL and redirects to **InfinitePay's** secure payment page (supporting Pix or credit card in up to 12x). As soon as payment is confirmed, a signed webhook (`/api/webhooks/infinitepay`) updates the order status to paid and deducts the exact size from inventory automatically.

---

## System Summary

| Layer | What Was Built |
| --- | --- |
| **Frontend & Server** | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| **Database** | PostgreSQL (Supabase) + Prisma ORM |
| **Sizing Confidence** | Virtual Fitting Room with fabric ease calculation |
| **Store Management** | Custom `/admin` dashboard with direct photo uploads |
| **Payments** | API & signed Webhook integration with InfinitePay |

The result is a fast online store with zero monthly platform rent, giving full daily autonomy to the brand owner and cutting size-related returns by roughly 42%.
