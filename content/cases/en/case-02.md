# From the Official Gazette to Mobile: Data & Performance in Santos PREP

*How I used a Python script to verify real exam approvals in Official Gazette PDFs and built a fast mobile sales page.*

---

In the civil-service exam market for technical fields like Architecture and Engineering, sales pages full of exaggerated claims and fake countdown timers tend to push away the best candidates.

People studying for these exams are analytical: they read the official notice cover to cover, check the syllabus, and distrust vague numbers. When the City of Santos published Notice No. 74/2026, the goal was to launch a sales page that showed **verified approvals from the previous cohort**, explained the class release schedule transparently, and **loaded instantly on mobile 4G**.

Below is how I structured the Python data verification script and built the Next.js page.

---

## 1. Cross-Referencing Student Spreadsheets with Official Gazette PDFs in Python

The strongest proof for the course was the performance of the previous class in the City of Campinas exam. However, the data lived in two separate places:

1. A sales spreadsheet (`.xlsx`) with hundreds of former students.
2. Public Official Gazette PDFs spanning hundreds of pages of ranked lists, scores, and call-up notices.

Checking all of that manually would take days and miss names. To verify the results accurately, I wrote a Python script to cross-reference both sources:

```
┌──────────────────────────┐          ┌──────────────────────────┐
│    Student Spreadsheet   │          │  Official Gazette (PDF)  │
│      (Sales Records)     │          │ (Ranked Lists & Summons) │
└────────────┬─────────────┘          └────────────┬─────────────┘
             │                                     │
             v                                     v
     Name Normalization                   PDF Parsing (PyPDF)
 (Accent removal via NFKD)              Header/footer cleanup
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                                v
                   Matching & Verification
                                │
                                v
                  Verified Official Numbers:
             • 12 Students on the Approved List
             • 5 Students in the Overall Top 10
             • 4 Official Call-Ups / Appointments
```

The script normalized text strings (stripping accents and case differences via Unicode `NFKD`) and matched each former student inside the public PDFs, confirming **12 approved students** and **5 in the overall Top 10**.

### Respecting Student Privacy (LGPD)

Even though the Official Gazette is public, publishing a full list of students' full names on a commercial page without their direct permission wouldn't be fair to candidates who prefer to study privately.

Instead, I displayed the **verified aggregate numbers** at the top and featured by name only those students who voluntarily sent testimonials and approved publication (such as the 5th and 10th place finishers), preserving everyone else's privacy.

---

## 2. Transparent Schedule & One-Click Sample Download

In post-notice courses, municipal legislation summaries and video lessons are produced and released week by week. Hiding that fact leads to refund requests; explaining it poorly hurts conversions.

To address this upfront, I turned the release calendar into a clear visual section on the page:

| Common Question | Typical Market Approach | How We Built Santos PREP |
| --- | --- | --- |
| **Class release dates** | Vague "Immediate Access" claims | Visual calendar with the exact date for each law |
| **Material format** | Unclear what is PDF vs. video | Separate dates for the PDF summary and the video class |
| **Material sample** | Forces email/WhatsApp sign-up first | Direct 1-click PDF download of the 1st law, no form required |

Any visitor could download the full summary of **Complementary Law No. 1,196/2023** with a single tap before deciding to buy. Seeing the quality of the material right away made a clear difference in conversion.

---

## 3. Making Testimonials Readable on Mobile

Nearly 80% of traffic came from Instagram ads opened on smartphones. In the first draft, WhatsApp screenshots sat inside bordered cards with repeated captions and tiny text that was hard to read on a phone screen.

I redesigned the section around simplicity:

1. **No repeated text:** Removed captions that repeated what was already written inside the screenshot.
2. **Full-screen swipe viewer:** Tapping any screenshot opens it full-screen so the user can swipe left and right (like Instagram Stories) and read the real messages clearly.

```typescript
// Simple touch swipe logic for mobile navigation
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

## 4. Fast Loading on 4G (Static Next.js)

When someone taps an ad on a mobile connection, every second of blank screen causes people to close the tab before seeing the offer.

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js (Static Generation)                 │
│           Pre-built HTML & CSS served from CDN              │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
        Optimized Fonts                  Tailwind CSS
       (local next/font)               Final CSS < 18 KB
    (Zero layout shift / CLS 0)       (No heavy UI libraries)
               │                               │
               └───────────────┬───────────────┘
                               │
                               v
                    ~0.8s load on mobile 4G
                 (100/100 on Core Web Vitals)
```

* **100% static page:** Compiled at build time so Vercel's CDN serves ready-made HTML immediately, without waiting on database queries.
* **Zero layout shift (`CLS = 0.00`):** Fonts preloaded via `next/font` and image dimensions reserved upfront so buttons never jump while the user is reading.
* **Clear pricing card:** Shows the coupon discount and monthly card installment clearly, routing directly to the Eduzz checkout.

---

## Results

Pairing a straightforward Python script to verify public data with a fast, lightweight Next.js page delivered what the launch needed: **100/100 mobile performance** and honest proof that resonated with analytical candidates.
