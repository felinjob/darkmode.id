// @ts-nocheck
import { ProductionOrder, StageStatus, StatusHistoryEntry, ProductionBundle, BundleStatus } from '@/types/dora';

let MOCK_DB: ProductionOrder[] = [];
let MOCK_DB_INITIALIZED = false;

// Helpers to simulate Timestamp for compatibility with types
class MockTimestamp {
  seconds: number;
  nanoseconds: number;
  constructor(date: Date) {
    this.seconds = Math.floor(date.getTime() / 1000);
    this.nanoseconds = (date.getTime() % 1000) * 1000000;
  }
  toMillis() {
    return this.seconds * 1000 + this.nanoseconds / 1000000;
  }
  toDate() {
    return new Date(this.toMillis());
  }
  static now() {
    return new MockTimestamp(new Date());
  }
  static fromDate(date: Date) {
    return new MockTimestamp(date);
  }
}

// Ensure types match what the components expect (they expect firestore Timestamp for `createdAt` etc)
if (typeof window !== 'undefined') {
  (window as any).MockTimestamp = MockTimestamp;
}

// We need a simple event emitter to simulate `onSnapshot`
const listeners: Set<Function> = new Set();
const deletedListeners: Set<Function> = new Set();

function emitUpdate() {
  const activeOrders = MOCK_DB.filter(o => !o.isDeleted).sort((a, b) => {
    const da = a.timestamps?.deadline?.toMillis?.() ?? 0;
    const db = b.timestamps?.deadline?.toMillis?.() ?? 0;
    return db - da; // desc
  });
  listeners.forEach(cb => cb([...activeOrders]));
  
  const deletedOrders = MOCK_DB.filter(o => o.isDeleted).sort((a, b) => {
    const da = a.deletedAt?.toMillis?.() ?? 0;
    const db = b.deletedAt?.toMillis?.() ?? 0;
    return db - da; // desc
  });
  deletedListeners.forEach(cb => cb([...deletedOrders]));
}

// ---------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------

export function subscribeToOrders(callback: (orders: ProductionOrder[]) => void) {
  listeners.add(callback);
  if (!MOCK_DB_INITIALIZED) {
    seedInitialDataIfEmpty().then(() => emitUpdate());
    MOCK_DB_INITIALIZED = true;
  } else {
    emitUpdate();
  }
  return () => { listeners.delete(callback); };
}

export function subscribeToDeletedOrders(callback: (orders: ProductionOrder[]) => void) {
  deletedListeners.add(callback);
  emitUpdate();
  return () => { deletedListeners.delete(callback); };
}

// ---------------------------------------------------------
// CRUD
// ---------------------------------------------------------

export async function softDeleteOrder(id: string): Promise<void> {
  const order = MOCK_DB.find(o => o.id === id);
  if (order) {
    order.isDeleted = true;
    order.deletedAt = MockTimestamp.now() as any;
    emitUpdate();
  }
}

export async function restoreOrder(id: string): Promise<void> {
  const order = MOCK_DB.find(o => o.id === id);
  if (order) {
    order.isDeleted = false;
    order.deletedAt = null as any;
    emitUpdate();
  }
}

export async function permanentDeleteOrder(id: string): Promise<void> {
  MOCK_DB = MOCK_DB.filter(o => o.id !== id);
  emitUpdate();
}

export async function getProductionOrderById(id: string): Promise<ProductionOrder | null> {
  const order = MOCK_DB.find(o => o.id === id);
  return order ? { ...order } : null; // return clone
}

export async function createProductionOrder(orderData: Omit<ProductionOrder, 'id'>): Promise<string> {
  const newOrder: ProductionOrder = {
    id: generateId(),
    ...orderData,
    timestamps: {
      ...orderData.timestamps,
      createdAt: MockTimestamp.now() as any
    }
  };
  MOCK_DB.push(newOrder);
  emitUpdate();
  return newOrder.id;
}

export async function updateProductionOrder(id: string, data: Partial<ProductionOrder>): Promise<void> {
  const idx = MOCK_DB.findIndex(o => o.id === id);
  if (idx !== -1) {
    MOCK_DB[idx] = { ...MOCK_DB[idx], ...data };
    emitUpdate();
  }
}

export async function updateOrderStatus(id: string, status: StageStatus, operatorCount?: number): Promise<void> {
  const order = MOCK_DB.find(o => o.id === id);
  if (!order) return;

  const fromStatus = order.status;
  
  const historyEntry: StatusHistoryEntry = {
    from: fromStatus,
    to: status,
    timestamp: MockTimestamp.now() as any,
  };

  order.status = status;
  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push(historyEntry);

  if (status === 'ENFESTO_CORTE') {
    order.timestamps.cuttingStartedAt = MockTimestamp.now() as any;
  }
  if (status === 'COSTURA') {
    order.timestamps.cuttingFinishedAt = MockTimestamp.now() as any;
    order.timestamps.sewingStartedAt = MockTimestamp.now() as any;
    if (operatorCount !== undefined) {
      order.timestamps.activeSewingOperators = operatorCount;
    }
  }
  if (status === 'REVISAO_QC') {
    order.timestamps.sewingFinishedAt = MockTimestamp.now() as any;
  }
  if (status === 'FINALIZADO') {
    order.timestamps.finishingFinishedAt = MockTimestamp.now() as any;
  }

  emitUpdate();
}

export async function rollbackOrderStatus(id: string, currentStatus: StageStatus): Promise<void> {
  const ROLLBACK_MAP: Partial<Record<StageStatus, StageStatus>> = {
    REVISAO_QC: 'COSTURA',
    COSTURA: 'ENFESTO_CORTE',
    ENFESTO_CORTE: 'FILA',
  };
  const previousStatus = ROLLBACK_MAP[currentStatus];
  if (!previousStatus) throw new Error(`Cannot roll back status: ${currentStatus}`);

  const order = MOCK_DB.find(o => o.id === id);
  if (!order) return;

  const historyEntry: StatusHistoryEntry = {
    from: currentStatus,
    to: previousStatus,
    timestamp: MockTimestamp.now() as any,
    reason: 'Rollback manual pelo operador',
  };

  order.status = previousStatus;
  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push(historyEntry);

  emitUpdate();
}

// ---------------------------------------------------------
// Bundles (Fardos)
// ---------------------------------------------------------

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function generateBundlesFromCut(orderId: string): Promise<void> {
  const order = MOCK_DB.find(o => o.id === orderId);
  if (!order) return;
  if (order.bundles && order.bundles.length > 0) return;

  const bundles: ProductionBundle[] = [];
  
  if (order.fabrics && order.fabrics.length > 0) {
    for (const fabric of order.fabrics) {
      for (const variant of fabric.matrixGrid) {
        for (const [size, sizeData] of Object.entries(variant.sizes)) {
          const qty = sizeData.realCut > 0 ? sizeData.realCut : sizeData.estimated;
          if (qty > 0) {
            bundles.push({
              id: generateId(),
              bundleCode: `${variant.color}-${size}-01`,
              color: variant.color,
              size,
              quantity: qty,
              status: 'AGUARDANDO',
              seamstressOperator: ''
            });
          }
        }
      }
    }
  } else if (order.matrixGrid && order.matrixGrid.length > 0) {
    for (const variant of order.matrixGrid) {
      for (const [size, sizeData] of Object.entries(variant.sizes)) {
        const qty = sizeData.realCut > 0 ? sizeData.realCut : sizeData.estimated;
        if (qty > 0) {
          bundles.push({
            id: generateId(),
            bundleCode: `${variant.color}-${size}-01`,
            color: variant.color,
            size,
            quantity: qty,
            status: 'AGUARDANDO',
            seamstressOperator: ''
          });
        }
      }
    }
  }

  if (bundles.length > 0) {
    order.bundles = bundles;
    emitUpdate();
  }
}

export async function splitBundle(orderId: string, bundleId: string, splitQuantity: number): Promise<void> {
  const order = MOCK_DB.find(o => o.id === orderId);
  if (!order || !order.bundles) return;

  const bundleIndex = order.bundles.findIndex(b => b.id === bundleId);
  if (bundleIndex === -1) return;

  const originalBundle = order.bundles[bundleIndex];
  if (splitQuantity <= 0 || splitQuantity >= originalBundle.quantity) {
    throw new Error('Quantidade inválida.');
  }

  originalBundle.quantity -= splitQuantity;
  
  const newBundle: ProductionBundle = {
    ...originalBundle,
    id: generateId(),
    bundleCode: `${originalBundle.color}-${originalBundle.size}-${generateId().slice(0,3).toUpperCase()}`,
    quantity: splitQuantity,
    status: 'AGUARDANDO',
    seamstressOperator: ''
  };

  order.bundles.splice(bundleIndex + 1, 0, newBundle);
  emitUpdate();
}

export async function updateBundleStatus(
  orderId: string, 
  bundleId: string, 
  status: BundleStatus, 
  seamstress?: string
): Promise<void> {
  const order = MOCK_DB.find(o => o.id === orderId);
  if (!order || !order.bundles) return;

  const bundle = order.bundles.find(b => b.id === bundleId);
  if (bundle) {
    bundle.status = status;
    if (seamstress !== undefined) bundle.seamstressOperator = seamstress;
    emitUpdate();

    // Macro-status sync logic
    if (order.status === 'COSTURA') {
      const allAtLeastPassadoria = order.bundles.every(b => 
        ['PASSADORIA', 'REVISAO_QC', 'CONCLUIDO'].includes(b.status)
      );
      if (allAtLeastPassadoria && order.bundles.length > 0) {
        await updateOrderStatus(orderId, 'REVISAO_QC');
      }
    }
  }
}

export async function finishCuttingAndGenerateBundles(
  orderId: string,
  updatedMatrixGrid: any[] | undefined,
  updatedFabrics: any[] | undefined,
  totalRealPiecesCut: number,
  operatorCount?: number
): Promise<void> {
  const order = MOCK_DB.find(o => o.id === orderId);
  if (!order) return;

  order.totalRealPiecesCut = totalRealPiecesCut;
  order.timestamps.cuttingFinishedAt = MockTimestamp.now() as any;

  if (updatedFabrics && updatedFabrics.length > 0) {
    order.fabrics = updatedFabrics;
  } else if (updatedMatrixGrid && updatedMatrixGrid.length > 0) {
    order.matrixGrid = updatedMatrixGrid;
  }

  await updateOrderStatus(orderId, 'COSTURA', operatorCount);
  await generateBundlesFromCut(orderId);
}

// ---------------------------------------------------------
// Seed
// ---------------------------------------------------------

export async function seedInitialDataIfEmpty(): Promise<void> {
  if (MOCK_DB.length > 0) return;

  const seed: ProductionOrder[] = [
    {
      id: generateId(),
      opNumber: "2609-001",
      modelReference: "F2401",
      clientId: "CLI_1",
      clientName: "FRANK ARTS ESTAMPARIA",
      modelType: "CAMISETA_BASICA",
      modelDescription: "CAMISA M.MALHA ALGODÃO",
      fabricSupplier: "QUATRO K TEXTIL LTDA",
      fabricComposition: "100% ALGODÃO",
      fabricType: "MM PENT. ESP. INFINITY",
      totalFabricWeightKg: 135.64,
      nominalYieldRatio: 4.20,
      totalEstimatedPieces: 570,
      totalRealPiecesCut: 570,
      totalFinalApprovedPieces: 0,
      matrixGrid: [
        {
          color: "BRANCO",
          weightKg: 135.64,
          sizes: {
            "M": { estimated: 200, realCut: 200, readySewn: 0, approvedQc: 0 },
            "G": { estimated: 370, realCut: 370, readySewn: 0, approvedQc: 0 }
          },
          totalEstimated: 570,
          totalRealCut: 570
        }
      ],
      status: "ENFESTO_CORTE",
      priority: "NORMAL",
      timestamps: {
        createdAt: MockTimestamp.now() as any,
        deadline: MockTimestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) as any,
        cuttingStartedAt: MockTimestamp.now() as any
      },
      statusHistory: [
        { from: 'FILA', to: 'ENFESTO_CORTE', timestamp: MockTimestamp.now() as any }
      ]
    },
    {
      id: generateId(),
      opNumber: "2609-002",
      modelReference: "U1082",
      clientId: "CLI_2",
      clientName: "COLÉGIO HORIZONTE",
      modelType: "POLO_PIQUET",
      modelDescription: "POLO PIQUET BRANCA",
      fabricSupplier: "SANTANENSE",
      fabricComposition: "50% ALGODÃO 50% POLI",
      fabricType: "PIQUET PA",
      totalFabricWeightKg: 80.0,
      nominalYieldRatio: 4.0,
      totalEstimatedPieces: 320,
      totalRealPiecesCut: 320,
      totalFinalApprovedPieces: 0,
      matrixGrid: [
        {
          color: "BRANCO",
          weightKg: 80.0,
          sizes: {
            "P": { estimated: 100, realCut: 100, readySewn: 50, approvedQc: 0 },
            "M": { estimated: 220, realCut: 220, readySewn: 50, approvedQc: 0 }
          },
          totalEstimated: 320,
          totalRealCut: 320
        }
      ],
      status: "COSTURA",
      priority: "NORMAL",
      timestamps: {
        createdAt: MockTimestamp.now() as any,
        deadline: MockTimestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)) as any,
        cuttingStartedAt: MockTimestamp.now() as any,
        cuttingFinishedAt: MockTimestamp.now() as any,
        sewingStartedAt: MockTimestamp.now() as any,
        activeSewingOperators: 4
      },
      statusHistory: [
        { from: 'FILA', to: 'ENFESTO_CORTE', timestamp: MockTimestamp.now() as any },
        { from: 'ENFESTO_CORTE', to: 'COSTURA', timestamp: MockTimestamp.now() as any }
      ],
      bundles: [
        { id: generateId(), bundleCode: 'BRANCO-P-01', color: 'BRANCO', size: 'P', quantity: 100, status: 'COSTURANDO', seamstressOperator: 'Maria' },
        { id: generateId(), bundleCode: 'BRANCO-M-01', color: 'BRANCO', size: 'M', quantity: 220, status: 'AGUARDANDO', seamstressOperator: '' }
      ]
    },
    {
      id: generateId(),
      opNumber: "2609-003",
      modelReference: "U1083",
      clientId: "CLI_3",
      clientName: "LOGÍSTICA EXPRESS",
      modelType: "REGATA_DRY",
      modelDescription: "BÁSICA DRY-FIT",
      fabricSupplier: "TEXTIL BRASIL",
      fabricComposition: "100% POLIÉSTER",
      fabricType: "DRY FIT LISO",
      totalFabricWeightKg: 150.0,
      nominalYieldRatio: 5.6,
      totalEstimatedPieces: 850,
      totalRealPiecesCut: 0,
      totalFinalApprovedPieces: 0,
      matrixGrid: [
        {
          color: "PRETO",
          weightKg: 150.0,
          sizes: {
            "G": { estimated: 400, realCut: 0, readySewn: 0, approvedQc: 0 },
            "GG": { estimated: 450, realCut: 0, readySewn: 0, approvedQc: 0 }
          },
          totalEstimated: 850,
          totalRealCut: 0
        }
      ],
      status: "FILA",
      priority: "URGENTE",
      timestamps: {
        createdAt: MockTimestamp.now() as any,
        deadline: MockTimestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) as any
      },
      statusHistory: []
    }
  ];

  MOCK_DB = seed;
  emitUpdate();
}
