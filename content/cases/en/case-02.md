# From the Official Gazette to the Edge: Data Engineering, CRO, and Architectural Decisions in Resumos Santos

*How the analytical cross-referencing of public data, ethical modeling of social proof, and a conversion-oriented frontend architecture transformed a post-notice landing page into a high-performance sales platform.*

---

In digital marketing theory, an info-product landing page seems like a trivial formula: a catchy headline, some colorful buttons, stacked screenshots of messages, and a pricing table with an artificial scarcity timer.

In the brutal reality of the high-level civil service exam market — such as Architecture and Engineering exams —, this simplistic model generates immediate friction and rejection.

Experienced exam candidates are analytical professionals. They read the notices in full, detect pedagogical inconsistencies in seconds, and immediately distrust empty promises. When the City of Santos notice No. 74/2026 (IBAM board) was published, the launch time window required more than just "making noise": it required **technical tangibility, auditable social proof, and zero-friction mobile navigation**.

Below, I detail the software engineering decisions, the analytical data pipeline, and the UX/UI trade-offs adopted to build the commercial platform for **Resumos Legislação Santos 2026**.

---

## 1. From Raw Data to Audited Proof: Cross-Referencing Pipeline and GDPR Compliance

The biggest credibility challenge in preparatory info-products is the skepticism regarding testimonials. Any page can invent random phrases; few can back their numbers with official records.

We had two unstructured datasets regarding the previous City of Campinas exam (Notice 01/2025):

1. A transactional sales database (`.xlsx`) with hundreds of student records, emails, and purchase metadata.
2. The Official Gazette of the City of Campinas in vector PDF format, containing hundreds of pages with the nominal list of approved candidates, scores, quotas (LAC, PPP, PcD), and summons acts.

### The Python Reconciliation Pipeline

Instead of accepting empirical approval estimates, we implemented an analytical textual audit pipeline to cross-reference the two sources:

```
┌──────────────────────────┐          ┌──────────────────────────┐
│     Sales Spreadsheet    │          │  Official Gazette (PDF)  │
│ (Customers, IDs, Emails) │          │     (Summons Acts)       │
└────────────┬─────────────┘          └────────────┬─────────────┘
             │                                     │
             v                                     v
   Sanitization and N-Gram              Vector Extraction (PyPDF)
  Unicode Normalization (NFD)         Header/Metadata Removal
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                                v
                      Reconciliation Algorithm
                  (Exact Matching + Token Fallback)
                                │
                                v
                   Audited Official Metrics:
              • 12 Students on the Approved List
              • 5 Students in the Overall Top 10
              • 4 Immediate Summons / Appointments
```

We used Unicode normalization techniques (`NFKD`) to remove accents and handled partial matches via token decomposition. The cross-referencing revealed with surgical precision: **12 approved students**, with **5 of them positioned in the Top 10** (including the 5th place overall and the 3rd place PcD), with proven summons in the Official Gazette.

### The Ethical Trade-off: Privacy vs. Commercial Impact

With the list of names confirmed, the first marketing suggestion was to publish the complete list with the name and placement of each student.

This idea was discarded. Publicly displaying the civil names of exam candidates without explicit consent violates GDPR (LGPD in Brazil) guidelines and exposes the privacy of those who often take exams confidentially.

We opted for a standard inspired by the best analytical study platforms:

* **Statistical Mosaic and Big Numbers:** The user is impacted by consolidated aggregate data (12 approved, 5 in the Top 10, 4 appointments).
* **Qualified Spotlight:** Only students who sent voluntary and authorized reports (like Thiago Darlan, 5th place, and Vanessa de Moraes, 10th place) received individual highlight reports.
* **Anonymization with Legal Disclaimer:** Inclusion of a transparent note informing the nominal preservation of the other approved candidates.

---

## 2. Tangibilizing the "Future": Deconstructing Post-Notice Insecurity

One of the biggest conversion bottlenecks in post-notice courses lies in the fact that the complete content is almost never delivered at the time of purchase. Dense municipal legislation (such as the Master Plan and the Environmental Licensing Law of Santos) requires time for schematization and recording.

If the page hides this reality, refund rates explode in the first 7 days. If the page exposes this information bureaucratically, the conversion rate plummets.

### The UI/UX Decision: Delivery Schedule as a Feature

We transformed the production calendar into a trust asset (`ScheduleSection.tsx`):

| Attribute | Common Market Approach | Our Approach in Resumos Santos |
| --- | --- | --- |
| **Content Status** | Generic promises of "Immediate Access" | Visual timeline with exact dates per norm |
| **Delivery Format** | Selling only the PDF with no predictability | Explicit separation between PDF and video class dates |
| **Product Sample** | Generic "Free E-book" with lead capture | Real, direct sample of the first norm on the site |

Each of the 8 municipal laws received a visual card containing the precise release date of the schematized summary and the subsequent date of the video class with commented questions.

To eliminate any decision friction, **Complementary Law No. 1,196/2023** was made available immediately for direct download (`/Nova-Amostra-Resumo-Santos.pdf`) with one click, without forms or barriers. When the visitor opens the document and realizes the depth of the material, the perceived value anchors at the top.

---

## 3. Mobile Ergonomics and the Redesign of the Testimonials Component

Over 78% of qualified civil service exam traffic originating from ads and social media accesses the landing page via smartphone. On 390px wide screens, ergonomic errors cost sales.

In the first iteration of the testimonials section, WhatsApp screenshots were organized in traditional white cards, containing colored badges, bold titles, repeated text transcriptions, and the message thumbnail:

```
┌──────────────────────────────────────────────────┐
│ [BADGE: APPROVED]                           " "  │
│ "The material was fundamental for me to pass!"   │  <-- Text redundancy
│ Thank you so much! The material was fundamental..│
│ ┌──────────────────────────────────────────────┐ │
│ │   [WhatsApp print with illegible letters]    │ │  <-- Tiny space
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

This structure generated two critical problems:

1. **Cognitive Pollution and Redundancy:** The visitor read the same sentence three times on the same card.
2. **Image Illegibility:** On mobile screens, the conversation text inside the print became microscopic, forcing the user to give up reading.

### Social Proof Refactoring: Touch Gallery and Native Lightbox

We rewrote the component (`TestimonialsSection.tsx`) adopting three principles:

1. **Removal of Visual Noise:** We eliminated boxes, heavy shadows, and artificial tags ("Approved", "Student"). The real screenshots were positioned directly on the layout, conveying organic authenticity.
2. **Progressive Curation:** Initial display limited to the strongest prints, complemented by a subtle expandable button (*"See more real testimonials"*), avoiding infinite vertical scrolling on mobile.
3. **Lightbox with Gesture Navigation (*Touch Swipe*):** By touching any image, the full screen opens instantly with a *backdrop blur*. Instead of forcing the user to close the modal to see the next print, we implemented continuous navigation through lateral swipe gestures on mobile and semi-transparent buttons on desktop.

```typescript
// Simplified logic for mobile swipe gesture
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

## 4. Frontend Architecture & Stack Choices

Loading speed on oscillating 4G/5G mobile networks is one of the biggest ranking and conversion factors. Adopting a bloated stack with dozens of third-party dependencies would degrade Core Web Vitals.

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 14+ (App Router)                    │
│             SSG / ISR with Edge Optimization                │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
        Next/Font (Google)               Tailwind CSS
    Plus Jakarta Sans + Inter         Atomic Design System
  (Zero Layout Shift - CLS = 0)         CSS Purge (< 18KB)
               │                               │
               └───────────────┬───────────────┘
                               │
                               v
                      Vercel Edge Network
              (LCP < 1.1s | TTFB < 90ms in Brazil)
```

* **Next.js App Router with Static Rendering:** The landing page is compiled at build as purely static HTML/CSS. The Time to First Byte (TTFB) operates below 90ms on the Vercel edge in Brazil, ensuring a Largest Contentful Paint (LCP) of less than 1.1 seconds.
* **Rationalized Typography:** We eliminated heavy experimental fonts that caused *Cumulative Layout Shift* (CLS). We adopted `Plus Jakarta Sans` for titles and authority hierarchy, combined with `Inter` for long reading, natively preloaded by `next/font`.
* **Tailwind CSS and Zero Traffic Leakage:** The final compiled CSS weighs less than 18 KB. The page header was deliberately designed without anchor navigation links ("About Us", "FAQ"), channeling 100% of visual attention to the conversion buttons and sample download.

---

## 5. Price Engineering and Purchase Friction Reduction

A good interface cannot survive a poorly communicated commercial strategy. The checkout needed to anchor the course value without seeming confusing between the individual purchase of legislation and the integrated preparation combo.

### Dynamic Anchoring and Installment Presentation

In medium-ticket digital purchases, the total upfront value often scares the buyer who is at the beginning of their preparation. We implemented a triple anchor on the checkout card:

1. **Anchored Full Price:** Display of the crossed-out nominal value (`R$ 234.00`).
2. **Active Coupon Discount:** Highlight of the promotional upfront price with applied code (`R$ 210.60 with SANTOS10`).
3. **Low-Friction Installments:** Direct visual calculation of credit card installments (`12x of R$ 24.20`), reducing the psychological barrier of entry to a value lower than a meal per month.

All flows were configured to route directly to the Eduzz gateway with native security seals and a 7-day unconditional guarantee, preemptively neutralizing the main risk objections raised in the interactive FAQ.

---

The technical and commercial result of Resumos Santos proves that a high-performance landing page is not born from ready-made templates or magic marketing formulas. It is the result of the convergence between rigorous data analysis, clarity regarding real user pain points, and a disciplined frontend engineering that treats every loading millisecond and every interface pixel as determining factors for product success.
