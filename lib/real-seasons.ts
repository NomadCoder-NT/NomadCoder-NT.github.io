export type RealSeasonId = 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter';

export interface RealSeasonMeta {
  id: RealSeasonId;
  name: string;
  emoji: string;
  months: string;
  description: string;
  ambientColor: string;
  accentColor: string;
}

export const REAL_SEASONS: Record<RealSeasonId, RealSeasonMeta> = {
  spring: {
    id: 'spring',
    name: 'Spring (Vasanta)',
    emoji: '🌸',
    months: 'March – April',
    description: 'Budding life, fresh blossoms, emerald foliage, and renewal.',
    ambientColor: '#10b981',
    accentColor: '#34d399',
  },
  summer: {
    id: 'summer',
    name: 'Summer (Grishma)',
    emoji: '☀️',
    months: 'May – June',
    description: 'High heat, thermal haze, shimmering dust particles, and golden sunbeams.',
    ambientColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
  monsoon: {
    id: 'monsoon',
    name: 'Monsoon (Varsha)',
    emoji: '🌧️',
    months: 'July – August',
    description: 'Dynamic torrential rainfall, ground ripple meshes, and deep storm blues.',
    ambientColor: '#0284c7',
    accentColor: '#38bdf8',
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn (Sharad)',
    emoji: '🍂',
    months: 'September – October',
    description: 'Crisp golden leaves, harvest embers, clear skies, and gentle breezes.',
    ambientColor: '#eab308',
    accentColor: '#facc15',
  },
  winter: {
    id: 'winter',
    name: 'Winter (Shishira)',
    emoji: '❄️',
    months: 'November – February',
    description: 'Crystalline snowflakes, frost lattices, ice-blue aurora mist, and stillness.',
    ambientColor: '#38bdf8',
    accentColor: '#e0f2fe',
  },
};

/**
 * Detects the real-world current season based on calendar month
 */
export function getRealCurrentSeason(date = new Date()): RealSeasonMeta {
  const month = date.getMonth(); // 0 = Jan, 9 = Oct

  // In the South Asian / Subcontinental and temperate seasonal transition:
  if (month >= 2 && month <= 3) {
    // March, April
    return REAL_SEASONS.spring;
  } else if (month >= 4 && month <= 5) {
    // May, June
    return REAL_SEASONS.summer;
  } else if (month >= 6 && month <= 7) {
    // July, August
    return REAL_SEASONS.monsoon;
  } else if (month >= 8 && month <= 9) {
    // September, October
    return REAL_SEASONS.autumn;
  } else {
    // November, December, January, February
    return REAL_SEASONS.winter;
  }
}
