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

export const CFL_PAW_QUESTIONS: PAWQuestion[] = [
  {
    "questionNumber": 1,
    "type": "Strengths",
    "options": [
      {
        "value": "5",
        "word": "Adventurous",
        "description": "One who will take on new and daring enterprises with a determination to master them.",
        "temperament": "Choleric"
      },
      {
        "value": "6",
        "word": "Adaptable",
        "description": "Easily fits and is comfortable in any situation",
        "temperament": "Phlegmatic"
      },
      {
        "value": "7",
        "word": "Animated",
        "description": "Full of life, lively use of hand, arm, and face gestures.",
        "temperament": "Sanguine"
      },
      {
        "value": "8",
        "word": "Analytical",
        "description": "Likes to examine the parts for their logical and proper relationships.",
        "temperament": "Melancholy"
      }
    ]
  },
  {
    "questionNumber": 2,
    "type": "Strengths",
    "options": [
      {
        "value": "9",
        "word": "Persistent",
        "description": "Sees one project through to its completion before starting another.",
        "temperament": "Melancholy"
      },
      {
        "value": "10",
        "word": "Playful",
        "description": "Full of fun and good humor.",
        "temperament": "Sanguine"
      },
      {
        "value": "11",
        "word": "Persuasive",
        "description": "Convinces through logic and fact rather than charm or power.",
        "temperament": "Choleric"
      },
      {
        "value": "12",
        "word": "Peaceful",
        "description": "Seems undisturbed and tranquil and retreats from any form of strife.",
        "temperament": "Phlegmatic"
      }
    ]
  },
  {
    "questionNumber": 3,
    "type": "Strengths",
    "options": [
      {
        "value": "13",
        "word": "Submissive",
        "description": "Easily accepts any other's point of view or desire with little need to assert his own opinion.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "14",
        "word": "Self-sacrificing",
        "description": "Willingly gives up his own personal being for the sake of, or to meet the needs of others.",
        "temperament": "Melancholy"
      },
      {
        "value": "15",
        "word": "Sociable",
        "description": "One who sees being with others as an opportunity to be cute and entertaining rather than as a challenge or business opportunity.",
        "temperament": "Sanguine"
      },
      {
        "value": "16",
        "word": "Strong-willed",
        "description": "One who is determined to have his own way.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 4,
    "type": "Strengths",
    "options": [
      {
        "value": "17",
        "word": "Considerate",
        "description": "Having regard for the needs and feelings of others.",
        "temperament": "Melancholy"
      },
      {
        "value": "18",
        "word": "Controlled",
        "description": "Has emotional feelings but rarely displays them.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "19",
        "word": "Competitive",
        "description": "Turns every situation, happening, or game into a contest and always plays to win!",
        "temperament": "Choleric"
      },
      {
        "value": "20",
        "word": "Convincing",
        "description": "Can win you over to anything through the sheer charm of his personality.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 5,
    "type": "Strengths",
    "options": [
      {
        "value": "21",
        "word": "Refreshing",
        "description": "Renews and stimulates or makes others feel good.",
        "temperament": "Sanguine"
      },
      {
        "value": "22",
        "word": "Respectful",
        "description": "Treats others with deference, honor, and esteem.",
        "temperament": "Melancholy"
      },
      {
        "value": "23",
        "word": "Reserved",
        "description": "Self-restraint in expression of emotion or enthusiasm.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "24",
        "word": "Resourceful",
        "description": "Able to act quickly and effectively in virtually all situations.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 6,
    "type": "Strengths",
    "options": [
      {
        "value": "25",
        "word": "Satisfied",
        "description": "A person who easily accepts any circumstance or situation.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "26",
        "word": "Sensitive",
        "description": "Intensively cares about others, and what happens.",
        "temperament": "Melancholy"
      },
      {
        "value": "27",
        "word": "Self-reliant",
        "description": "An independent person who can fully rely on his own capabilities, judgment, and resources.",
        "temperament": "Choleric"
      },
      {
        "value": "28",
        "word": "Spirited",
        "description": "Full of life and excitement.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 7,
    "type": "Strengths",
    "options": [
      {
        "value": "29",
        "word": "Planner",
        "description": "Prefers to work out a detailed arrangement beforehand for the accomplishment of project or goal, and prefers involvement with the planning stages and the finished product rather than the carrying out of the task.",
        "temperament": "Melancholy"
      },
      {
        "value": "30",
        "word": "Patient",
        "description": "Unmoved by delay, remains calm and tolerant.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "31",
        "word": "Positive",
        "description": "Knows it will turn out right if he's in charge.",
        "temperament": "Choleric"
      },
      {
        "value": "32",
        "word": "Promoter",
        "description": "Urges or compels others to go along, join, or invest through the charm of his own personality.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 8,
    "type": "Strengths",
    "options": [
      {
        "value": "33",
        "word": "Sure",
        "description": "Confident, rarely hesitates or wavers.",
        "temperament": "Choleric"
      },
      {
        "value": "34",
        "word": "Spontaneous",
        "description": "Prefers all of life to be impulsive, unpremeditated activity, not restricted by plans.",
        "temperament": "Sanguine"
      },
      {
        "value": "35",
        "word": "Scheduled",
        "description": "Makes, and lives, according to a daily plan, dislikes his plan to be interrupted.",
        "temperament": "Melancholy"
      },
      {
        "value": "36",
        "word": "Shy",
        "description": "Quiet, doesn't easily instigate a conversation.",
        "temperament": "Phlegmatic"
      }
    ]
  },
  {
    "questionNumber": 9,
    "type": "Strengths",
    "options": [
      {
        "value": "37",
        "word": "Orderly",
        "description": "A person who has a methodical, systematic arrangement of things.",
        "temperament": "Melancholy"
      },
      {
        "value": "38",
        "word": "Obliging",
        "description": "Accommodating. One who is quick to do it another's way.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "39",
        "word": "Outspoken",
        "description": "Speaks frankly and without reserve.",
        "temperament": "Choleric"
      },
      {
        "value": "40",
        "word": "Optimistic",
        "description": "Sunny disposition who convinces himself and others that everything will turn out all right.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 10,
    "type": "Strengths",
    "options": [
      {
        "value": "41",
        "word": "Friendly",
        "description": "A responder rather than an initiator, seldom starts a conversation.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "42",
        "word": "Faithful",
        "description": "Consistently reliable, steadfast, loyal, and devoted sometimes beyond reason.",
        "temperament": "Melancholy"
      },
      {
        "value": "43",
        "word": "Funny",
        "description": "Sparkling sense of humor that can make virtually any story into an hilarious event.",
        "temperament": "Sanguine"
      },
      {
        "value": "44",
        "word": "Forceful",
        "description": "A commanding personality whom others would hesitate to take a stand against.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 11,
    "type": "Strengths",
    "options": [
      {
        "value": "45",
        "word": "Daring",
        "description": "Willing to take risks; fearless, bold.",
        "temperament": "Choleric"
      },
      {
        "value": "46",
        "word": "Delightful",
        "description": "A person who is upbeat and fun to be with.",
        "temperament": "Sanguine"
      },
      {
        "value": "47",
        "word": "Diplomatic",
        "description": "Deals with people tactfully, sensitively, and patiently.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "48",
        "word": "Detailed",
        "description": "Does everything in proper order with a clear memory of all the things that happen.",
        "temperament": "Melancholy"
      }
    ]
  },
  {
    "questionNumber": 12,
    "type": "Strengths",
    "options": [
      {
        "value": "49",
        "word": "Cheerful",
        "description": "Consistently in good spirits and promoting happiness in others.",
        "temperament": "Sanguine"
      },
      {
        "value": "50",
        "word": "Consistent",
        "description": "Stays emotionally on an even keel, responding as one might expect.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "51",
        "word": "Cultured",
        "description": "One whose interests involve both intellectual and artistic pursuits, such as theater, symphony, ballet.",
        "temperament": "Melancholy"
      },
      {
        "value": "52",
        "word": "Confident",
        "description": "Self-assured and certain of own ability and success.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 13,
    "type": "Strengths",
    "options": [
      {
        "value": "53",
        "word": "Idealistic",
        "description": "Visualizes things in their perfect form, and has a need to measure",
        "temperament": "Melancholy"
      },
      {
        "value": "54",
        "word": "Independent",
        "description": "Self-sufficient, self-supporting, self-confident, and seems to have little need of help. up to that standard himself.",
        "temperament": "Choleric"
      },
      {
        "value": "55",
        "word": "Inoffensive",
        "description": "A person who never says or causes anything unpleasant or objectionable.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "56",
        "word": "Inspiring",
        "description": "Encourages others to work, join, or be involved, and makes the whole thing fun",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 14,
    "type": "Strengths",
    "options": [
      {
        "value": "57",
        "word": "Demonstrative",
        "description": "Openly expresses emotion, especially affection and doesn't hesitate to touch others while speaking to them.",
        "temperament": "Sanguine"
      },
      {
        "value": "58",
        "word": "Decisive",
        "description": "A person with quick, conclusive, judgment-making ability.",
        "temperament": "Choleric"
      },
      {
        "value": "59",
        "word": "Dry humor",
        "description": "Exhibits \"dry wit,\" usually one-liners which can be sarcastic in nature.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "60",
        "word": "Deep",
        "description": "Intense and often introspective with distaste for surface conversation and pursuits.",
        "temperament": "Melancholy"
      }
    ]
  },
  {
    "questionNumber": 15,
    "type": "Strengths",
    "options": [
      {
        "value": "61",
        "word": "Mediator",
        "description": "Consistently finds himself or herself in the role of reconciling differences in order to avoid conflict.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "62",
        "word": "Musical",
        "description": "Participates in or has a deep appreciation for music, is committed to music as an art form, rather than the fun of performance.",
        "temperament": "Melancholy"
      },
      {
        "value": "63",
        "word": "Mover",
        "description": "Driven by a need to be productive, is a leader whom others follow, finds it difficult to sit still.",
        "temperament": "Choleric"
      },
      {
        "value": "64",
        "word": "Mixes easily",
        "description": "Loves a party and can't wait to meet everyone in the room, never meets a stranger.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 16,
    "type": "Strengths",
    "options": [
      {
        "value": "65",
        "word": "Thoughtful",
        "description": "A considerate person who remembers special occasions and is quick to make a kind gesture.",
        "temperament": "Melancholy"
      },
      {
        "value": "66",
        "word": "Tenacious",
        "description": "Holds on firmly, stubbornly, and won't let go until the goal is accomplished.",
        "temperament": "Choleric"
      },
      {
        "value": "67",
        "word": "Talker",
        "description": "Constantly talking, generally telling funny stories and entertaining everyone around, feeling the need to fill the silence in order to make others comfortable.",
        "temperament": "Sanguine"
      },
      {
        "value": "68",
        "word": "Tolerant",
        "description": "Easily accepts the thoughts and ways of others without the need to disagree with or change them.",
        "temperament": "Phlegmatic"
      }
    ]
  },
  {
    "questionNumber": 17,
    "type": "Strengths",
    "options": [
      {
        "value": "69",
        "word": "Listener",
        "description": "Always seems willing to hear what you have to say.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "70",
        "word": "Loyal",
        "description": "Faithful to a person, ideal, or job, sometimes beyond reason.",
        "temperament": "Melancholy"
      },
      {
        "value": "71",
        "word": "Leader",
        "description": "A natural born director, who is driven to be in charge, and often finds it difficult to believe that anyone else can do the job as well.",
        "temperament": "Choleric"
      },
      {
        "value": "72",
        "word": "Lively",
        "description": "Full of life, vigorous, energetic.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 18,
    "type": "Strengths",
    "options": [
      {
        "value": "73",
        "word": "Contented",
        "description": "Easily satisfied with what he has, rarely envious.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "74",
        "word": "Chief",
        "description": "Commands leadership and expects people to follow.",
        "temperament": "Choleric"
      },
      {
        "value": "75",
        "word": "Chart maker",
        "description": "Organizes life, tasks, and problem solving by making lists, forms, or graphs.",
        "temperament": "Melancholy"
      },
      {
        "value": "76",
        "word": "Cute",
        "description": "Precious, adorable, center of attention.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 19,
    "type": "Strengths",
    "options": [
      {
        "value": "77",
        "word": "Perfectionist",
        "description": "Places high standards on himself, and often on others, desiring that everything be in proper order at all times.",
        "temperament": "Melancholy"
      },
      {
        "value": "78",
        "word": "Pleasant",
        "description": "Easygoing, easy to be around, easy to talk with.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "79",
        "word": "Productive",
        "description": "Must constantly be working or achieving, often finds it very difficult to rest.",
        "temperament": "Choleric"
      },
      {
        "value": "80",
        "word": "Popular",
        "description": "Life of the party and therefore much desired as a party guest.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 20,
    "type": "Strengths",
    "options": [
      {
        "value": "81",
        "word": "Bouncy",
        "description": "A bubbly, lively personality, full of energy.",
        "temperament": "Sanguine"
      },
      {
        "value": "82",
        "word": "Bold",
        "description": "Fearless, daring, forward, unafraid of risk.",
        "temperament": "Choleric"
      },
      {
        "value": "83",
        "word": "Behaved",
        "description": "Consistently desires to conduct himself within the realm of what he feels is proper.",
        "temperament": "Melancholy"
      },
      {
        "value": "84",
        "word": "Balanced",
        "description": "Stable, middle-of-the-road personality, not subject to sharp highs or lows.",
        "temperament": "Phlegmatic"
      }
    ]
  },
  {
    "questionNumber": 21,
    "type": "Weaknesses",
    "options": [
      {
        "value": "85",
        "word": "Blank",
        "description": "A person who shows little facial expression or emotion",
        "temperament": "Phlegmatic"
      },
      {
        "value": "86",
        "word": "Bashful",
        "description": "Shrinks from getting attention, resulting from self-consciousness.",
        "temperament": "Melancholy"
      },
      {
        "value": "87",
        "word": "Brassy",
        "description": "Showy, flashy, comes on strong, too loud.",
        "temperament": "Sanguine"
      },
      {
        "value": "88",
        "word": "Bossy",
        "description": "Commanding, domineering, sometimes overbearing in adult relationships.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 22,
    "type": "Weaknesses",
    "options": [
      {
        "value": "89",
        "word": "Undisciplined",
        "description": "A person whose lack of order permeates most every area of his life.",
        "temperament": "Sanguine"
      },
      {
        "value": "90",
        "word": "Unsympathetic",
        "description": "Finds it difficult to relate to the problems or hurts of others",
        "temperament": "Choleric"
      },
      {
        "value": "91",
        "word": "Unenthusiastic",
        "description": "Tends to not get excited, often feeling it won't work anyway.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "92",
        "word": "Unforgiving",
        "description": "One who has difficulty forgiving or forgetting a hurt or injustice done to them, apt to hold onto a grudge.",
        "temperament": "Melancholy"
      }
    ]
  },
  {
    "questionNumber": 23,
    "type": "Weaknesses",
    "options": [
      {
        "value": "93",
        "word": "Reticent",
        "description": "Unwilling or struggles against getting involved, especially when complex.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "94",
        "word": "Resentful",
        "description": "Often holds ill feelings as a result of real or imagined offenses.",
        "temperament": "Melancholy"
      },
      {
        "value": "95",
        "word": "Resistant",
        "description": "Strives, works against, or hesitates to accept any other way but his own.",
        "temperament": "Choleric"
      },
      {
        "value": "96",
        "word": "Repetitious",
        "description": "Retells stories and incidents to entertain you without realizing he has already told the story several times before, constantly needs something to say.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 24,
    "type": "Weaknesses",
    "options": [
      {
        "value": "97",
        "word": "Fussy",
        "description": "Insistent over petty matters or details, calling for great attention to trivial details.",
        "temperament": "Melancholy"
      },
      {
        "value": "98",
        "word": "Fearful",
        "description": "Often experiences feelings of deep concern, apprehension, or anxiousness.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "99",
        "word": "Forgetful",
        "description": "Lack of memory which is usually tied to a lack of discipline and not bothering to mentally record things that aren't fun.",
        "temperament": "Sanguine"
      },
      {
        "value": "100",
        "word": "Frank",
        "description": "Straightforward, outspoken, and doesn't mind telling you exactly what he thinks.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 25,
    "type": "Weaknesses",
    "options": [
      {
        "value": "101",
        "word": "Impatient",
        "description": "A person who finds it difficult to endure irritation or wait for others.",
        "temperament": "Choleric"
      },
      {
        "value": "102",
        "word": "Insecure",
        "description": "One who is apprehensive or lacks confidence.",
        "temperament": "Melancholy"
      },
      {
        "value": "103",
        "word": "Indecisive",
        "description": "The person who finds it difficult to make any decision at all. (Not the personality that labors long over each decision in order to make the perfect one.)",
        "temperament": "Phlegmatic"
      },
      {
        "value": "104",
        "word": "Interrupts",
        "description": "A person who is more of a talker than a listener, who starts speaking without even realizing someone else is already speaking.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 26,
    "type": "Weaknesses",
    "options": [
      {
        "value": "105",
        "word": "Unpopular",
        "description": "A person whose intensity and demand for perfection can push others away.",
        "temperament": "Melancholy"
      },
      {
        "value": "106",
        "word": "Uninvolved",
        "description": "Has no desire to listen or become interested in clubs, groups, activities, or other people's lives.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "107",
        "word": "Unpredictable",
        "description": "May be ecstatic one moment and down the next, or willing to help but then disappears, or promises to come but forgets to show up.",
        "temperament": "Sanguine"
      },
      {
        "value": "108",
        "word": "Unaffectionate",
        "description": "Finds it difficult to verbally or physically demonstrate tenderness openly.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 27,
    "type": "Weaknesses",
    "options": [
      {
        "value": "109",
        "word": "Headstrong",
        "description": "Insists on having his own way.",
        "temperament": "Choleric"
      },
      {
        "value": "110",
        "word": "Haphazard",
        "description": "Has no consistent way of doing things.",
        "temperament": "Sanguine"
      },
      {
        "value": "111",
        "word": "Hard to please",
        "description": "A person whose standards are set so high that it is difficult to ever satisfy them.",
        "temperament": "Melancholy"
      },
      {
        "value": "112",
        "word": "Hesitant",
        "description": "Slow to get moving and hard to get involved.",
        "temperament": "Phlegmatic"
      }
    ]
  },
  {
    "questionNumber": 28,
    "type": "Weaknesses",
    "options": [
      {
        "value": "113",
        "word": "Plain",
        "description": "A middle-of-the-road personality without highs or lows and showing little, if any, emotion.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "114",
        "word": "Pessimistic",
        "description": "While hoping for the best, this person generally sees the downside of a situation first.",
        "temperament": "Melancholy"
      },
      {
        "value": "115",
        "word": "Proud",
        "description": "One with great self-esteem who sees himself as always right and the best person for the job.",
        "temperament": "Choleric"
      },
      {
        "value": "116",
        "word": "Permissive",
        "description": "Allows others (including children) keep from being disliked.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 29,
    "type": "Weaknesses",
    "options": [
      {
        "value": "117",
        "word": "Angered easily",
        "description": "One who has a childlike flash-in-the-pan temper that expresses itself in tantrum style and is over and forgotten almost instantly.",
        "temperament": "Sanguine"
      },
      {
        "value": "118",
        "word": "Aimless",
        "description": "Not a goal-setter with little desire to be one.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "119",
        "word": "Argumentative",
        "description": "Incites arguments generally because he is right, no matter what the situation may be.",
        "temperament": "Choleric"
      },
      {
        "value": "120",
        "word": "Alienated",
        "description": "Easily feels estranged from others, often because of insecurity or fear that others don't really enjoy his company.",
        "temperament": "Melancholy"
      }
    ]
  },
  {
    "questionNumber": 30,
    "type": "Weaknesses",
    "options": [
      {
        "value": "121",
        "word": "Naive",
        "description": "Simple and childlike perspective, lacking sophistication or comprehension of what the deeper levels of life are really about.",
        "temperament": "Sanguine"
      },
      {
        "value": "122",
        "word": "Negative attitude",
        "description": "One whose attitude is seldom positive and is often able to see only the down or dark side of each situation.",
        "temperament": "Melancholy"
      },
      {
        "value": "123",
        "word": "Nervy",
        "description": "Full of confidence, fortitude, and sheer guts, often in a negative sense.",
        "temperament": "Choleric"
      },
      {
        "value": "124",
        "word": "Nonchalant",
        "description": "Easygoing, unconcerned, indifferent.",
        "temperament": "Phlegmatic"
      }
    ]
  },
  {
    "questionNumber": 31,
    "type": "Weaknesses",
    "options": [
      {
        "value": "125",
        "word": "Worrier",
        "description": "Consistently feels uncertain, troubled, or anxious.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "126",
        "word": "Withdrawn",
        "description": "A person who pulls back to himself and needs a great deal of alone or isolated time.",
        "temperament": "Melancholy"
      },
      {
        "value": "127",
        "word": "Workaholic",
        "description": "An aggressive goal-setter who must be constantly productive and feels very guilty when resting, is not driven by a need for perfection or completion but by a need for accomplishment and reward.",
        "temperament": "Choleric"
      },
      {
        "value": "128",
        "word": "Wants credit",
        "description": "Thrives on the credit or approval of others. As an entertainer this person feeds on the applause, laughter, and/or acceptance of an audience.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 32,
    "type": "Weaknesses",
    "options": [
      {
        "value": "129",
        "word": "Too sensitive",
        "description": "Overly introspective and easily offended when misunderstood.",
        "temperament": "Melancholy"
      },
      {
        "value": "130",
        "word": "Tactless",
        "description": "Sometimes expresses himself in a somewhat offensive and inconsiderate way.",
        "temperament": "Choleric"
      },
      {
        "value": "131",
        "word": "Timid",
        "description": "Shrinks from difficult situations.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "132",
        "word": "Talkative",
        "description": "An entertaining, compulsive talker who finds it difficult to listen.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 33,
    "type": "Weaknesses",
    "options": [
      {
        "value": "133",
        "word": "Doubtful",
        "description": "Characterized by uncertainty and lack of confidence that it will ever work out.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "134",
        "word": "Disorganized",
        "description": "Lack of ability to ever get life in order.",
        "temperament": "Sanguine"
      },
      {
        "value": "135",
        "word": "Domineering",
        "description": "Compulsively takes control of situations and/or people, usually telling others what to do.",
        "temperament": "Choleric"
      },
      {
        "value": "136",
        "word": "Depressed",
        "description": "A person who feels down much of the time.",
        "temperament": "Melancholy"
      }
    ]
  },
  {
    "questionNumber": 34,
    "type": "Weaknesses",
    "options": [
      {
        "value": "137",
        "word": "Inconsistent",
        "description": "Erratic, contradictory, with actions and emotions not based on logic.",
        "temperament": "Sanguine"
      },
      {
        "value": "138",
        "word": "Introvert",
        "description": "A person whose thoughts and interests are directed inward, lives within himself.",
        "temperament": "Melancholy"
      },
      {
        "value": "139",
        "word": "Intolerant",
        "description": "Appears unable to withstand or accept another's attitudes, point of view, or way of doing things.",
        "temperament": "Choleric"
      },
      {
        "value": "140",
        "word": "Indifferent",
        "description": "A person to whom most things don't matter one way or the other.",
        "temperament": "Phlegmatic"
      }
    ]
  },
  {
    "questionNumber": 35,
    "type": "Weaknesses",
    "options": [
      {
        "value": "141",
        "word": "Messy",
        "description": "Living in a state of disorder, unable to find things.",
        "temperament": "Sanguine"
      },
      {
        "value": "142",
        "word": "Moody",
        "description": "Doesn't get very high emotionally, but easily slips into low lows, often when feeling unappreciated.",
        "temperament": "Melancholy"
      },
      {
        "value": "143",
        "word": "Mumbles",
        "description": "Will talk quietly under the breath when pushed, doesn't bother to speak clearly.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "144",
        "word": "Manipulative",
        "description": "Influences or manages shrewdly or deviously for his own advantage, will get his way somehow.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 36,
    "type": "Weaknesses",
    "options": [
      {
        "value": "145",
        "word": "Slow",
        "description": "Doesn't often act or think quickly, too much of a bother.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "146",
        "word": "Stubborn",
        "description": "Determined to exert his or her own will, not easily persuaded, obstinate.",
        "temperament": "Choleric"
      },
      {
        "value": "147",
        "word": "Show-off",
        "description": "Needs to be the center of attention, wants to be watched.",
        "temperament": "Sanguine"
      },
      {
        "value": "148",
        "word": "Skeptical",
        "description": "Disbelieving, questioning the motive behind the words.",
        "temperament": "Melancholy"
      }
    ]
  },
  {
    "questionNumber": 37,
    "type": "Weaknesses",
    "options": [
      {
        "value": "149",
        "word": "Loner",
        "description": "Requires a lot of private time and tends to avoid other people.",
        "temperament": "Melancholy"
      },
      {
        "value": "150",
        "word": "Lord over others",
        "description": "Doesn't hesitate to let you know that he is right or is in control.",
        "temperament": "Choleric"
      },
      {
        "value": "151",
        "word": "Lazy",
        "description": "Evaluates work or activity in terms of how much energy it will take.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "152",
        "word": "Loud",
        "description": "A person whose laugh or voice can be heard above others in the room.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 38,
    "type": "Weaknesses",
    "options": [
      {
        "value": "153",
        "word": "Sluggish",
        "description": "Slow to get started, needs push to be motivated.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "154",
        "word": "Suspicious",
        "description": "Tends to suspect or distrust others or ideas.",
        "temperament": "Melancholy"
      },
      {
        "value": "155",
        "word": "Short-tempered",
        "description": "Has a demanding impatience-based anger and a short fuse. Anger is expressed when others are not moving fast enough or have not completed what they have been asked to do.",
        "temperament": "Choleric"
      },
      {
        "value": "156",
        "word": "Scatterbrained",
        "description": "Lacks the power of concentration or attention, flighty.",
        "temperament": "Sanguine"
      }
    ]
  },
  {
    "questionNumber": 39,
    "type": "Weaknesses",
    "options": [
      {
        "value": "157",
        "word": "Revengeful",
        "description": "Knowingly or otherwise holds a grudge and punishes the offender, often by subtly withholding friendship or affection.",
        "temperament": "Melancholy"
      },
      {
        "value": "158",
        "word": "Restless",
        "description": "Likes constant new activity because it isn't fun to do the same things all the time.",
        "temperament": "Sanguine"
      },
      {
        "value": "159",
        "word": "Reluctant",
        "description": "Unwilling or struggles against getting involved.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "160",
        "word": "Rash",
        "description": "May act hastily, without thinking things through, generally because of impatience.",
        "temperament": "Choleric"
      }
    ]
  },
  {
    "questionNumber": 40,
    "type": "Weaknesses",
    "options": [
      {
        "value": "161",
        "word": "Compromising",
        "description": "Will often relax his position, even when right, in order to avoid conflict.",
        "temperament": "Phlegmatic"
      },
      {
        "value": "162",
        "word": "Critical",
        "description": "Constantly evaluating and making judgments, frequently thinking or expressing negative reactions.",
        "temperament": "Melancholy"
      },
      {
        "value": "163",
        "word": "Crafty",
        "description": "Shrewd, one who can always find a way to get to the desired end?",
        "temperament": "Choleric"
      },
      {
        "value": "164",
        "word": "Changeable",
        "description": "A childlike, short attention span that needs a lot of change and variety to keep from getting bored.",
        "temperament": "Sanguine"
      }
    ]
  }
];
