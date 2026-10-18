export type Sex = 'male' | 'female';

export interface ChildProfile {
  id: string;
  preferredName: string;
  dob: string; // YYYY-MM-DD
  sex: Sex; // used for UK-WHO growth chart selection
  birthWeightKg?: number | null;
  birthLengthCm?: number | null;
  birthHeadCircumferenceCm?: number | null;
  gestationalAgeWeeks?: number | null;
  birthDetails?: string;
  nhsNumberMasked?: string;
  localTimeZone: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export type RecordSource = 'parent' | 'health_visitor' | 'gp' | 'hospital' | 'other';
export type LifecycleStatus = 'active' | 'deleted' | 'draft';

export interface BaseRecord {
  id: string;
  childId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  source: RecordSource;
  schemaVersion: number;
}

export interface GrowthRecord extends BaseRecord {
  recordType: 'growth';
  recordDate: string; // YYYY-MM-DD
  weightKg?: number | null;
  lengthCm?: number | null;
  headCircumferenceCm?: number | null;
  notes?: string;
  status: 'active' | 'deleted';
}

export type VaccineStatus = 'completed' | 'planned' | 'rescheduled' | 'cancelled' | 'deleted';

export interface VaccinationRecord extends BaseRecord {
  recordType: 'vaccination';
  vaccineName: string;
  diseaseTarget: string;
  doseNumber: number;
  totalDoses?: number;
  ageRecommended: string;
  ageRecommendedWeeks?: number;
  recordDate: string; // Date administered or planned date
  status: VaccineStatus;
  givenBy?: string;
  clinicLocation?: string;
  batchNumber?: string;
  reaction?: string;
  notes?: string;
}

export type MilestoneCategory =
  | 'social_emotional'
  | 'communication'
  | 'movement_physical'
  | 'hand_finger'
  | 'feeding_self_care'
  | 'firsts_memories';

export type MilestoneStatus = 'not_observed' | 'emerging' | 'achieved' | 'discussed' | 'deleted';

export interface MilestoneRecord extends BaseRecord {
  recordType: 'milestone';
  category: MilestoneCategory;
  title: string;
  description: string;
  ageRecommendedMonths?: number;
  recordDate?: string; // Date achieved or observed
  status: MilestoneStatus;
  ageAchievedText?: string;
  parentNotes?: string;
  photoUrl?: string;
}

export type HealthReviewType =
  | 'newborn_physical'
  | 'newborn_hearing'
  | 'newborn_blood_spot'
  | 'six_eight_week'
  | 'nine_twelve_month'
  | 'two_two_half_year'
  | 'gp_consultation'
  | 'other_review';

export type ScreeningOutcome = 'clear_normal' | 'referral_made' | 'review_required' | 'pending';

export interface HealthReviewRecord extends BaseRecord {
  recordType: 'health_review';
  reviewType: HealthReviewType;
  title: string;
  reviewDate: string;
  recordDate?: string;
  practitioner?: string;
  setting?: string;
  measurementsSummary?: string;
  screeningType?: string;
  screeningOutcome: ScreeningOutcome;
  parentalConcerns?: string;
  professionalAdvice?: string;
  followUpDate?: string;
  followUpStatus?: 'none' | 'pending' | 'completed';
  notes?: string;
  status: 'active' | 'deleted';
}

export type HealthEventType = 'illness' | 'symptom' | 'injury' | 'reaction' | 'other';
export type TempMethod = 'axillary' | 'ear' | 'forehead' | 'oral';

export interface MedicationEntry {
  id: string;
  name: string;
  dose: string;
  unit: string;
  timeGiven: string;
  reason?: string;
}

export interface HealthEventRecord extends BaseRecord {
  recordType: 'health_event';
  eventType: HealthEventType;
  title: string;
  startDate: string;
  recordDate?: string;
  endDate?: string;
  symptoms: string;
  temperatureCelsius?: number | null;
  temperatureMethod?: TempMethod;
  medicines: MedicationEntry[];
  professionalContacted?: string;
  outcome?: string;
  notes?: string;
  status: 'active' | 'deleted';
}

export type AppointmentType =
  | 'gp'
  | 'health_visitor'
  | 'hospital_pediatrician'
  | 'vaccination_clinic'
  | 'hearing_vision'
  | 'dental'
  | 'other';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'deleted';

export interface AppointmentRecord extends BaseRecord {
  recordType: 'appointment';
  appointmentType: AppointmentType;
  title: string;
  date: string;
  recordDate?: string;
  time?: string;
  location?: string;
  practitioner?: string;
  questionsToAsk: string[];
  followUpActions: string[];
  appointmentStatus: AppointmentStatus;
  linkedReviewId?: string;
  notes?: string;
  status: 'active' | 'deleted';
}

export interface NoteRecord extends BaseRecord {
  recordType: 'note';
  title: string;
  recordDate: string;
  category: 'general' | 'feeding' | 'sleep' | 'allergy' | 'family_history' | 'tip';
  content: string;
  tags: string[];
  status: 'active' | 'deleted';
}

export interface FeedingSleepRecord extends BaseRecord {
  recordType: 'feeding_sleep';
  recordDate: string;
  time: string;
  entryType: 'breast_feed' | 'formula' | 'solids' | 'sleep' | 'nappy';
  amountMl?: number;
  durationMinutes?: number;
  side?: 'left' | 'right' | 'both';
  foodDescription?: string;
  nappyWet?: boolean;
  nappyDirty?: boolean;
  notes?: string;
  status: 'active' | 'deleted';
}

export type AnyRecord =
  | GrowthRecord
  | VaccinationRecord
  | MilestoneRecord
  | HealthReviewRecord
  | HealthEventRecord
  | AppointmentRecord
  | NoteRecord
  | FeedingSleepRecord;

export interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  units: {
    weight: 'kg' | 'lbs';
    length: 'cm' | 'in';
  };
  modules: {
    feedingSleep: boolean;
  };
  security: {
    pin: string;
    usePin: boolean;
    autoLockMinutes: number;
  };
  backend: {
    googleScriptUrl: string;
    googleScriptPassword?: string;
    lastSyncTimestamp?: string;
    autoSync: boolean;
  };
}

export interface OutboxItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  recordType: string;
  recordId: string;
  payload: any;
  timestamp: string;
  attempts: number;
}
