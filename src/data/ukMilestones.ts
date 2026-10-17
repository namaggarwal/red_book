import { MilestoneRecord, MilestoneCategory } from '../types';

export interface MilestoneTemplate {
  category: MilestoneCategory;
  title: string;
  description: string;
  ageRecommendedMonths: number;
}

export const UK_MILESTONE_TEMPLATES: MilestoneTemplate[] = [
  // Social & Emotional
  {
    category: 'social_emotional',
    title: 'First Real Smile',
    description: 'Smiles spontaneously at parents or in response to a friendly face or voice.',
    ageRecommendedMonths: 2,
  },
  {
    category: 'social_emotional',
    title: 'Laughing Out Loud',
    description: 'Giggles and chuckles when tickled or during peek-a-boo play.',
    ageRecommendedMonths: 4,
  },
  {
    category: 'social_emotional',
    title: 'Stranger Wariness & Attachment',
    description: 'Recognises familiar family faces clearly and may show hesitation or shyness around strangers.',
    ageRecommendedMonths: 8,
  },
  {
    category: 'social_emotional',
    title: 'Interactive Games (Peek-a-boo & Clapping)',
    description: 'Enjoys turn-taking games like clapping hands (pat-a-cake) and waving bye-bye.',
    ageRecommendedMonths: 10,
  },

  // Communication & Language
  {
    category: 'communication',
    title: 'Cooing & Vowel Sounds',
    description: 'Makes cheerful cooing and gurgling sounds like "ooh" and "aah".',
    ageRecommendedMonths: 2,
  },
  {
    category: 'communication',
    title: 'Babbling (Consonants)',
    description: 'Strings consonant sounds together such as "ba-ba-ba", "ma-ma", "da-da".',
    ageRecommendedMonths: 6,
  },
  {
    category: 'communication',
    title: 'Responds to Name',
    description: 'Turns head immediately and looks when called by preferred name.',
    ageRecommendedMonths: 7,
  },
  {
    category: 'communication',
    title: 'First Meaningful Word',
    description: 'Says first word with clear meaning (e.g. "Mama", "Dada", "Milk", "No").',
    ageRecommendedMonths: 12,
  },
  {
    category: 'communication',
    title: 'Two-Word Phrases',
    description: 'Combines two words together like "more milk", "car go", "bye doggy".',
    ageRecommendedMonths: 24,
  },

  // Movement & Physical
  {
    category: 'movement_physical',
    title: 'Steady Head Control (Tummy Time)',
    description: 'Lifts head and chest steadily when lying on tummy and holds head steady when upright.',
    ageRecommendedMonths: 3,
  },
  {
    category: 'movement_physical',
    title: 'Rolling Over',
    description: 'Rolls over from front to back, or back to front.',
    ageRecommendedMonths: 5,
  },
  {
    category: 'movement_physical',
    title: 'Sitting Without Support',
    description: 'Can sit steadily on floor without adult help or cushions for several minutes.',
    ageRecommendedMonths: 7,
  },
  {
    category: 'movement_physical',
    title: 'Crawling / Scooting',
    description: 'Moves around the room on hands and knees, commando crawling or bottom shuffling.',
    ageRecommendedMonths: 9,
  },
  {
    category: 'movement_physical',
    title: 'Pulling Up to Stand & Cruising',
    description: 'Pulls themselves up to stand using furniture and walks sideways while holding on.',
    ageRecommendedMonths: 10,
  },
  {
    category: 'movement_physical',
    title: 'First Independent Steps',
    description: 'Takes first brave independent steps without holding on to hands or furniture.',
    ageRecommendedMonths: 13,
  },
  {
    category: 'movement_physical',
    title: 'Walking Confidently & Climbing',
    description: 'Walks smoothly, can stop and squat to pick up toys, and climbs onto low chairs.',
    ageRecommendedMonths: 18,
  },

  // Hand & Finger Skills
  {
    category: 'hand_finger',
    title: 'Grasping Toys & Rattles',
    description: 'Holds a rattle placed in hand and shakes it intentionally.',
    ageRecommendedMonths: 4,
  },
  {
    category: 'hand_finger',
    title: 'Passing Toys Between Hands',
    description: 'Transfers objects smoothly from one hand to the other.',
    ageRecommendedMonths: 7,
  },
  {
    category: 'hand_finger',
    title: 'Pincer Grasp (Thumb & Index Finger)',
    description: 'Picks up small items or food pieces using neat index finger and thumb tip.',
    ageRecommendedMonths: 9,
  },
  {
    category: 'hand_finger',
    title: 'Stacking Blocks',
    description: 'Builds a tower of 2 to 4 building blocks.',
    ageRecommendedMonths: 16,
  },

  // Feeding & Self-care
  {
    category: 'feeding_self_care',
    title: 'First Solid Foods',
    description: 'Begins exploring purees, baby-led weaning, or mashed foods around 6 months.',
    ageRecommendedMonths: 6,
  },
  {
    category: 'feeding_self_care',
    title: 'Self-Feeding Finger Foods',
    description: 'Brings pieces of food independently to mouth and chews with gums.',
    ageRecommendedMonths: 8,
  },
  {
    category: 'feeding_self_care',
    title: 'Drinking from an Open Cup',
    description: 'Drinks sips from an open or free-flow cup with or without guidance.',
    ageRecommendedMonths: 12,
  },

  // Memorable Firsts & Family Memories
  {
    category: 'firsts_memories',
    title: 'First Tooth Erupted',
    description: 'First tiny white tooth cuts through the gum (usually lower central incisors).',
    ageRecommendedMonths: 6,
  },
  {
    category: 'firsts_memories',
    title: 'First Splash in Swimming Pool',
    description: 'First swimming experience or baby swim class.',
    ageRecommendedMonths: 5,
  },
  {
    category: 'firsts_memories',
    title: 'First Holiday / Trip Away',
    description: 'First trip away with family to visit grandparents or on holiday.',
    ageRecommendedMonths: 6,
  },
  {
    category: 'firsts_memories',
    title: 'First Birthday Celebration!',
    description: 'Turning one year old with cake, family, and joy.',
    ageRecommendedMonths: 12,
  },
];

export function generateInitialMilestones(childId: string): MilestoneRecord[] {
  const now = new Date().toISOString();
  return UK_MILESTONE_TEMPLATES.map((m, index) => ({
    id: `milestone-init-${index + 1}-${Date.now().toString(36)}`,
    childId,
    recordType: 'milestone',
    category: m.category,
    title: m.title,
    description: m.description,
    ageRecommendedMonths: m.ageRecommendedMonths,
    status: 'not_observed',
    source: 'parent',
    createdAt: now,
    updatedAt: now,
    schemaVersion: 1,
  } as MilestoneRecord));
}
