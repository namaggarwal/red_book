# Red Book UK — Personal Child Health Record (e-RedBook)

A beautiful, privacy-conscious, offline-first Progressive Web App (PWA) companion to the UK Personal Child Health Record (**Red Book**), designed for parents to store, visualise, and manage their baby's health and development.

---

## 🌟 Key Features

### 1. Dashboard & Child Header
- **Live Age Calculation**: Automatically displays baby's age in years, months, weeks, and days.
- **Latest Measurements**: Current weight, length/height, and head circumference with exact measurement dates, source tags (Parent, Health Visitor, GP), and UK-WHO centile estimation.
- **Snapshot Growth Chart**: Quick weight-for-age trend curve.
- **Upcoming Schedule**: Shows upcoming NHS routine vaccinations and scheduled doctor visits.
- **Recent Milestones & Activity**: Highlights latest developmental moments and recorded entries.

### 2. Clinical UK-WHO Growth Centiles (0 to 24 Months)
- Plotted directly against official **UK-WHO Reference Centiles** (0.4th, 2nd, 9th, 25th, 50th median, 75th, 91st, 98th, 99.6th).
- **Sex-Specific Selection**: Distinct curves for Boys and Girls.
- **Interactive Metrics**:
  - Weight-for-age ($kg$)
  - Length/height-for-age ($cm$)
  - Head circumference-for-age ($cm$)
- **Data Point Inspection**: Tooltip reveals exact date, measurement, source, and estimated centile bracket.
- **Table View**: Comprehensive chronological measurement history table with automatic centile calculation.

### 3. NHS Routine Childhood Immunisations (2024–2026 Schedule)
- Pre-populated with the official UK schedule:
  - **8 Weeks**: 6-in-1 (dose 1), MenB (dose 1), Rotavirus (dose 1)
  - **12 Weeks**: 6-in-1 (dose 2), Pneumococcal (PCV dose 1), Rotavirus (dose 2)
  - **16 Weeks**: 6-in-1 (dose 3), MenB (dose 2)
  - **1 Year (12 months)**: Hib/MenC, MMR (dose 1), PCV booster, MenB booster
  - **3 Years 4 Months**: 4-in-1 pre-school booster, MMR (dose 2)
- One-click **"Mark as Given"** with batch number, clinic name, reaction notes, and celebration confetti.
- Support for custom vaccines (e.g., travel immunisations, private BCG, Chickenpox).

### 4. Developmental Milestones & Memorable Firsts
- Categories:
  - **Social & Emotional**: First smile, laughing, stranger awareness.
  - **Communication & Language**: Cooing, babbling, responsive sounds, first words.
  - **Movement & Physical**: Tummy time head control, rolling over, sitting unaided, crawling, walking.
  - **Hand & Finger Skills**: Grasping rattles, pincer grasp, stacking blocks.
  - **Feeding & Self-care**: Finger foods, drinking from an open cup.
  - **Memorable Firsts**: First tooth, first swim, first holiday, first birthday.
- Statuses: *Not Observed*, *Emerging*, *Achieved*.
- Celebration confetti on milestone achievement!
- Clear non-diagnostic disclaimer adhering to NHS child development principles.

### 5. Health Reviews & Screening (Healthy Child Programme)
- Standard review checkpoints:
  - Newborn Physical Examination (NIPE)
  - Newborn Hearing Screen
  - Newborn Blood Spot (Heel Prick) Test (Day 5)
  - 6 to 8 Week GP & Health Visitor Review
  - 9 to 12 Month Health Visitor Review
  - 2 to 2.5 Year Review
- Tracks practitioner names, clinical settings, parental concerns, and professional advice.

### 6. Illnesses, Fevers & Historical Medications
- Log symptoms, start/end dates, and temperatures ($^\circ\text{C}$).
- Historical medicine logs (e.g., Infant Paracetamol / Calpol with dose, unit, and time given).
- Persistent NHS **111 / 999** guidance and warning signs.

### 7. Appointments & Questions Checklist
- Upcoming and past GP, Health Visitor, and specialist visits.
- Interactive **"Questions to Ask"** checklist where parents can type questions in advance and check them off during the consultation.

### 8. Feeding, Sleep & Routine (Optional Module)
- Breastfeeding (left, right, both sides with duration).
- Bottle feeding (formula in $ml$).
- Solid foods and meal descriptions.
- Sleep and naps tally.
- Wet and dirty nappy counter.

### 9. Universal Timeline & Real-Time Search
- Unified chronological feed across all record types.
- Instant search filter matching titles, symptoms, medicines, doctors, and notes.
- Filter by category pills and custom date ranges.

### 10. Reports & Print-to-PDF
- **GP / Health Visitor Consultation Summary**: Formatted specifically for clinical consultations.
- **Print / Save to PDF** (`Cmd + P` / `Ctrl + P`) with print-optimized CSS.
- **CSV Export** for spreadsheets.
- **Complete JSON Backup Export & Restore**.

### 11. Security, Offline PWA & Google Sheets Backend
- **Passcode / PIN Lock**: 4-digit PIN with auto-lock timeout.
- **Offline-First PWA**: Fully functional without internet connection.
- **Google Sheets & Google Apps Script Backend**:
  - Store your records in your own private Google Spreadsheet!
  - Full backend script included in `google-apps-script/Code.gs`.
  - Automatic creation of tabs: `Children`, `GrowthMeasurements`, `Vaccinations`, `Milestones`, `HealthReviews`, `HealthEvents`, `Medications`, `Appointments`, `Notes`, `AuditLog`, `AppConfig`.
  - Outbox sync queue with automatic retry.

---

## 🚀 Running the App Locally

### Prerequisites
- Node.js (v18+)
- npm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open your browser at `http://localhost:3000`.

### Default Demo Passcode
- When prompted for a PIN, the default passcode is: **`1234`**
- If launching for the first time, click **"Explore with sample record (Baby Tara, 6 months)"** to instantly load realistic measurements, vaccinations, and milestones, or create your own baby's profile from scratch!

---

## ☁️ Google Sheets Sync Setup (Optional)

To connect your private Google Sheet:
1. Go to [Google Sheets](https://sheets.new) and create a new sheet.
2. Click **Extensions > Apps Script**.
3. Paste the contents of [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).
4. Click **Deploy > New deployment**, select **Web app**, set access to **Anyone**, and deploy.
5. In the Red Book app, go to **Settings > Cloud Sync**, paste your **Web App URL**, and click **Initialize Spreadsheet Tabs**!

For detailed instructions, see [`google-apps-script/README.md`](./google-apps-script/README.md).

---

## 🛡️ Privacy & Medical Disclaimer

This application is a parent-maintained digital companion to the UK Personal Child Health Record (Red Book). It does not provide medical diagnosis, automated clinical triage, or replace NHS healthcare professionals. For any urgent health concerns, always contact **NHS 111** or call **999** in an emergency.
