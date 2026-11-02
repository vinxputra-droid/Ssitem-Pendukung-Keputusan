import { Alternative, Criterion, AHPResult, AHPConsistency } from '../types/spk';
import { SAATY_RI_TABLE, DEFAULT_ALTERNATIVE_PAIRWISE_MATRICES } from '../data/defaultData';

/**
 * Ensures an n x n pairwise matrix has a_ii = 1 and a_ji = 1 / a_ij.
 */
export function sanitizePairwiseMatrix(rawMatrix: number[][], n: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else if (rawMatrix[i] && rawMatrix[i][j] !== undefined && rawMatrix[i][j] > 0) {
        matrix[i][j] = rawMatrix[i][j];
      } else {
        matrix[i][j] = 1;
      }
    }
  }

  // Enforce reciprocity: a_ji = 1 / a_ij
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        if (matrix[i][j] !== 1 && matrix[j][i] === 1) {
          matrix[j][i] = Number((1 / matrix[i][j]).toFixed(4));
        }
      }
    }
  }
  return matrix;
}

/**
 * Calculates consistency index and ratio for a given pairwise matrix and priority vector.
 */
export function calculateConsistency(
  matrix: number[][],
  weightsArr: number[],
  n: number
): { weightedSumVector: number[]; consistencyVector: number[]; consistency: AHPConsistency } {
  const weightedSumVector: number[] = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * weightsArr[j];
    }
    weightedSumVector[i] = sum;
  }

  const consistencyVector: number[] = [];
  for (let i = 0; i < n; i++) {
    const c = weightsArr[i] > 0 ? weightedSumVector[i] / weightsArr[i] : n;
    consistencyVector[i] = c;
  }

  const lambdaMax = consistencyVector.reduce((acc, val) => acc + val, 0) / n;
  const ci = n > 1 ? (lambdaMax - n) / (n - 1) : 0;
  const ri = SAATY_RI_TABLE[n] ?? 1.24;
  const cr = n <= 2 || ri === 0 ? 0 : ci / ri;
  const isConsistent = cr <= 0.10;

  const consistency: AHPConsistency = {
    lambdaMax: Number(lambdaMax.toFixed(4)),
    ci: Number(ci.toFixed(4)),
    ri,
    cr: Number(cr.toFixed(4)),
    isConsistent,
    statusMessage: isConsistent
      ? `Nilai CR = ${cr.toFixed(4)} <= 0.10. Matriks perbandingan berpasangan KONSISTEN dan valid untuk pengambilan keputusan.`
      : `Nilai CR = ${cr.toFixed(4)} > 0.10. Matriks TIDAK KONSISTEN. Sebaiknya tinjau kembali nilai perbandingan antar elemen yang saling bertentangan.`,
  };

  return { weightedSumVector, consistencyVector, consistency };
}

/**
 * Calculates full AHP calculation matching Excel standards:
 * Stage 1: Criteria Pairwise Matrix -> Column Sums -> Normalized Matrix -> Criteria Weights Vector W [1x6] -> Lambda Max, CI, CR
 * Stage 2: 6 Alternative Pairwise Matrices (one per criterion) -> Column Sums -> Normalized Matrix -> Local Priority Vectors
 * Stage 3: Matrix A [numAlts x numCriteria] -> Dot product A * W^T -> Final AHP Composite Scores & Ranks
 */
export function calculateAHP(
  pairwiseMatrix: number[][],
  criteria: Criterion[],
  alternatives: Alternative[],
  customAltMatrices?: Record<string, number[][]>
): AHPResult {
  const n = criteria.length;
  const m = alternatives.length;

  if (n === 0 || m === 0) {
    return {
      matrix: [],
      criteriaIds: [],
      columnSums: [],
      normalizedMatrix: [],
      weights: {},
      weightedSumVector: [],
      consistencyVector: [],
      consistency: {
        lambdaMax: 0,
        ci: 0,
        ri: 0,
        cr: 0,
        isConsistent: true,
        statusMessage: 'Kriteria / Alternatif kosong.',
      },
      alternativeMatrices: {},
      alternativeColumnSums: {},
      alternativeNormalizedMatrices: {},
      alternativeLocalPriorities: {},
      combinedAlternativeMatrix: [],
      evaluations: [],
    };
  }

  // ==========================================
  // STAGE 1: CRITERIA PAIRWISE COMPARISON
  // ==========================================
  // 1. Ensure reciprocity for criteria matrix
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else if (i < j) {
        const val = pairwiseMatrix[i] && pairwiseMatrix[i][j] ? pairwiseMatrix[i][j] : 1;
        matrix[i][j] = val;
      } else {
        const upperVal = matrix[j][i] || 1;
        matrix[i][j] = Number((1 / upperVal).toFixed(4));
      }
    }
  }

  // 2. Criteria Column Sums: S_j = sum(a_ij for i=1..n)
  const columnSums: number[] = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += matrix[i][j];
    }
    columnSums[j] = sum;
  }

  // 3. Criteria Normalized Matrix: b_ij = a_ij / S_j
  const normalizedMatrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    normalizedMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      normalizedMatrix[i][j] = columnSums[j] > 0 ? matrix[i][j] / columnSums[j] : 1 / n;
    }
  }

  // 4. Priority Vector (Eigenvector W): w_i = (1/n) * sum(b_ij for j=1..n)
  const weightsArr: number[] = [];
  const weightsMap: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += normalizedMatrix[i][j];
    }
    const w = rowSum / n;
    weightsArr[i] = w;
    weightsMap[criteria[i].id] = Number(w.toFixed(4));
  }

  // 5. Criteria Consistency Verification
  const { weightedSumVector, consistencyVector, consistency } = calculateConsistency(matrix, weightsArr, n);

  // ==========================================
  // STAGE 2: ALTERNATIVE PAIRWISE COMPARISONS PER CRITERION (6 Criteria)
  // ==========================================
  const alternativeMatrices: Record<string, number[][]> = {};
  const alternativeColumnSums: Record<string, number[]> = {};
  const alternativeNormalizedMatrices: Record<string, number[][]> = {};
  const alternativeLocalPriorities: Record<string, number[]> = {};
  const alternativeConsistency: Record<string, AHPConsistency> = {};

  // Combined matrix A [m x n] (rows: alternatives, cols: criteria)
  const combinedAlternativeMatrix: number[][] = Array(m)
    .fill(0)
    .map(() => Array(n).fill(0));

  criteria.forEach((crit, j) => {
    // 1. Get or build alternative 6x6 pairwise matrix for criterion j
    let altMatrix: number[][];
    if (customAltMatrices && customAltMatrices[crit.id] && customAltMatrices[crit.id].length === m) {
      altMatrix = sanitizePairwiseMatrix(customAltMatrices[crit.id], m);
    } else if (DEFAULT_ALTERNATIVE_PAIRWISE_MATRICES[crit.id] && m === 6) {
      altMatrix = sanitizePairwiseMatrix(DEFAULT_ALTERNATIVE_PAIRWISE_MATRICES[crit.id], m);
    } else {
      // Dynamic fallback: compute pairwise ratios from raw scores
      altMatrix = Array(m).fill(0).map(() => Array(m).fill(1));
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < m; c++) {
          if (r === c) {
            altMatrix[r][c] = 1;
          } else {
            const sR = alternatives[r].scores[crit.id] || 1;
            const sC = alternatives[c].scores[crit.id] || 1;
            const ratio = crit.type === 'cost' ? sC / sR : sR / sC;
            altMatrix[r][c] = Number(ratio.toFixed(4));
          }
        }
      }
    }
    alternativeMatrices[crit.id] = altMatrix;

    // 2. Alternative column sums for criterion j
    const altColSums: number[] = Array(m).fill(0);
    for (let c = 0; c < m; c++) {
      let sum = 0;
      for (let r = 0; r < m; r++) {
        sum += altMatrix[r][c];
      }
      altColSums[c] = sum;
    }
    alternativeColumnSums[crit.id] = altColSums;

    // 3. Normalized alternative matrix for criterion j
    const altNormMatrix: number[][] = [];
    for (let r = 0; r < m; r++) {
      altNormMatrix[r] = [];
      for (let c = 0; c < m; c++) {
        altNormMatrix[r][c] = altColSums[c] > 0 ? altMatrix[r][c] / altColSums[c] : 1 / m;
      }
    }
    alternativeNormalizedMatrices[crit.id] = altNormMatrix;

    // 4. Local Priority Vector (Eigenvector v_j) for criterion j: row mean
    const localPriority: number[] = [];
    for (let r = 0; r < m; r++) {
      let rowSum = 0;
      for (let c = 0; c < m; c++) {
        rowSum += altNormMatrix[r][c];
      }
      const p = rowSum / m;
      localPriority[r] = p;
      // Populate combined matrix column j
      combinedAlternativeMatrix[r][j] = p;
    }
    alternativeLocalPriorities[crit.id] = localPriority;

    // Consistency check for alternative matrix
    const { consistency: altCons } = calculateConsistency(altMatrix, localPriority, m);
    alternativeConsistency[crit.id] = altCons;
  });

  // ==========================================
  // STAGE 3: REKAPITULASI COMPOSITE SCORE (A * W^T)
  // ==========================================
  const rawEvaluations = alternatives.map((alt, i) => {
    let finalScore = 0;
    for (let j = 0; j < n; j++) {
      finalScore += combinedAlternativeMatrix[i][j] * weightsArr[j];
    }
    return {
      alternativeId: alt.id,
      code: alt.code,
      name: alt.name,
      location: alt.location,
      finalScore: Number(finalScore.toFixed(4)),
    };
  });

  // Sort descending by finalScore to assign ranks
  const sortedEvaluations = [...rawEvaluations].sort((a, b) => b.finalScore - a.finalScore);
  const evaluations = rawEvaluations.map((item) => {
    const rank = sortedEvaluations.findIndex((s) => s.alternativeId === item.alternativeId) + 1;
    return {
      ...item,
      rank,
    };
  });

  return {
    matrix,
    criteriaIds: criteria.map((c) => c.id),
    columnSums,
    normalizedMatrix,
    weights: weightsMap,
    weightedSumVector,
    consistencyVector,
    consistency,
    alternativeMatrices,
    alternativeColumnSums,
    alternativeNormalizedMatrices,
    alternativeLocalPriorities,
    alternativeConsistency,
    combinedAlternativeMatrix,
    evaluations,
  };
}

/**
 * Helper to update a pairwise comparison cell at (i, j) with value,
 * and automatically sets cell (j, i) to 1 / value.
 */
export function updatePairwiseCell(
  currentMatrix: number[][],
  i: number,
  j: number,
  value: number
): number[][] {
  const newMatrix = currentMatrix.map((row) => [...row]);
  newMatrix[i][j] = value;
  newMatrix[j][i] = Number((1 / value).toFixed(4));
  return newMatrix;
}

/**
 * Helper to update an alternative pairwise comparison cell for a specific criterion.
 */
export function updateAlternativePairwiseCell(
  currentAltMatrices: Record<string, number[][]>,
  critId: string,
  i: number,
  j: number,
  value: number
): Record<string, number[][]> {
  const current = currentAltMatrices[critId] || DEFAULT_ALTERNATIVE_PAIRWISE_MATRICES[critId];
  if (!current) return currentAltMatrices;

  const updatedMatrix = updatePairwiseCell(current, i, j, value);
  return {
    ...currentAltMatrices,
    [critId]: updatedMatrix,
  };
}
