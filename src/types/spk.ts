export type CriterionType = 'benefit' | 'cost';

export interface Criterion {
  id: string;
  code: string; // e.g. C1, C2, C3
  name: string;
  type: CriterionType;
  weight: number; // Raw weight (e.g., 0.25 or 25)
  description?: string;
  unit?: string;
}

export interface Alternative {
  id: string;
  code: string; // e.g. A1, A2, A3
  name: string;
  location: string;
  description: string;
  // Criteria scores mapped by criterion id
  scores: Record<string, number>;
  verifiedHandwoven?: boolean; // Tenun asli tangan ATBM / Gedog
}

export interface SAWEvaluation {
  alternativeId: string;
  code: string;
  name: string;
  location: string;
  rawScores: Record<string, number>;
  normalizedScores: Record<string, number>; // r_ij
  finalScore: number; // V_i
  rank: number;
}

export interface SAWResult {
  evaluations: SAWEvaluation[];
  minMaxPerCriterion: Record<string, { min: number; max: number }>;
  normalizedWeights: Record<string, number>;
}

export interface AHPConsistency {
  lambdaMax: number;
  ci: number; // Consistency Index
  ri: number; // Random Index
  cr: number; // Consistency Ratio
  isConsistent: boolean; // CR <= 0.10
  statusMessage: string;
}

export interface AHPResult {
  matrix: number[][]; // n x n criteria pairwise matrix
  criteriaIds: string[];
  columnSums: number[];
  normalizedMatrix: number[][];
  weights: Record<string, number>; // Priority Vector (Eigenvector) W [1 x n]
  weightedSumVector: number[]; // D = A * w
  consistencyVector: number[]; // C = D / w
  consistency: AHPConsistency;
  // Alternative pairwise comparison data per criterion
  alternativeMatrices: Record<string, number[][]>; // criterionId -> pairwise matrix [m x m]
  alternativeColumnSums: Record<string, number[]>;
  alternativeNormalizedMatrices: Record<string, number[][]>;
  alternativeLocalPriorities: Record<string, number[]>; // criterionId -> local priority vector [m]
  alternativeConsistency?: Record<string, AHPConsistency>;
  combinedAlternativeMatrix: number[][]; // Matrix A [m x n] (m alternatives x n criteria)
  evaluations: {
    alternativeId: string;
    code: string;
    name: string;
    location: string;
    finalScore: number;
    rank: number;
  }[];
}

export interface ComparisonItem {
  alternativeId: string;
  code: string;
  name: string;
  location: string;
  sawScore: number;
  sawRank: number;
  ahpScore: number;
  ahpRank: number;
  rankDiff: number; // sawRank - ahpRank (e.g. positive means ranked higher in AHP)
  isBestInBoth: boolean;
}

export interface ScenarioPreset {
  id: string;
  title: string;
  targetUser: string;
  description: string;
  criteriaWeights: Record<string, number>;
  ahpPairwiseAdjustments?: { c1: string; c2: string; val: number }[];
}
