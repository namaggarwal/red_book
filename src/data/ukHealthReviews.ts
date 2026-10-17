import { HealthReviewRecord, HealthReviewType } from '../types';

export interface HealthReviewTemplate {
  reviewType: HealthReviewType;
  title: string;
  recommendedAgeWeeks: number;
  description: string;
  defaultSetting: string;
}

export const UK_HEALTH_REVIEW_TEMPLATES: HealthReviewTemplate[] = [
  {
    reviewType: 'newborn_physical',
    title: 'Newborn Physical Examination (NIPE)',
    recommendedAgeWeeks: 0,
    description: 'Carried out within 72 hours of birth to check eyes, heart, hips, and testicles (in boys).',
    defaultSetting: 'Hospital Maternity Unit',
  },
  {
    reviewType: 'newborn_hearing',
    title: 'Newborn Hearing Screening',
    recommendedAgeWeeks: 1,
    description: 'Automated auditory brainstem response (AABR) or otoacoustic emission (AOAE) test.',
    defaultSetting: 'Hospital / Community Clinic',
  },
  {
    reviewType: 'newborn_blood_spot',
    title: 'Newborn Blood Spot (Heel Prick) Test',
    recommendedAgeWeeks: 1, // Day 5
    description: 'Screens for 9 rare but serious health conditions including cystic fibrosis and sickle cell.',
    defaultSetting: 'Home (Midwife visit)',
  },
  {
    reviewType: 'six_eight_week',
    title: '6 to 8 Week Baby Health Review',
    recommendedAgeWeeks: 7,
    description: 'Full head-to-toe check by GP and Health Visitor: weight, length, head circumference, eyes, hips, heart, fontanelle, maternal wellbeing.',
    defaultSetting: 'GP Surgery',
  },
  {
    reviewType: 'nine_twelve_month',
    title: '9 to 12 Month Health Visitor Review',
    recommendedAgeWeeks: 44,
    description: 'Assessment of physical development, language, social skills, hearing, vision, weaning, dental health and safety (Ages & Stages ASQ-3).',
    defaultSetting: 'Health Centre / Children\'s Centre',
  },
  {
    reviewType: 'two_two_half_year',
    title: '2 to 2.5 Year Health Review',
    recommendedAgeWeeks: 110,
    description: 'Comprehensive review of speech & communication, fine & gross motor skills, behaviour, sleep, toilet readiness and emotional development.',
    defaultSetting: 'Community Health Clinic / Nursery',
  },
];

export function generateInitialHealthReviews(childId: string, dobString: string): HealthReviewRecord[] {
  const dob = new Date(dobString);
  const now = new Date().toISOString();

  return UK_HEALTH_REVIEW_TEMPLATES.map((r, index) => {
    const dueDate = new Date(dob);
    dueDate.setDate(dueDate.getDate() + r.recommendedAgeWeeks * 7);

    return {
      id: `review-init-${index + 1}-${Date.now().toString(36)}`,
      childId,
      recordType: 'health_review',
      reviewType: r.reviewType,
      title: r.title,
      reviewDate: dueDate.toISOString().split('T')[0],
      setting: r.defaultSetting,
      screeningOutcome: 'pending',
      notes: r.description,
      source: 'health_visitor',
      createdAt: now,
      updatedAt: now,
      status: 'active',
      schemaVersion: 1,
    } as HealthReviewRecord;
  });
}
