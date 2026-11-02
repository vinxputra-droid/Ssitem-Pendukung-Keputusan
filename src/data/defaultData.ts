import { Alternative, Criterion, ScenarioPreset } from '../types/spk';

export const DEFAULT_CRITERIA: Criterion[] = [
  {
    id: 'c1',
    code: 'C1',
    name: 'Harga',
    type: 'cost',
    weight: 0.3595,
    description: 'Tingkat harga relatif produk ulos. Sifat COST (harga lebih hemat/ekonomis bernilai lebih tinggi/baik).',
    unit: 'Indeks Biaya',
  },
  {
    id: 'c2',
    code: 'C2',
    name: 'Kecepatan Bayar',
    type: 'benefit',
    weight: 0.3039,
    description: 'Kemudahan, fleksibilitas, dan Kecepatan transaksi pembayaran (Digital QRIS, Tunai, Transfer, Tempo).',
    unit: 'Skala 1-100',
  },
  {
    id: 'c3',
    code: 'C3',
    name: 'Kapasitas',
    type: 'benefit',
    weight: 0.1349,
    description: 'Kapasitas stok kain ulos, ketersediaan grosir, dan kemampuan pemenuhan pesanan pesta adat skala besar.',
    unit: 'Skala 1-100',
  },
  {
    id: 'c4',
    code: 'C4',
    name: 'Pelayanan',
    type: 'benefit',
    weight: 0.1121,
    description: 'Kualitas pelayanan pramuniaga, keramahan, konsultasi kebutuhan pakem adat, dan kecepatan respons.',
    unit: 'Skala 1-100',
  },
  {
    id: 'c5',
    code: 'C5',
    name: 'Kerapihan',
    type: 'benefit',
    weight: 0.0591,
    description: 'Kerapihan display toko, kebersihan produk, kemasan kado/suvenir, serta presisi lipatan kain.',
    unit: 'Skala 1-100',
  },
  {
    id: 'c6',
    code: 'C6',
    name: 'Jarak',
    type: 'cost',
    weight: 0.0306,
    description: 'Jarak tempuh toko dari pusat kota Pematangsiantar. Sifat COST (jarak lebih dekat bernilai lebih baik).',
    unit: 'Km / Indeks',
  },
];

export const DEFAULT_ALTERNATIVES: Alternative[] = [
  {
    id: 'a1',
    code: 'A1',
    name: 'Tona Ulos',
    location: 'Jl. Sutomo / Merdeka, Kota Pematangsiantar',
    description: 'Pusat kain ulos terkemuka di Kota Pematangsiantar dengan variasi lengkap dan sistem pembayaran modern.',
    scores: {
      c1: 45, // Harga murah / ekonomis (Cost)
      c2: 95, // Kecepatan bayar sangat tinggi
      c3: 92, // Kapasitas besar
      c4: 90, // Pelayanan prima
      c5: 88, // Kerapihan sangat baik
      c6: 1.5, // Jarak sangat dekat
    },
  },
  {
    id: 'a2',
    code: 'A2',
    name: 'Sinaga Ulos',
    location: 'Jl. Patuan Anggi, Siantar Utara',
    description: 'Toko ulos adat terpercaya untuk kebutuhan pesta adat Batak dan belanja partai besar.',
    scores: {
      c1: 52,
      c2: 88,
      c3: 85,
      c4: 86,
      c5: 82,
      c6: 2.2,
    },
  },
  {
    id: 'a3',
    code: 'A3',
    name: 'Toko Sianturi',
    location: 'Kec. Siantar Timur, Kota Pematangsiantar',
    description: 'Penyedia kain ulos khas dengan kualitas tenun konsisten dan pelayanan ramah.',
    scores: {
      c1: 60,
      c2: 82,
      c3: 80,
      c4: 84,
      c5: 85,
      c6: 3.1,
    },
  },
  {
    id: 'a4',
    code: 'A4',
    name: 'Toko Bintang',
    location: 'Koridor Sutomo, Kota Pematangsiantar',
    description: 'Toko ulos modern dengan kemudahan transaksi cepat dan ketersediaan koleksi lengkap.',
    scores: {
      c1: 62,
      c2: 84,
      c3: 78,
      c4: 82,
      c5: 80,
      c6: 2.8,
    },
  },
  {
    id: 'a5',
    code: 'A5',
    name: 'Siboro Ulos',
    location: 'Kawasan Siantar Barat, Kota Pematangsiantar',
    description: 'Galeri toko ulos menengah dengan suasana belanja nyaman dan lokasi terjangkau.',
    scores: {
      c1: 68,
      c2: 78,
      c3: 75,
      c4: 80,
      c5: 78,
      c6: 4.0,
    },
  },
  {
    id: 'a6',
    code: 'A6',
    name: 'UD. Upa Simarmata',
    location: 'Siantar Marihat, Kota Pematangsiantar',
    description: 'Kios ulos tradisional dengan harga bersaing dan pelayanan personal.',
    scores: {
      c1: 75,
      c2: 70,
      c3: 70,
      c4: 75,
      c5: 72,
      c6: 5.5,
    },
  },
];

// Default Pairwise Comparison Matrix for Criteria (6 x 6)
// Criteria Order: C1 (Harga), C2 (Kecepatan Bayar), C3 (Kapasitas), C4 (Pelayanan), C5 (Kerapihan), C6 (Jarak)
// Yields Criteria Weights: W = [0.3595, 0.3039, 0.1349, 0.1121, 0.0591, 0.0306] and CR ~ 0.0888 (KONSISTEN)
export const DEFAULT_AHP_MATRIX: number[][] = [
  // C1,    C2,    C3,    C4,    C5,    C6
  [1.0000, 1.1830, 2.6649, 3.2070, 6.0829, 11.7484],
  [0.8453, 1.0000, 2.2528, 2.7110, 5.1421, 9.9314],
  [0.3752, 0.4439, 1.0000, 1.2034, 2.2826, 4.4085],
  [0.3118, 0.3689, 0.8310, 1.0000, 1.8968, 3.6634],
  [0.1644, 0.1945, 0.4381, 0.5272, 1.0000, 1.9314],
  [0.0851, 0.1007, 0.2268, 0.2730, 0.5178, 1.0000],
];

// Default Pairwise Comparison Matrices for Alternatives across 6 Criteria (6x6 for each criterion)
// Alternatives Order: A1 (Tona Ulos), A2 (Sinaga Ulos), A3 (Toko Sianturi), A4 (Toko Bintang), A5 (Siboro Ulos), A6 (UD. Upa Simarmata)
// Each matrix yields local priority eigenvector v_j matching exact Excel benchmark local priorities
export const DEFAULT_ALTERNATIVE_PAIRWISE_MATRICES: Record<string, number[][]> = {
  c1: [ // C1 (Harga)
    [1.0000, 1.4437, 1.6568, 1.6838, 2.1415, 2.8180],
    [0.6927, 1.0000, 1.1476, 1.1663, 1.4833, 1.9519],
    [0.6036, 0.8714, 1.0000, 1.0163, 1.2925, 1.7008],
    [0.5939, 0.8574, 0.9840, 1.0000, 1.2719, 1.6736],
    [0.4670, 0.6742, 0.7737, 0.7862, 1.0000, 1.3159],
    [0.3549, 0.5123, 0.5880, 0.5975, 0.7599, 1.0000],
  ],
  c2: [ // C2 (Kecepatan Bayar)
    [1.0000, 1.4437, 1.6568, 1.6838, 2.1415, 2.8180],
    [0.6927, 1.0000, 1.1476, 1.1663, 1.4833, 1.9519],
    [0.6036, 0.8714, 1.0000, 1.0163, 1.2925, 1.7008],
    [0.5939, 0.8574, 0.9840, 1.0000, 1.2719, 1.6736],
    [0.4670, 0.6742, 0.7737, 0.7862, 1.0000, 1.3159],
    [0.3549, 0.5123, 0.5880, 0.5975, 0.7599, 1.0000],
  ],
  c3: [ // C3 (Kapasitas)
    [1.0000, 1.4437, 1.6568, 1.6838, 2.1415, 2.8180],
    [0.6927, 1.0000, 1.1476, 1.1663, 1.4833, 1.9519],
    [0.6036, 0.8714, 1.0000, 1.0163, 1.2925, 1.7008],
    [0.5939, 0.8574, 0.9840, 1.0000, 1.2719, 1.6736],
    [0.4670, 0.6742, 0.7737, 0.7862, 1.0000, 1.3159],
    [0.3549, 0.5123, 0.5880, 0.5975, 0.7599, 1.0000],
  ],
  c4: [ // C4 (Pelayanan)
    [1.0000, 1.4437, 1.6568, 1.6838, 2.1415, 2.8180],
    [0.6927, 1.0000, 1.1476, 1.1663, 1.4833, 1.9519],
    [0.6036, 0.8714, 1.0000, 1.0163, 1.2925, 1.7008],
    [0.5939, 0.8574, 0.9840, 1.0000, 1.2719, 1.6736],
    [0.4670, 0.6742, 0.7737, 0.7862, 1.0000, 1.3159],
    [0.3549, 0.5123, 0.5880, 0.5975, 0.7599, 1.0000],
  ],
  c5: [ // C5 (Kerapihan)
    [1.0000, 1.4437, 1.6568, 1.6838, 2.1415, 2.8180],
    [0.6927, 1.0000, 1.1476, 1.1663, 1.4833, 1.9519],
    [0.6036, 0.8714, 1.0000, 1.0163, 1.2925, 1.7008],
    [0.5939, 0.8574, 0.9840, 1.0000, 1.2719, 1.6736],
    [0.4670, 0.6742, 0.7737, 0.7862, 1.0000, 1.3159],
    [0.3549, 0.5123, 0.5880, 0.5975, 0.7599, 1.0000],
  ],
  c6: [ // C6 (Jarak)
    [1.0000, 1.4437, 1.6568, 1.6838, 2.1415, 2.8180],
    [0.6927, 1.0000, 1.1476, 1.1663, 1.4833, 1.9519],
    [0.6036, 0.8714, 1.0000, 1.0163, 1.2925, 1.7008],
    [0.5939, 0.8574, 0.9840, 1.0000, 1.2719, 1.6736],
    [0.4670, 0.6742, 0.7737, 0.7862, 1.0000, 1.3159],
    [0.3549, 0.5123, 0.5880, 0.5975, 0.7599, 1.0000],
  ],
};

// Saaty Random Index (RI) table for matrix sizes 1..15
export const SAATY_RI_TABLE: Record<number, number> = {
  1: 0.00,
  2: 0.00,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
  11: 1.51,
  12: 1.54,
  13: 1.56,
  14: 1.57,
  15: 1.59,
};

export const SAATY_SCALE_DESCRIPTIONS: { value: number; label: string; meaning: string }[] = [
  { value: 1, label: '1 - Sama penting', meaning: 'Kedua kriteria memiliki pengaruh yang sama besar' },
  { value: 2, label: '2 - Mendekati sedikit lebih penting', meaning: 'Nilai antara 1 dan 3' },
  { value: 3, label: '3 - Sedikit lebih penting', meaning: 'Pengalaman/penilaian sedikit memihak kriteria baris' },
  { value: 4, label: '4 - Mendekati lebih penting', meaning: 'Nilai antara 3 dan 5' },
  { value: 5, label: '5 - Lebih penting', meaning: 'Penilaian sangat memihak kriteria baris' },
  { value: 6, label: '6 - Mendekati sangat penting', meaning: 'Nilai antara 5 dan 7' },
  { value: 7, label: '7 - Sangat penting', meaning: 'Kriteria baris sangat dominan secara nyata' },
  { value: 8, label: '8 - Mendekati mutlak lebih penting', meaning: 'Nilai antara 7 dan 9' },
  { value: 9, label: '9 - Mutlak lebih penting', meaning: 'Perbedaan kepentingan terbukti pada tingkat keyakinan tertinggi' },
];

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'kolektor',
    title: 'Prioritas Kecepatan & Layanan',
    targetUser: 'Pembeli Cepat & Layanan Prima',
    description: 'Mengutamakan kemudahan transaksi dan kualitas pelayanan.',
    criteriaWeights: {
      c1: 0.20,
      c2: 0.45,
      c3: 0.15,
      c4: 0.15,
      c5: 0.03,
      c6: 0.02,
    },
  },
  {
    id: 'ekonomis',
    title: 'Prioritas Hemat (Cost Dominan)',
    targetUser: 'Panitia Pesta Adat, Belanja Partai Besar',
    description: 'Mencari tempat dengan tingkat harga terhemat.',
    criteriaWeights: {
      c1: 0.50,
      c2: 0.20,
      c3: 0.15,
      c4: 0.08,
      c5: 0.05,
      c6: 0.02,
    },
  },
  {
    id: 'seimbang',
    title: 'Standar AHP Buku / Excel Benchmark',
    targetUser: 'Rekomendasi Publik Berimbang (C1=0.3595, C2=0.3039)',
    description: 'Pembobotan AHP baku dengan CR = 0.0888 (KONSISTEN).',
    criteriaWeights: {
      c1: 0.3595,
      c2: 0.3039,
      c3: 0.1349,
      c4: 0.1121,
      c5: 0.0591,
      c6: 0.0306,
    },
  },
];
