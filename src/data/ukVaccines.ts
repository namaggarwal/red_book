import { VaccinationRecord } from '../types';

export interface VaccineTemplate {
  name: string;
  diseaseTarget: string;
  doseNumber: number;
  totalDoses: number;
  ageRecommended: string;
  ageWeeks: number;
  notes?: string;
}

// NHS Routine Childhood Immunisation Schedule (effective UK schedule 2024-2026)
export const UK_ROUTINE_VACCINES: VaccineTemplate[] = [
  // 8 Weeks
  {
    name: '6-in-1 vaccine (dose 1)',
    diseaseTarget: 'Diphtheria, tetanus, whooping cough (pertussis), polio, Hib, hepatitis B',
    doseNumber: 1,
    totalDoses: 3,
    ageRecommended: '8 weeks',
    ageWeeks: 8,
    notes: 'Single injection in thigh',
  },
  {
    name: 'MenB vaccine (dose 1)',
    diseaseTarget: 'Meningococcal group B bacteria (meningitis & sepsis)',
    doseNumber: 1,
    totalDoses: 3,
    ageRecommended: '8 weeks',
    ageWeeks: 8,
    notes: 'Given with infant paracetamol to prevent post-vaccine fever',
  },
  {
    name: 'Rotavirus vaccine (dose 1)',
    diseaseTarget: 'Rotavirus (severe diarrhoea and vomiting)',
    doseNumber: 1,
    totalDoses: 2,
    ageRecommended: '8 weeks',
    ageWeeks: 8,
    notes: 'Oral drops',
  },

  // 12 Weeks
  {
    name: '6-in-1 vaccine (dose 2)',
    diseaseTarget: 'Diphtheria, tetanus, pertussis, polio, Hib, hepatitis B',
    doseNumber: 2,
    totalDoses: 3,
    ageRecommended: '12 weeks',
    ageWeeks: 12,
    notes: 'Second dose',
  },
  {
    name: 'Pneumococcal (PCV) vaccine (dose 1)',
    diseaseTarget: 'Pneumococcal infections (pneumonia, meningitis, bronchitis)',
    doseNumber: 1,
    totalDoses: 2,
    ageRecommended: '12 weeks',
    ageWeeks: 12,
    notes: 'Single injection',
  },
  {
    name: 'Rotavirus vaccine (dose 2)',
    diseaseTarget: 'Rotavirus (severe diarrhoea and sickness)',
    doseNumber: 2,
    totalDoses: 2,
    ageRecommended: '12 weeks',
    ageWeeks: 12,
    notes: 'Oral drops (must be completed before 24 weeks)',
  },

  // 16 Weeks
  {
    name: '6-in-1 vaccine (dose 3)',
    diseaseTarget: 'Diphtheria, tetanus, pertussis, polio, Hib, hepatitis B',
    doseNumber: 3,
    totalDoses: 3,
    ageRecommended: '16 weeks',
    ageWeeks: 16,
    notes: 'Final infant primary dose',
  },
  {
    name: 'MenB vaccine (dose 2)',
    diseaseTarget: 'Meningococcal group B bacteria',
    doseNumber: 2,
    totalDoses: 3,
    ageRecommended: '16 weeks',
    ageWeeks: 16,
    notes: 'Given with infant paracetamol',
  },

  // 1 Year (12 months)
  {
    name: 'Hib/MenC vaccine',
    diseaseTarget: 'Haemophilus influenzae type b and Meningitis C',
    doseNumber: 1,
    totalDoses: 1,
    ageRecommended: '1 year',
    ageWeeks: 52,
    notes: 'Single booster injection',
  },
  {
    name: 'MMR vaccine (dose 1)',
    diseaseTarget: 'Measles, mumps and rubella',
    doseNumber: 1,
    totalDoses: 2,
    ageRecommended: '1 year',
    ageWeeks: 52,
    notes: 'Essential protection against measles outbreak',
  },
  {
    name: 'Pneumococcal (PCV) booster',
    diseaseTarget: 'Pneumococcal infections',
    doseNumber: 2,
    totalDoses: 2,
    ageRecommended: '1 year',
    ageWeeks: 52,
    notes: 'Second and final booster dose',
  },
  {
    name: 'MenB booster',
    diseaseTarget: 'Meningococcal group B',
    doseNumber: 3,
    totalDoses: 3,
    ageRecommended: '1 year',
    ageWeeks: 52,
    notes: 'Booster injection',
  },

  // Pre-school (3 years 4 months)
  {
    name: '4-in-1 pre-school booster',
    diseaseTarget: 'Diphtheria, tetanus, whooping cough and polio',
    doseNumber: 1,
    totalDoses: 1,
    ageRecommended: '3 years 4 months',
    ageWeeks: 173,
    notes: 'Pre-school booster',
  },
  {
    name: 'MMR vaccine (dose 2)',
    diseaseTarget: 'Measles, mumps and rubella',
    doseNumber: 2,
    totalDoses: 2,
    ageRecommended: '3 years 4 months',
    ageWeeks: 173,
    notes: 'Second dose provides lifelong immunity',
  },
];

export function generateInitialVaccines(childId: string, dobString: string): VaccinationRecord[] {
  const dob = new Date(dobString);
  const now = new Date().toISOString();

  return UK_ROUTINE_VACCINES.map((v, index) => {
    // Calculate estimated due date based on birth date + ageWeeks
    const dueDate = new Date(dob);
    dueDate.setDate(dueDate.getDate() + v.ageWeeks * 7);
    const dueDateString = dueDate.toISOString().split('T')[0];

    return {
      id: `vax-init-${index + 1}-${Date.now().toString(36)}`,
      childId,
      recordType: 'vaccination',
      vaccineName: v.name,
      diseaseTarget: v.diseaseTarget,
      doseNumber: v.doseNumber,
      totalDoses: v.totalDoses,
      ageRecommended: v.ageRecommended,
      ageRecommendedWeeks: v.ageWeeks,
      recordDate: dueDateString,
      status: 'planned',
      notes: v.notes || '',
      source: 'parent',
      createdAt: now,
      updatedAt: now,
      schemaVersion: 1,
    } as VaccinationRecord;
  });
}
