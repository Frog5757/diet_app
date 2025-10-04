// 運動データベース：MET（Metabolic Equivalent）値を使用
// METs * 体重(kg) * 時間(h) = 消費カロリー(kcal)

export interface ExerciseType {
  id: string;
  name: string;
  category: string;
  unit: 'reps' | 'minutes' | 'distance'; // 回数 | 時間 | 距離
  unitLabel: string;
  met: number; // METs値
  caloriesPerUnit?: number; // 単位あたりの基準消費カロリー（体重60kg基準）
  description?: string;
}

export const exerciseDatabase: ExerciseType[] = [
  // 筋トレ系（回数ベース）
  {
    id: 'push_ups',
    name: 'プッシュアップ（腕立て伏せ）',
    category: 'strength',
    unit: 'reps',
    unitLabel: '回',
    met: 3.8,
    caloriesPerUnit: 0.5, // 1回あたり約0.5kcal（体重60kg基準）
    description: '標準的なプッシュアップ'
  },
  {
    id: 'squats',
    name: 'スクワット',
    category: 'strength',
    unit: 'reps',
    unitLabel: '回',
    met: 5.0,
    caloriesPerUnit: 0.5,
    description: '標準的なスクワット'
  },
  {
    id: 'plank',
    name: 'プランク',
    category: 'strength',
    unit: 'minutes',
    unitLabel: '分',
    met: 4.0,
    description: 'プランク姿勢をキープ'
  },
  {
    id: 'burpees',
    name: 'バーピー',
    category: 'strength',
    unit: 'reps',
    unitLabel: '回',
    met: 8.0,
    caloriesPerUnit: 1.2,
    description: '全身運動のバーピー'
  },
  {
    id: 'pull_ups',
    name: 'プルアップ（懸垂）',
    category: 'strength',
    unit: 'reps',
    unitLabel: '回',
    met: 4.2,
    caloriesPerUnit: 1.0,
    description: '懸垂'
  },

  // 有酸素運動（時間ベース）
  {
    id: 'jogging',
    name: 'ジョギング',
    category: 'cardio',
    unit: 'minutes',
    unitLabel: '分',
    met: 7.0,
    description: '軽いジョギング（時速8km程度）'
  },
  {
    id: 'walking',
    name: 'ウォーキング',
    category: 'cardio',
    unit: 'minutes',
    unitLabel: '分',
    met: 3.5,
    description: '普通の速度でのウォーキング'
  },
  {
    id: 'cycling',
    name: 'サイクリング',
    category: 'cardio',
    unit: 'minutes',
    unitLabel: '分',
    met: 8.0,
    description: '中程度の速度でのサイクリング'
  },
  {
    id: 'swimming',
    name: '水泳',
    category: 'cardio',
    unit: 'minutes',
    unitLabel: '分',
    met: 8.0,
    description: '自由形で泳ぐ'
  },

  // 距離ベース運動
  {
    id: 'running_distance',
    name: 'ランニング（距離）',
    category: 'cardio',
    unit: 'distance',
    unitLabel: 'km',
    met: 9.8, // 時速10km程度
    description: 'ランニング（距離指定）'
  },
  {
    id: 'walking_distance',
    name: 'ウォーキング（距離）',
    category: 'cardio',
    unit: 'distance',
    unitLabel: 'km',
    met: 3.5,
    description: 'ウォーキング（距離指定）'
  }
];

// 消費カロリー計算関数
export function calculateCalories(exercise: ExerciseType, amount: number, userWeight: number): number {
  switch (exercise.unit) {
    case 'reps':
      // 回数ベース：基準値 × (ユーザー体重/60kg) × 回数
      if (exercise.caloriesPerUnit) {
        return Math.round(exercise.caloriesPerUnit * (userWeight / 60) * amount);
      }
      // fallback: METs計算（1回1分と仮定）
      return Math.round(exercise.met * userWeight * (amount / 60));

    case 'minutes':
      // 時間ベース：METs × 体重 × 時間（時）
      return Math.round(exercise.met * userWeight * (amount / 60));

    case 'distance':
      // 距離ベース：距離から時間を推定してMETs計算
      // ランニング: 10km/h, ウォーキング: 4km/h と仮定
      const speed = exercise.id.includes('running') ? 10 : 4;
      const timeInHours = amount / speed;
      return Math.round(exercise.met * userWeight * timeInHours);

    default:
      return 0;
  }
}

// カテゴリー別に運動を取得
export function getExercisesByCategory(category: string): ExerciseType[] {
  return exerciseDatabase.filter(exercise => exercise.category === category);
}

// 運動IDから運動情報を取得
export function getExerciseById(id: string): ExerciseType | undefined {
  return exerciseDatabase.find(exercise => exercise.id === id);
}