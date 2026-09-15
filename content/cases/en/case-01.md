# From the Cutting Table to Cloud Run: Architecture and Engineering Decisions in Dora MES

*How physics-oriented modeling of a textile manufacturing process transformed what seemed like a simple CRUD into a resilient industrial platform.*

---

In theory, a Production Order (OP) seems like a classic linear flow: an order is created, the fabric is cut, the pieces are sewn, they go through quality control, and move on to billing.

In the physics of a textile warehouse, this linearity simply does not exist.

A batch of 500 pieces rarely moves together. Bundles of size S are usually finished days before larger sizes; fabrics from the same roll vary in yield due to humidity and tension; experienced operators sew bundles in parallel with external contractors; and tablets on industrial benches operate under severe conditions of fabric dust, indirect sunlight, and oscillating connections.

When we began designing **Dora MES** — a shop floor and Production Planning and Control (PCP) system custom-developed for the Dora Pinheiro apparel factory —, the goal was not just to digitize paper forms and Excel spreadsheets. The objective was **to design a software architecture that mirrored the real mechanics of manufacturing**, without creating operational friction.

Below, I detail the engineering decisions, architectural trade-offs, and lessons learned throughout the evolution of the system.

---

## 1. Breaking the "OP Monolith": Asynchronous Bundle Lifecycle

The first instinct when designing a factory system is to treat the Production Order as a conventional finite state machine:

```
[QUEUE] ───> [CUTTING] ───> [SEWING] ───> [FINISHING] ───> [COMPLETED]
```

This model fails on the first day of real use.

If an OP of 1,200 polo shirts has 12 bundles of 100 pieces and 4 of them are already being reviewed while 2 are still waiting for the coverstitch machine, what state is the OP in? Treating the entire order under a single status locks up the shop floor or generates false statistical data.

### The Architectural Decision

We decoupled the macro entity (**Production Order**) from its minimum physical handling unit (**Bundle**):

* **The OP** acts as the financial, commercial, and deadline container (metadata, technical references, allocated fabrics, and deadline).
* **The Bundle** is a living and autonomous entity, mapped by color, size, and responsible operator. Each bundle has its own state pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│                 Production Order (Macro)                    │
│ OP-2609-042 | Ref: F2401 | 1,200 pieces | Deadline: Sep 22  │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       v                       v                       v
  Bundle #01 (S)          Bundle #05 (M)          Bundle #12 (XL)
  [QC Review]              [Sewing]                [Waiting]
  Resp: Ivanilde          Resp: Araceli           Resp: Facção X
```

The visual status of the OP on the PCP dashboard became a **derived state**: the order only concludes when all of its individual bundles pass through quality control.

For the mobile interface on the tablets, we adopted an expandable accordion architecture: the operator sees the grouped batch cleanly and, with one tap, expands only the bundles that are physically at their machine.

---

## 2. The "Physics of Fabric": Theoretical Yield vs. Actual Cut Audit

In standard software development, deterministic inputs are expected to generate deterministic outputs. In the textile industry, cutting is stochastic.

When the PCP plans to cut 50 kg of fabric with a nominal yield of 3.2 m/kg, the mathematical calculation predicts exactly $X$ pieces. However, inadequate resting of the roll, thermal shrinkage, or fabric spread losses mean that the actual number of pieces cut is almost never equal to the estimate.

### The Engineering Decision

Instead of forcing consistency with rigid database validations, we designed a **two-phase audit module**:

1. **Predictive Phase (PCP):** The system calculates the matrix ratio of the marker ($S:1, M:2, L:2 \dots$) and generates the expected numbers of bundles and pieces.
2. **Actual Entry Phase (Cutting):** At the end of the spreading process, the operator records the actual physical pieces counted.

```typescript
// Simplified model of the post-cutting audit entry
interface FabricAudit {
  fabricId: string;
  nominalWeightKg: number;
  nominalYieldRatio: number;
  estimatedPieces: number;  // Calculated by PCP
  actualPiecesCut: number;    // Entered at the cutting bench
  lossDiscrepancy: number;   // actualPiecesCut - estimatedPieces
}
```

The system stores the historical discrepancy between the estimate and the actual. This metric feeds a continuous learning loop to calibrate fabric purchases, transforming an operational loss into data intelligence for the company.

---

## 3. Segregation of Contexts: Management (PCP) vs. Operations (Tablet)

Corporate systems frequently suffer from cognitive overload by placing all actions on a single screen, protected only by disabled buttons.

On a shop floor, every second spent scrolling screens or deciphering unnecessary charts represents a delay on the assembly line.

### Functional and Access Segregation (RBAC)

We created two mutually exclusive personas supported by Firebase Authentication and Firestore Security Rules:

| Layer | Management (PCP / Admin) | Operations (Shop Floor) |
| --- | --- | --- |
| **Primary Device** | Desktop / Notebook | Tablet on bench mount |
| **Cognitive Focus** | Planning, deadlines, editing, and costs | Physical execution, agile bundle entry |
| **Visibility** | Sees queued, active, and archived orders | Sees **only** orders cleared for cutting |
| **Metrics** | Bottleneck analysis and line balancing | Focused strictly on their workflow stage |

#### The Decision Against the "Productivity Ranking"

A deliberate design decision was the removal of public productivity rankings among seamstresses in the shop floor view.

In industrial process audits, aggressive gamification on sewing lines usually generates interpersonal friction and encourages increased speed at the expense of defects in quality control. We replaced any aggressive individual metric with a management screen for **Load Distribution**: the PCP visualizes the batch distribution to avoid overloading one seamstress while another awaits supply.

---

## 4. Software Architecture & Stack Choices

```
   ┌────────────────────────────────────────────────────────┐
   │                  Web Client / PWA                      │
   │      Next.js 14+ (App Router) + Tailwind CSS           │
   └───────────┬────────────────────────────────┬───────────┘
               │                                │
    Real-Time Reads                   Server Calls
   (IndexedDB Cache)                 (SSR / Next APIs)
               │                                │
               v                                v
   ┌───────────────────────┐        ┌───────────────────────┐
   │   Firebase Firestore  │        │   Cloud Run Container │
   │  /orders Collection   │        │  (Firebase App Host)  │
   │  /users Collection    │        └───────────┬───────────┘
   └───────────────────────┘                    │
                                       Google Calendar API
                                       (Service Account Sync)
```

### Why Next.js 14 (App Router) + Firebase?

* **Real-Time Reactivity:** Firestore provides native WebSockets with reactive listening (`onSnapshot`). When the cutting bench advances a batch, the PCP screen in the office updates instantly without the need to reload the page.
* **Offline First Tolerance:** With the IndexedDB cache enabled, the tablet remains navigable even during momentary fluctuations in the Wi-Fi signal in the warehouse.
* **Security and Background APIs:** Synchronizing delivery schedules with the **Google Calendar API** utilizes Service Accounts with private RSA cryptographic keys. These keys cannot leak to the client; the Next.js Server Actions/Route Handlers layer allowed us to execute the integration with Google Workspace in an isolated and secure manner.

### Why Migrate to Firebase App Hosting (Cloud Run)?

Initially, traditional static Firebase hosting seemed sufficient. However, the presence of dynamic server routes (SSR) and communication with external APIs required a scalable backend environment.

We opted for **Firebase App Hosting**:

* The application is packaged in a managed Linux container on **Cloud Run** (Node 22).
* We gained scalability from 0 instances (zero cost when the factory is closed) to automatic replicas during synchronization peaks.
* The CI/CD flow was integrated with the GitHub repository, automatically compiling new commits from the production branch.

---

## 5. Operational Resilience: The Devil is in the Details

Industrial systems cannot fail silently. Three specific engineering solutions ensured the solidity of the tool in production:

1. **Logical Retention Trash (*7-day Soft Delete*):**
Accidental deletions on touch screens are common. No OP is erased from Firestore with a single click. Upon deletion, the document receives `isDeleted: true` and an expiration date, instantly leaving the factory line but remaining recoverable by the PCP in an isolated tab.
2. **Visual Deadline Semaphore:**
The PCP deals with dozens of dates. We created a visual alert system based on remaining calendar days:
* **Green (`emerald`):** Operational slack (> 5 days).
* **Amber (`amber`):** Risk window (2 to 5 days).
* **Crimson (`rose`):** Critical risk of delay (< 48 hours or overdue).


3. **Strict Discipline with React Hooks Rules:**
During the refactoring of multiple fabrics editing, we eliminated the use of hooks (`useMemo`) inside dynamic loops (`array.map`), replacing unnecessarily memoized calculations with direct synchronous arithmetic operations. The result was the eradication of hydration bugs and screen freezing in production.

---

## Conclusion: The Value of Domain-Driven Software

The differentiator of good industrial software lies not in the number of imported libraries, but in the **fidelity with which its architecture translates the real world**.

Dora MES started on the drawing board as an order CRUD and consolidated itself as an operational backbone. By embracing the discontinuity of bundles, the physical unpredictability of fabric, and the need for noise-free interfaces for factory tablets, we built a platform that does not try to change the physics of the shop floor — but organizes it with precision, predictability, and technical elegance.
