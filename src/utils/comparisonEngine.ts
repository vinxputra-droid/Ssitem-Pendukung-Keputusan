import { ComparisonItem, SAWResult, AHPResult, Alternative, Criterion } from '../types/spk';

export interface ComparisonInsight {
  bestAlternative: {
    name: string;
    code: string;
    location: string;
    sawRank: number;
    ahpRank: number;
    agreement: boolean;
  };
  consensusRate: number; // percentage of same ranking
  rankMovers: {
    alternativeName: string;
    code: string;
    fromSaw: number;
    toAhp: number;
    direction: 'up' | 'down' | 'same';
    explanation: string;
  }[];
  weightComparison: {
    criterionId: string;
    criterionCode: string;
    criterionName: string;
    sawWeight: number;
    ahpWeight: number;
    diff: number;
  }[];
  executiveRecommendation: string;
}

export function generateComparison(
  alternatives: Alternative[],
  sawResult: SAWResult,
  ahpResult: AHPResult,
  criteria: Criterion[]
): {
  items: ComparisonItem[];
  insight: ComparisonInsight;
} {
  const sawMap = new Map(sawResult.evaluations.map((e) => [e.alternativeId, e]));
  const ahpMap = new Map(ahpResult.evaluations.map((e) => [e.alternativeId, e]));

  const items: ComparisonItem[] = alternatives.map((alt) => {
    const s = sawMap.get(alt.id);
    const a = ahpMap.get(alt.id);

    const sawScore = s ? s.finalScore : 0;
    const sawRank = s ? s.rank : 99;
    const ahpScore = a ? a.finalScore : 0;
    const ahpRank = a ? a.rank : 99;

    return {
      alternativeId: alt.id,
      code: alt.code,
      name: alt.name,
      location: alt.location,
      sawScore,
      sawRank,
      ahpScore,
      ahpRank,
      rankDiff: sawRank - ahpRank, // > 0 means ranked higher in AHP
      isBestInBoth: sawRank === 1 && ahpRank === 1,
    };
  });

  // Sort items primarily by AHP rank, then SAW rank
  items.sort((a, b) => a.ahpRank - b.ahpRank);

  // Top 1 from each
  const topSaw = sawResult.evaluations[0];
  const topAhp = ahpResult.evaluations[0];

  const agreement = topSaw && topAhp && topSaw.alternativeId === topAhp.alternativeId;
  const bestAlt = topAhp
    ? {
        name: topAhp.name,
        code: topAhp.code,
        location: topAhp.location,
        sawRank: topSaw?.alternativeId === topAhp.alternativeId ? 1 : (sawMap.get(topAhp.alternativeId)?.rank ?? 0),
        ahpRank: 1,
        agreement: Boolean(agreement),
      }
    : {
        name: '-',
        code: '-',
        location: '-',
        sawRank: 0,
        ahpRank: 0,
        agreement: false,
      };

  let sameRankCount = 0;
  items.forEach((item) => {
    if (item.sawRank === item.ahpRank) sameRankCount++;
  });
  const consensusRate = items.length > 0 ? (sameRankCount / items.length) * 100 : 0;

  // Rank movers
  const rankMovers = items
    .filter((item) => item.sawRank !== item.ahpRank)
    .map((item) => {
      const direction: 'up' | 'down' | 'same' =
        item.ahpRank < item.sawRank ? 'up' : item.ahpRank > item.sawRank ? 'down' : 'same';
      
      let explanation = '';
      if (direction === 'up') {
        explanation = `Naik ${Math.abs(item.sawRank - item.ahpRank)} peringkat di AHP karena memiliki keunggulan pada kriteria yang diberi bobot lebih tinggi oleh matriks Saaty.`;
      } else {
        explanation = `Turun ${Math.abs(item.sawRank - item.ahpRank)} peringkat di AHP karena kriteria pendukung terbesarnya memiliki bobot lebih rendah dalam matriks perbandingan berpasangan.`;
      }

      return {
        alternativeName: item.name,
        code: item.code,
        fromSaw: item.sawRank,
        toAhp: item.ahpRank,
        direction,
        explanation,
      };
    });

  // Criteria Weight comparison
  const weightComparison = criteria.map((crit) => {
    const sawW = sawResult.normalizedWeights[crit.id] ?? 0;
    const ahpW = ahpResult.weights[crit.id] ?? 0;
    return {
      criterionId: crit.id,
      criterionCode: crit.code,
      criterionName: crit.name,
      sawWeight: Number(sawW.toFixed(4)),
      ahpWeight: Number(ahpW.toFixed(4)),
      diff: Number((ahpW - sawW).toFixed(4)),
    };
  });

  // Executive summary
  let executiveRecommendation = '';
  if (agreement && topAhp) {
    executiveRecommendation = `Kedua metode (SAW & AHP) bermufakat mutlak memilih "${topAhp.name}" (${topAhp.location}) sebagai rekomendasi peringkat pertama dengan skor SAW ${topSaw.finalScore.toFixed(4)} dan AHP ${topAhp.finalScore.toFixed(4)}. Rekomendasi ini memiliki tingkat objektivitas dan stabilitas matematis yang sangat kokoh.`;
  } else if (topAhp && topSaw) {
    executiveRecommendation = `Terdapat variasi preferensi: Metode SAW memprioritaskan "${topSaw.name}" (Skor ${topSaw.finalScore.toFixed(4)}), sedangkan AHP memprioritaskan "${topAhp.name}" (Skor ${topAhp.finalScore.toFixed(4)}). Perbedaan ini disebabkan oleh pembobotan kriteria teruji Saaty yang lebih menonjolkan kriteria inti dibanding estimasi linear SAW. Disarankan memilih "${topAhp.name}" jika mengedepankan presisi multi-kriteria berbasis hirarki.`;
  } else {
    executiveRecommendation = 'Belum ada data alternatif yang dievaluasi.';
  }

  return {
    items,
    insight: {
      bestAlternative: bestAlt,
      consensusRate: Math.round(consensusRate),
      rankMovers,
      weightComparison,
      executiveRecommendation,
    },
  };
}
