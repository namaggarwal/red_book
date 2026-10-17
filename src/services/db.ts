import {
  ChildProfile,
  AnyRecord,
  AppConfig,
  OutboxItem,
  GrowthRecord,
  VaccinationRecord,
  MilestoneRecord,
  HealthReviewRecord,
  AppointmentRecord,
  HealthEventRecord,
} from '../types';
import { generateInitialVaccines } from '../data/ukVaccines';
import { generateInitialMilestones } from '../data/ukMilestones';
import { generateInitialHealthReviews } from '../data/ukHealthReviews';

const STORAGE_KEYS = {
  PROFILE: 'redbook_profile',
  RECORDS: 'redbook_records',
  CONFIG: 'redbook_config',
  OUTBOX: 'redbook_outbox',
  AUDIT: 'redbook_audit',
  AUTH: 'redbook_auth_session',
};

const DEFAULT_CONFIG: AppConfig = {
  theme: 'light',
  units: {
    weight: 'kg',
    length: 'cm',
  },
  modules: {
    feedingSleep: true,
  },
  security: {
    pin: '1234',
    usePin: true,
    autoLockMinutes: 15,
  },
  backend: {
    googleScriptUrl: '',
    googleScriptPassword: '',
    autoSync: true,
  },
};

class RedBookDatabase {
  // Profiles
  async getProfile(): Promise<ChildProfile | null> {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async saveProfile(profile: ChildProfile): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // App Config
  async getConfig(): Promise<AppConfig> {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_CONFIG;
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  async saveConfig(config: AppConfig): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }

  // Records
  async getRecords(): Promise<AnyRecord[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return [];
    try {
      const records: AnyRecord[] = JSON.parse(raw);
      // Filter out deleted records for regular view unless requested
      return records.filter((r) => r.status !== 'deleted');
    } catch {
      return [];
    }
  }

  async getAllRecordsIncludingDeleted(): Promise<AnyRecord[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async getRecord(id: string): Promise<AnyRecord | null> {
    const all = await this.getAllRecordsIncludingDeleted();
    return all.find((r) => r.id === id) || null;
  }

  async saveRecord(record: AnyRecord, trackInQueue = true): Promise<void> {
    const all = await this.getAllRecordsIncludingDeleted();
    const index = all.findIndex((r) => r.id === record.id);
    let operation: 'create' | 'update' = 'create';

    const updated = {
      ...record,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      operation = 'update';
      all[index] = updated;
    } else {
      if (!updated.createdAt) {
        updated.createdAt = new Date().toISOString();
      }
      all.push(updated);
    }

    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(all));

    // Queue for sync outbox if configured
    if (trackInQueue) {
      await this.addToOutbox({
        id: `op-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        operation,
        recordType: record.recordType,
        recordId: record.id,
        payload: updated,
        timestamp: new Date().toISOString(),
        attempts: 0,
      });
    }
  }

  async softDeleteRecord(id: string): Promise<void> {
    const all = await this.getAllRecordsIncludingDeleted();
    const index = all.findIndex((r) => r.id === id);
    if (index >= 0) {
      all[index].status = 'deleted';
      all[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(all));

      await this.addToOutbox({
        id: `op-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        operation: 'delete',
        recordType: all[index].recordType,
        recordId: id,
        payload: { id },
        timestamp: new Date().toISOString(),
        attempts: 0,
      });
    }
  }

  // Outbox for Offline-first Sync
  async getOutbox(): Promise<OutboxItem[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.OUTBOX);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async addToOutbox(item: OutboxItem): Promise<void> {
    const outbox = await this.getOutbox();
    // Keep idempotent by updating if same recordId & operation exists
    const existingIndex = outbox.findIndex(
      (o) => o.recordId === item.recordId && o.operation === item.operation
    );
    if (existingIndex >= 0) {
      outbox[existingIndex] = item;
    } else {
      outbox.push(item);
    }
    localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(outbox));
  }

  async removeFromOutbox(id: string): Promise<void> {
    const outbox = await this.getOutbox();
    const filtered = outbox.filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify(filtered));
  }

  async clearOutbox(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify([]));
  }

  // Setup new child with initial Red Book schedule templates
  async initializeChild(profile: ChildProfile): Promise<void> {
    await this.saveProfile(profile);

    // Initial birth measurements record if provided
    const records: AnyRecord[] = [];
    const now = new Date().toISOString();

    if (profile.birthWeightKg || profile.birthLengthCm || profile.birthHeadCircumferenceCm) {
      const birthGrowth: GrowthRecord = {
        id: `growth-birth-${Date.now().toString(36)}`,
        childId: profile.id,
        recordType: 'growth',
        recordDate: profile.dob,
        weightKg: profile.birthWeightKg || null,
        lengthCm: profile.birthLengthCm || null,
        headCircumferenceCm: profile.birthHeadCircumferenceCm || null,
        source: 'hospital',
        notes: 'Birth measurements at delivery',
        status: 'active',
        createdAt: now,
        updatedAt: now,
        schemaVersion: 1,
      };
      records.push(birthGrowth);
    }

    // Generate initial NHS routine vaccination schedule
    const vaccines = generateInitialVaccines(profile.id, profile.dob);
    records.push(...vaccines);

    // Generate initial NHS developmental milestones
    const milestones = generateInitialMilestones(profile.id);
    records.push(...milestones);

    // Generate initial Healthy Child Programme reviews
    const reviews = generateInitialHealthReviews(profile.id, profile.dob);
    records.push(...reviews);

    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }

  // Seed sample data for an existing child (e.g. 6-month-old baby Tara)
  async seedSampleData(): Promise<void> {
    // Current date reference: baby born 6 months ago
    const today = new Date();
    const dobDate = new Date(today);
    dobDate.setMonth(dobDate.getMonth() - 6);
    dobDate.setDate(15);
    const dobString = dobDate.toISOString().split('T')[0];

    const profile: ChildProfile = {
      id: 'child-tara-demo',
      preferredName: 'Tara',
      dob: dobString,
      sex: 'female',
      birthWeightKg: 3.25,
      birthLengthCm: 50.0,
      birthHeadCircumferenceCm: 34.5,
      gestationalAgeWeeks: 40,
      birthDetails: 'Spontaneous vaginal delivery at University College Hospital London. Healthy & active.',
      nhsNumberMasked: '*** *** 8921',
      localTimeZone: 'Europe/London',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.initializeChild(profile);

    // Add progressive realistic growth measurements across 6 months
    const all = await this.getAllRecordsIncludingDeleted();

    const d1 = new Date(dobDate);
    d1.setDate(d1.getDate() + 5); // Day 5 weight check
    all.push({
      id: `growth-d5-${Date.now()}`,
      childId: profile.id,
      recordType: 'growth',
      recordDate: d1.toISOString().split('T')[0],
      weightKg: 3.12,
      source: 'health_visitor',
      notes: 'Day 5 midwife home check. Expected physiological weight drop (4%). Feeding well on breastmilk.',
      status: 'active',
      createdAt: d1.toISOString(),
      updatedAt: d1.toISOString(),
      schemaVersion: 1,
    } as GrowthRecord);

    const d2 = new Date(dobDate);
    d2.setDate(d2.getDate() + 14); // Day 14 (regained birth weight)
    all.push({
      id: `growth-d14-${Date.now()}`,
      childId: profile.id,
      recordType: 'growth',
      recordDate: d2.toISOString().split('T')[0],
      weightKg: 3.38,
      source: 'health_visitor',
      notes: 'Day 14 check. Comfortably back above birth weight! Good wet and dirty nappies.',
      status: 'active',
      createdAt: d2.toISOString(),
      updatedAt: d2.toISOString(),
      schemaVersion: 1,
    } as GrowthRecord);

    const d3 = new Date(dobDate);
    d3.setDate(d3.getDate() + 56); // 8 weeks
    all.push({
      id: `growth-8w-${Date.now()}`,
      childId: profile.id,
      recordType: 'growth',
      recordDate: d3.toISOString().split('T')[0],
      weightKg: 4.85,
      lengthCm: 56.5,
      headCircumferenceCm: 38.0,
      source: 'gp',
      notes: '8-week check with GP. Tracking nicely on 50th centile curve.',
      status: 'active',
      createdAt: d3.toISOString(),
      updatedAt: d3.toISOString(),
      schemaVersion: 1,
    } as GrowthRecord);

    const d4 = new Date(dobDate);
    d4.setDate(d4.getDate() + 112); // 16 weeks (4 months)
    all.push({
      id: `growth-16w-${Date.now()}`,
      childId: profile.id,
      recordType: 'growth',
      recordDate: d4.toISOString().split('T')[0],
      weightKg: 6.35,
      lengthCm: 62.8,
      headCircumferenceCm: 40.8,
      source: 'health_visitor',
      notes: 'Baby clinic drop-in weighing. Head circumference and weight parallel to median curve.',
      status: 'active',
      createdAt: d4.toISOString(),
      updatedAt: d4.toISOString(),
      schemaVersion: 1,
    } as GrowthRecord);

    const d5 = new Date(dobDate);
    d5.setDate(d5.getDate() + 168); // ~6 months
    all.push({
      id: `growth-6m-${Date.now()}`,
      childId: profile.id,
      recordType: 'growth',
      recordDate: d5.toISOString().split('T')[0],
      weightKg: 7.42,
      lengthCm: 66.2,
      headCircumferenceCm: 42.6,
      source: 'parent',
      notes: 'Home measurement. Starting solid foods this week!',
      status: 'active',
      createdAt: d5.toISOString(),
      updatedAt: d5.toISOString(),
      schemaVersion: 1,
    } as GrowthRecord);

    // Mark 8w and 12w and 16w vaccinations as completed
    all.forEach((rec) => {
      if (rec.recordType === 'vaccination') {
        const v = rec as VaccinationRecord;
        if (v.ageRecommendedWeeks === 8) {
          v.status = 'completed';
          v.recordDate = d3.toISOString().split('T')[0];
          v.givenBy = 'Nurse Sarah Jenkins, Highbury Surgery';
          v.batchNumber = 'LOT-921B-4X';
        } else if (v.ageRecommendedWeeks === 12) {
          const d12w = new Date(dobDate);
          d12w.setDate(d12w.getDate() + 84);
          v.status = 'completed';
          v.recordDate = d12w.toISOString().split('T')[0];
          v.givenBy = 'Highbury Health Practice';
          v.batchNumber = 'LOT-782M-1';
        } else if (v.ageRecommendedWeeks === 16) {
          v.status = 'completed';
          v.recordDate = d4.toISOString().split('T')[0];
          v.givenBy = 'Nurse Sarah Jenkins';
          v.batchNumber = 'LOT-304P-7';
          v.reaction = 'Mild sleepiness in afternoon, settled after feed.';
        }
      }

      // Mark early milestones as achieved
      if (rec.recordType === 'milestone') {
        const m = rec as MilestoneRecord;
        if (m.title.includes('Smile')) {
          const dSmile = new Date(dobDate);
          dSmile.setDate(dSmile.getDate() + 45);
          m.status = 'achieved';
          m.recordDate = dSmile.toISOString().split('T')[0];
          m.ageAchievedText = '6 weeks 3 days';
          m.parentNotes = 'Big gummy smile while waking up in the morning!';
        }
        if (m.title.includes('Laughing')) {
          const dLaugh = new Date(dobDate);
          dLaugh.setDate(dLaugh.getDate() + 105);
          m.status = 'achieved';
          m.recordDate = dLaugh.toISOString().split('T')[0];
          m.ageAchievedText = '3 months 2 weeks';
          m.parentNotes = 'Burst into giggles when papa sneezed.';
        }
        if (m.title.includes('Rolling')) {
          const dRoll = new Date(dobDate);
          dRoll.setDate(dRoll.getDate() + 140);
          m.status = 'achieved';
          m.recordDate = dRoll.toISOString().split('T')[0];
          m.ageAchievedText = '4 months 3 weeks';
          m.parentNotes = 'Rolled tummy to back on the playmat.';
        }
      }

      // Complete newborn reviews
      if (rec.recordType === 'health_review') {
        const hr = rec as HealthReviewRecord;
        if (hr.reviewType === 'newborn_physical' || hr.reviewType === 'newborn_hearing' || hr.reviewType === 'newborn_blood_spot' || hr.reviewType === 'six_eight_week') {
          hr.screeningOutcome = 'clear_normal';
          hr.practitioner = 'Dr. Fiona Clarke / Midwife Team';
          hr.notes = 'All routine checks completed. Clear hearing response bilaterally, hips normal, reflexes brisk.';
        }
      }
    });

    // Add an upcoming appointment
    const nextApptDate = new Date();
    nextApptDate.setDate(nextApptDate.getDate() + 12);
    all.push({
      id: `appt-${Date.now()}`,
      childId: profile.id,
      recordType: 'appointment',
      appointmentType: 'health_visitor',
      title: '9-Month Developmental Review Check-in',
      date: nextApptDate.toISOString().split('T')[0],
      time: '10:30',
      location: 'Islington Community Health Centre, Room 4',
      practitioner: 'Health Visitor Team',
      questionsToAsk: [
        'How to introduce allergen foods (peanuts, eggs)?',
        'Should we start night weaning feeds?',
        'Advice on toothbrushing for first two teeth',
      ],
      followUpActions: ['Bring red book paper copy just in case'],
      appointmentStatus: 'scheduled',
      notes: 'Routine 9-12 month review and growth check.',
      status: 'active',
      source: 'health_visitor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
    } as AppointmentRecord);

    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(all));
  }

  // Backup & Restore
  async exportCompleteBackup(): Promise<string> {
    const profile = await this.getProfile();
    const records = await this.getAllRecordsIncludingDeleted();
    const config = await this.getConfig();
    const backup = {
      exportVersion: '1.0',
      app: 'Red Book UK',
      exportedAt: new Date().toISOString(),
      profile,
      records,
      config,
    };
    return JSON.stringify(backup, null, 2);
  }

  async restoreBackup(jsonString: string): Promise<{ success: boolean; message: string; recordCount?: number }> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.profile && !data.records) {
        return { success: false, message: 'Invalid backup file format: missing child profile or records.' };
      }

      if (data.profile) {
        await this.saveProfile(data.profile);
      }
      if (Array.isArray(data.records)) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(data.records));
      }
      if (data.config) {
        await this.saveConfig(data.config);
      }

      return {
        success: true,
        message: `Successfully restored ${data.records?.length || 0} records for ${data.profile?.preferredName || 'child'}.`,
        recordCount: data.records?.length || 0,
      };
    } catch (e: any) {
      return { success: false, message: 'JSON parsing error: ' + e.message };
    }
  }

  async wipeAllData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.OUTBOX);
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
  }
}

export const db = new RedBookDatabase();
