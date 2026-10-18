# Red Book UK — Google Sheets & Apps Script Setup

This guide walks you through setting up your own private Google Sheet backend for Red Book UK.

---

### Step 1: Create a new Google Sheet
1. Go to [Google Sheets](https://sheets.new) in your Google account.
2. Name your spreadsheet: **`Baby Sarah - Red Book UK`** (or your child's name).

### Step 2: Open Apps Script Editor
1. In your Google Sheet, click on **Extensions** > **Apps Script** in the top menu.
2. Replace whatever is inside the script editor with the code from [`Code.gs`](./Code.gs).
3. Click the 💾 **Save project** icon (or press `Cmd + S` / `Ctrl + S`).

### Step 3: Deploy as a Web App
1. Click the blue **Deploy** button in the top right > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and select **Web app**.
3. Fill in:
   - **Description**: `Red Book API v1`
   - **Execute as**: `Me (your Google email)`
   - **Who has access**: `Anyone` *(Note: Access is protected by your master password/PIN in code, so your Google login is not exposed to the browser)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access** to Google Sheets. Click *Review permissions* > select your account > click *Advanced* > *Go to Red Book (unsafe)* > *Allow*.
6. Copy the **Web App URL** provided (starts with `https://script.google.com/macros/s/.../exec`).

### Step 4: Connect to Red Book Web App
1. Open the Red Book app in your browser.
2. Go to **Settings** > **Cloud Sync & Google Sheets**.
3. Paste your **Web App URL** and enter your desired password/PIN.
4. Click **Initialize & Test Connection**.
5. All your sheets (`Children`, `GrowthMeasurements`, `Vaccinations`, `Milestones`, `HealthReviews`, etc.) will be automatically created with all headers!
