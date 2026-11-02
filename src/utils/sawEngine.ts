import { Alternative, Criterion, SAWResult, SAWEvaluation } from '../types/spk';

/**
 * Calculates Simple Additive Weighting (SAW) method:
 * 1. Finds min and max values per criterion.
 * 2. Normalizes matrix:
 *    - Benefit: r_ij = x_ij / max(x_j)
 *    - Cost: r_ij = min(x_j) / x_ij
 * 3. Normalizes user weights so sum(w) = 1.
 * 4. Calculates preference value: V_i = sum(w_j * r_ij).
 * 5. Assigns ranks.
 */
export function calculateSAW(
  alternatives: Alternative[],
  criteria: Criterion[],
  customWeights?: Record<string, number>
): SAWResult {
  if (alternatives.length === 0 || criteria.length === 0) {
    return {
      evaluations: [],
      minMaxPerCriterion: {},
      normalizedWeights: {},
    };
  }

  // 1. Calculate Min and Max for each criterion across all alternatives
  const minMaxPerCriterion: Record<string, { min: number; max: number }> = {};
  for (const crit of criteria) {
    const values = alternatives.map((alt) => alt.scores[crit.id] ?? 0);
    const minVal = values.length > 0 ? Math.min(...values) : 0;
    const maxVal = values.length > 0 ? Math.max(...values) : 1;
    minMaxPerCriterion[crit.id] = {
      min: minVal <= 0 ? 0.0001 : minVal, // avoid division by zero
      max: maxVal <= 0 ? 1 : maxVal,
    };
  }

  // 2. Normalize weights
  const rawWeights: Record<string, number> = {};
  let totalWeight = 0;
  for (const crit of criteria) {
    const w = customWeights && customWeights[crit.id] !== undefined
      ? Number(customWeights[crit.id])
      : Number(crit.weight);
    const validW = isNaN(w) || w < 0 ? 0 : w;
    rawWeights[crit.id] = validW;
    totalWeight += validW;
  }

  const normalizedWeights: Record<string, number> = {};
  for (const crit of criteria) {
    normalizedWeights[crit.id] = totalWeight > 0 ? rawWeights[crit.id] / totalWeight : 1 / criteria.length;
  }

  // 3. Normalization and Preference Value (V_i)
  const evaluations: SAWEvaluation[] = alternatives.map((alt) => {
    const rawScores: Record<string, number> = {};
    const normalizedScores: Record<string, number> = {};
    let finalScore = 0;

    for (const crit of criteria) {
      const x_ij = alt.scores[crit.id] ?? 0;
      rawScores[crit.id] = x_ij;
      const { min, max } = minMaxPerCriterion[crit.id];

      let r_ij = 0;
      if (crit.type === 'benefit') {
        // Benefit: x_ij / max(x_j)
        r_ij = max > 0 ? x_ij / max : 0;
      } else {
        // Cost: min(x_j) / x_ij
        const safeX = x_ij <= 0 ? 0.0001 : x_ij;
        r_ij = min / safeX;
      }

      // Bound r_ij between 0 and 1
      r_ij = Math.max(0, Math.min(1, r_ij));
      normalizedScores[crit.id] = r_ij;

      // V_i = sum(w_j * r_ij)
      finalScore += (normalizedWeights[crit.id] ?? 0) * r_ij;
    }

    return {
      alternativeId: alt.id,
      code: alt.code,
      name: alt.name,
      location: alt.location,
      rawScores,
      normalizedScores,
      finalScore: Number(finalScore.toFixed(4)),
      rank: 0,
    };
  });

  // 4. Sort and assign ranks
  evaluations.sort((a, b) => b.finalScore - a.finalScore);
  evaluations.forEach((evalItem, index) => {
    evalItem.rank = index + 1;
  });

  return {
    evaluations,
    minMaxPerCriterion,
    normalizedWeights,
  };
}
