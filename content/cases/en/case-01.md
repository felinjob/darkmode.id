# From the Cutting Table to Cloud Run: How I Built Dora MES

*How replacing paper tickets in a textile factory required understanding the real shop-floor routine before writing the first line of code.*

---

In theory, a Production Order (OP) looks like a simple straight line: an order arrives, the fabric is cut, pieces move to sewing, pass through quality control, and go out for delivery.

Inside a real textile factory, things don't work like that.

A batch of 500 pieces rarely moves together. Small-size bundles often finish days ahead of larger sizes; rolls of the same fabric yield different quantities depending on tension; internal seamstresses work in parallel with external workshops; and the Wi-Fi signal drops right where the benches are located.

When I designed and coded **Dora MES** — a custom Production Planning and Control (PCP) web system for the Dora Pinheiro apparel factory in Rio de Janeiro —, the goal was to replace paper tickets and spreadsheets with a tool that matched the actual rhythm of the factory floor without slowing down operators.

Below are the main technical decisions behind the project.

---

## 1. Separating the Production Order from the Bundles

The first instinct when building a manufacturing system is to assign a single status to the entire Production Order:

```
[QUEUE] ───> [CUTTING] ───> [SEWING] ───> [FINISHING] ───> [COMPLETED]
```

On the shop floor, this model breaks on day one.

If an order of 1,200 polo shirts is split into 12 bundles of 100 pieces, and 4 bundles are already in quality review while 2 are still waiting at the coverstitch machine, what stage is the order in? Putting the entire order under a single status hides what is actually happening on the floor.

### How I solved it in the database

I separated the macro order (**Production Order**) from the physical unit that actually moves around the factory (**Bundle**):

* **The Production Order (OP)** holds commercial data, deadlines, style references, and planned fabric rolls.
* **The Bundle** is the physical tied pack on the bench, tracked by color, size, and assigned operator. Each bundle moves at its own pace:

```
┌─────────────────────────────────────────────────────────────┐
│                 Production Order (Macro)                    │
│ OP-2609-042 | Ref: F2401 | 1,200 pieces | Due: Sep 22       │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       v                       v                       v
  Bundle #01 (S)          Bundle #05 (M)          Bundle #12 (XL)
  [QC Review]              [Sewing]                [Waiting]
  Resp: Ivanilde          Resp: Araceli           Resp: External Shop
```

On the office dashboard (PCP), the order's progress is calculated automatically from its bundles: a batch only shows as completed when all bundles pass final review.

On the factory tablets, I used a clean accordion list: the operator sees the batch at a glance and taps once to expand only the bundles sitting at their station.

---

## 2. Estimated Yield vs. Actual Fabric Cut

When the office plans to cut 50 kg of fabric at an average yield of 3.2 m/kg, the math predicts an exact number of pieces. On the cutting table, however, fabric relaxation, shrinkage, or end losses change that number almost every day.

Instead of locking the system with rigid validations that force theoretical math to match physical cutting, I built a two-step record:

1. **Estimate (Office):** The system calculates the size ratio (e.g., `S:1, M:2, L:2`) and estimates how many bundles and pieces should come out of the roll.
2. **Actual Count (Cutting Table):** Once cutting finishes, the cutter enters the exact number of pieces produced.

```typescript
interface FabricAudit {
  fabricId: string;
  nominalWeightKg: number;
  nominalYieldRatio: number;
  estimatedPieces: number;  // Planned by the office
  actualPiecesCut: number;  // Counted on the cutting table
  lossDiscrepancy: number;  // Real difference (surplus or loss)
}
```

This gave the factory an accurate history of fabric yield by material and supplier, helping calibrate future fabric purchases.

---

## 3. Two Different Views: Office (PCP) vs. Shop Floor (Tablet)

Putting every feature on a single screen makes software confusing for someone who just needs to check off a bundle of clothes. I split the interface into two role-based views via Firebase Auth:

| Context | Office (PCP / Management) | Shop Floor (Operations) |
| --- | --- | --- |
| **Main device** | Desktop / Laptop | Bench-mounted tablet |
| **Screen focus** | Planning, deadlines, costs, and fabrics | Large touch buttons to update bundles |
| **Visibility** | Queued, active, and archived orders | **Only** orders cleared for cutting |
| **Indicators** | Bottleneck overview and delivery dates | Only the queue for their specific stage |

### Why I left out a "productivity leaderboard"

During design, I ruled out showing a public ranking comparing individual seamstress speeds on the shop-floor screen. In practice, public leaderboards create tension on the line and encourage rushing at the expense of sewing quality.

Instead, I built a **Workload Distribution** view for management only: the goal is to spot who is overloaded and balance bundles across the team so production flows smoothly.

---

## 4. Technical Architecture & Offline Support

```
   ┌────────────────────────────────────────────────────────┐
   │                  Web Application / PWA                 │
   │          Next.js (App Router) + Tailwind CSS           │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
     Real-Time Sync                    Server Routes (SSR)
    (Local Offline Cache)              (Next.js API Routes)
               │                                │
               v                                v
   ┌───────────────────────┐        ┌───────────────────────┐
   │   Firebase Firestore  │        │   Google Cloud Run    │
   │  /orders collection   │        │  (Node 22 Container)  │
   │  /users collection    │        └───────────┬───────────┘
   └───────────────────────┘                    │
                                       Google Calendar API
                                      (Delivery Schedule)
```

* **Instant updates (WebSockets):** Using Firestore's `onSnapshot`, as soon as the cutting bench updates a bundle on the tablet, the office screen updates within milliseconds without refreshing the page.
* **Offline cache on tablets:** With local browser persistence (IndexedDB) enabled, if the warehouse Wi-Fi drops, operators keep logging bundles normally. Once the connection returns, changes sync automatically.
* **Google Calendar sync:** Order delivery dates sync automatically with management's calendar via the Google Calendar API on the server, keeping private credentials safe on the backend.
* **Container hosting (Cloud Run):** The app runs in a container on Google Cloud Run via Firebase App Hosting, scaling down to zero when the factory closes at night and deploying automatically from GitHub.

---

## 5. Practical Details That Matter Day-to-Day

1. **7-day Trash (*Soft Delete*):** Accidental taps happen on touchscreens. No order is permanently deleted on the first click; it moves to a 7-day trash tab where the office can restore it if needed.
2. **Simple deadline traffic light:** To make scanning dozens of open orders easy, each card changes color based on remaining days:
   * **Green:** More than 5 days remaining.
   * **Amber:** Attention window (2 to 5 days).
   * **Red:** Urgent (under 48 hours or overdue).

---

## Results

**Dora MES** removed 100% of paper tickets from the production line and cut batch closing and reconciliation time by roughly 35%. More than introducing new tech to the factory, the system worked because it respected how work actually happens on the bench.
