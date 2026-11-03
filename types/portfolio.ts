export type SeasonId = 'summer' | 'monsoon' | 'autumn' | 'spring';

export interface SeasonInfo {
  id: SeasonId;
  name: string;
  theme: string;
  era: string;
  ambientColor: string;
  accentColor: string;
  description: string;
}

export interface MetricHighlight {
  label: string;
  value: string;
  detail: string;
}

export interface NarrativeSectionData {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  organization: string;
  seasonId: SeasonId;
  seasonName: string;
  period: string;
  role: string;
  location: string;
  summary: string;
  highlights: string[];
  metrics: MetricHighlight[];
  technologies: string[];
  keyArtifact: string;
  bridgeText: string;
  quickSummary?: string;
}

export interface BentoSkillItem {
  category: string;
  items: string[];
  level: string;
}
