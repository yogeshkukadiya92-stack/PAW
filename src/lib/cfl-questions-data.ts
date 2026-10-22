import canonicalQuestions from '../../shared/questions.json';
// Official Coach For Life - PAW Personality Profile Analysis Questionnaire
// 40 Questions (1-20: Strengths, 21-40: Weaknesses)
// Florence Littauer's 4 Temperaments: Sanguine, Choleric, Melancholy, Phlegmatic

export type TemperamentType = 'Sanguine' | 'Choleric' | 'Melancholy' | 'Phlegmatic';

export interface PAWQuestionOption {
  value: string;
  word: string;
  description: string;
  temperament: TemperamentType;
}

export interface PAWQuestion {
  questionNumber: number;
  type: 'Strengths' | 'Weaknesses';
  options: PAWQuestionOption[];
}

export interface TemperamentProfileInfo {
  name: string;
  archetype: string;
  badge: string;
  color: string;
  bgLight: string;
  borderColor: string;
  tagColor: string;
  summary: string;
  emotionalNeeds: string[];
  keyStrengths: string[];
  growthAreas: string[];
}

export const TEMPERAMENT_PROFILES: Record<TemperamentType, TemperamentProfileInfo> = {
  Sanguine: {
    name: 'Popular Sanguine',
    archetype: 'The Enthusiastic Motivator & Networker',
    badge: 'Popular Sanguine',
    color: 'text-amber-700',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    tagColor: 'bg-amber-100 text-amber-800',
    summary: 'Warm, vibrant, optimistic, and highly charismatic. You bring enthusiasm, energy, and inspiration to any environment, forging genuine human connections effortlessly.',
    emotionalNeeds: ['Attention & Appreciation', 'Affection & Warmth', 'Approval & Acceptance', 'Activity & Excitement'],
    keyStrengths: [
      'Natural storyteller and expressive communicator',
      'Turns any routine into a fun, energizing experience',
      'Quickly recovers from discouragement and stays optimistic',
      'Warm-hearted, generous, and easily establishes trust'
    ],
    growthAreas: [
      'Developing structured follow-through on open tasks',
      'Cultivating deeper active listening before replying',
      'Managing time commitments and punctuality',
      'Balancing high enthusiasm with consistent execution'
    ]
  },
  Choleric: {
    name: 'Powerful Choleric',
    archetype: 'The Strategic Visionary & Execution Leader',
    badge: 'Powerful Choleric',
    color: 'text-rose-700',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-200',
    tagColor: 'bg-rose-100 text-rose-800',
    summary: 'Decisive, goal-oriented, assertive, and driven by tangible outcomes. You naturally command leadership, solve complex bottlenecks under pressure, and achieve high milestones.',
    emotionalNeeds: ['Loyalty & Respect', 'Sense of Control & Autonomy', 'Appreciation for Achievements', 'Clear Vision & Action'],
    keyStrengths: [
      'Bold, fearless decision-maker in times of crisis',
      'Relentless focus on productivity, goals, and measurable results',
      'Excels at organizing teams, delegating, and optimizing systems',
      'Independent thinker with self-motivated internal drive'
    ],
    growthAreas: [
      'Practicing patience and empathy with varying pacing of peers',
      'Actively acknowledging and validating others\' contributions',
      'Listening to constructive feedback without defensiveness',
      'Avoiding burnout by allowing scheduled recovery periods'
    ]
  },
  Melancholy: {
    name: 'Perfect Melancholy',
    archetype: 'The Precision Analyst & Quality Architect',
    badge: 'Perfect Melancholy',
    color: 'text-blue-700',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    tagColor: 'bg-blue-100 text-blue-800',
    summary: 'Analytical, conscientious, detail-oriented, and devoted to excellence. You possess deep analytical depth, impeccable standards, and an innate instinct for systemic accuracy.',
    emotionalNeeds: ['Order & Structure', 'Sensitivity & Understanding', 'Space & Quiet for Reflection', 'Appreciation for Thoroughness'],
    keyStrengths: [
      'Unmatched attention to quality, accuracy, and thorough planning',
      'Deep intellectual and creative depth with long-term vision',
      'Deeply loyal, dependable, and finishes whatever is started',
      'Mastery at detecting hidden flaws and designing preventative solutions'
    ],
    growthAreas: [
      'Guarding against analysis paralysis and over-deliberation',
      'Letting go of impossible perfectionism standards for self and team',
      'Focusing on progress over absolute perfection',
      'Communicating thoughts early before feeling misunderstood'
    ]
  },
  Phlegmatic: {
    name: 'Peaceful Phlegmatic',
    archetype: 'The Diplomatic Anchor & Harmonious Mediator',
    badge: 'Peaceful Phlegmatic',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    tagColor: 'bg-emerald-100 text-emerald-800',
    summary: 'Calm, steady, diplomatic, and unshakeable under pressure. You serve as the peaceful anchor in any team, harmonizing disputes, building consensus, and providing dependable support.',
    emotionalNeeds: ['Peace & Quiet', 'Feeling Valued & Safe', 'Respect & Acceptance', 'Freedom from Intense Conflict'],
    keyStrengths: [
      'Extraordinary calm, patience, and emotional balance',
      'Empathetic, non-judgmental active listener and natural mediator',
      'Highly adaptable to changing circumstances without panic',
      'Consistent, trustworthy, and supportive collaborator'
    ],
    growthAreas: [
      'Taking proactive initiative without waiting for external pushes',
      'Assertively expressing personal desires, boundaries, and opinions',
      'Overcoming resistance to immediate decision-making',
      'Embracing constructive conflict as an avenue for growth'
    ]
  }
};

export const CFL_PAW_QUESTIONS: PAWQuestion[] = canonicalQuestions as PAWQuestion[];
