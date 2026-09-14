export type StageStatus = 'FILA' | 'ENFESTO_CORTE' | 'COSTURA' | 'REVISAO_QC' | 'FINALIZADO';
export type Priority = 'NORMAL' | 'URGENTE';
export type UniformModelType = 'CAMISETA_BASICA' | 'POLO_PIQUET' | 'POLO_MANGA_LONGA' | 'CALCA_BRIM' | 'REGATA_DRY';
export type BundleStatus = 'AGUARDANDO' | 'EM_COSTURA' | 'PASSADORIA' | 'REVISAO_QC' | 'CONCLUIDO';

export interface MatrixGridSize {
  estimated: number;
  realCut: number;
  readySewn: number;
  approvedQc: number;
}

export interface MatrixGridVariant {
  color: string;
  weightKg: number;
  sizes: Record<string, MatrixGridSize>;
  totalEstimated: number;
  totalRealCut: number;
}

/**
 * A single fabric roll / ticket used in a production order.
 * An OP may have multiple FabricEntries (one per colour or supplier lot).
 */
export interface FabricEntry {
  id: string;
  fabricSupplier: string;
  /** e.g. "100% Algodão", "50% Algodão 50% Poliéster" */
  fabricComposition: string;
  fabricType: string;
  /** Must be >= 0 */
  totalFabricWeightKg: number;
  /** Pieces per kg — must be >= 0 */
  nominalYieldRatio: number;
  matrixGrid: MatrixGridVariant[];
}

/** A cut bundle destined for a seamstress cell. */
export interface ProductionBundle {
  id: string;
  /** e.g. "F01-M-BRANCO" */
  bundleCode: string;
  color: string;
  size: string;
  quantity: number;
  /** Operator name, e.g. "Ivanilde", "Araceli", "Leila" */
  seamstressOperator?: string;
  status: BundleStatus;
}

/** Immutable audit trail entry appended on every status transition. */
export interface StatusHistoryEntry {
  from: StageStatus;
  to: StageStatus;
  /** Firestore server timestamp or Timestamp.now() */
  timestamp: any;
  /** Optional free-text reason (e.g. "Rollback — erro de corte") */
  reason?: string;
}

export interface AnalyticsTimestamps {
  createdAt: any;
  deadline: any;
  googleCalendarEventId?: string;
  cuttingStartedAt?: any;
  cuttingFinishedAt?: any;
  sewingStartedAt?: any;
  sewingFinishedAt?: any;
  activeSewingOperators?: number;
  finishingFinishedAt?: any;
}

export interface ProductionOrder {
  id: string;
  /** Chronological identifier for the shop floor, format AAMM-XXX (e.g. "2609-042") */
  opNumber: string;
  /** Model reference code used in PCP, e.g. "F2401", "F066", "U1082" */
  modelReference: string;
  clientId: string;
  clientName: string;
  modelType: UniformModelType;
  modelDescription: string;

  // ── Legacy flat fabric fields (kept for backward-compat with Firestore docs saved before FabricEntry) ──
  fabricSupplier: string;
  fabricComposition: string;
  fabricType: string;
  totalFabricWeightKg: number;
  nominalYieldRatio: number;
  matrixGrid: MatrixGridVariant[];

  // ── Multi-fabric (new) ──
  /** Preferred source of truth going forward. Falls back to legacy fields when empty. */
  fabrics?: FabricEntry[];

  /** Cut bundles distributed to seamstress cells */
  bundles?: ProductionBundle[];

  totalEstimatedPieces: number;
  totalRealPiecesCut: number;
  totalFinalApprovedPieces: number;
  
  isDeleted?: boolean;
  deletedAt?: any;

  status: StageStatus;
  priority: Priority;
  timestamps: AnalyticsTimestamps;

  /** Free-text observations, editable from the details screen */
  notes?: string;

  /** Immutable audit log of every status transition */
  statusHistory?: StatusHistoryEntry[];
}
