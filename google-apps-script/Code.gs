/**
 * Red Book UK — Google Apps Script Backend Web App
 * Version 1.0 (October 2026)
 *
 * Provides authenticated, private API access to a Google Sheet
 * for the Red Book UK Personal Child Health Record app.
 *
 * Tabs managed:
 * - Children
 * - GrowthMeasurements
 * - Vaccinations
 * - Milestones
 * - HealthReviews
 * - HealthEvents
 * - Medications
 * - Appointments
 * - Notes
 * - AuditLog
 * - AppConfig
 */

const SHEET_NAMES = {
  CHILDREN: 'Children',
  GROWTH: 'GrowthMeasurements',
  VACCINES: 'Vaccinations',
  MILESTONES: 'Milestones',
  REVIEWS: 'HealthReviews',
  EVENTS: 'HealthEvents',
  MEDICATIONS: 'Medications',
  APPOINTMENTS: 'Appointments',
  NOTES: 'Notes',
  AUDIT: 'AuditLog',
  CONFIG: 'AppConfig',
};

const SHEET_HEADERS = {
  Children: ['id', 'preferredName', 'dob', 'sex', 'birthWeightKg', 'birthLengthCm', 'birthHeadCircumferenceCm', 'gestationalAgeWeeks', 'birthDetails', 'localTimeZone', 'createdAt', 'updatedAt'],
  GrowthMeasurements: ['id', 'childId', 'recordType', 'recordDate', 'weightKg', 'lengthCm', 'headCircumferenceCm', 'source', 'notes', 'status', 'createdAt', 'updatedAt', 'schemaVersion'],
  Vaccinations: ['id', 'childId', 'recordType', 'recordDate', 'vaccineName', 'diseaseTarget', 'doseNumber', 'totalDoses', 'ageRecommended', 'ageRecommendedWeeks', 'status', 'givenBy', 'batchNumber', 'reaction', 'notes', 'source', 'createdAt', 'updatedAt', 'schemaVersion'],
  Milestones: ['id', 'childId', 'recordType', 'recordDate', 'category', 'title', 'description', 'ageRecommendedMonths', 'status', 'ageAchievedText', 'parentNotes', 'photoUrl', 'source', 'createdAt', 'updatedAt', 'schemaVersion'],
  HealthReviews: ['id', 'childId', 'recordType', 'recordDate', 'reviewType', 'title', 'practitioner', 'setting', 'screeningType', 'screeningOutcome', 'parentalConcerns', 'professionalAdvice', 'followUpDate', 'followUpStatus', 'notes', 'source', 'status', 'createdAt', 'updatedAt', 'schemaVersion'],
  HealthEvents: ['id', 'childId', 'recordType', 'startDate', 'endDate', 'eventType', 'title', 'symptoms', 'temperatureCelsius', 'temperatureMethod', 'medicinesJson', 'professionalContacted', 'outcome', 'notes', 'status', 'createdAt', 'updatedAt', 'schemaVersion'],
  Appointments: ['id', 'childId', 'recordType', 'date', 'time', 'appointmentType', 'title', 'location', 'practitioner', 'questionsJson', 'followUpActionsJson', 'appointmentStatus', 'notes', 'status', 'createdAt', 'updatedAt', 'schemaVersion'],
  Notes: ['id', 'childId', 'recordType', 'recordDate', 'category', 'title', 'content', 'tagsJson', 'status', 'createdAt', 'updatedAt', 'schemaVersion'],
  AuditLog: ['id', 'timestamp', 'action', 'recordType', 'recordId', 'clientIp', 'details'],
  AppConfig: ['key', 'value', 'updatedAt'],
};

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  const lock = LockService.getScriptLock();
  try {
    // Acquire lock for up to 30s to prevent concurrent write collisions
    lock.waitLock(30000);

    let params = {};
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        return jsonResponse({ success: false, error: 'Invalid JSON body' });
      }
    } else if (e && e.parameter) {
      params = e.parameter;
    }

    const action = params.action || (e && e.parameter && e.parameter.action);

    // Initial setup endpoint to initialize sheet tabs and set master PIN/password
    if (action === 'initialize') {
      return initializeSheets(params);
    }

    // Authentication check
    if (action === 'login') {
      return handleLogin(params);
    }

    // Require token or password for all subsequent actions
    if (!verifyAuth(params)) {
      return jsonResponse({ success: false, error: 'Unauthorized: Invalid token or password' }, 401);
    }

    switch (action) {
      case 'getBootstrap':
        return handleGetBootstrap(params);
      case 'syncChanges':
        return handleSyncChanges(params);
      case 'exportData':
        return handleExportData(params);
      case 'restoreData':
        return handleRestoreData(params);
      case 'ping':
        return jsonResponse({ success: true, message: 'Red Book Backend connected successfully' });
      default:
        return jsonResponse({ success: false, error: 'Unknown action: ' + action });
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function verifyAuth(params) {
  const scriptProps = PropertiesService.getScriptProperties();
  const storedPassword = scriptProps.getProperty('MASTER_PASSWORD');
  
  // If no password set yet, default to allowing setup or initial test
  if (!storedPassword) return true;

  const providedPass = params.password || params.token;
  return providedPass === storedPassword;
}

function handleLogin(params) {
  const scriptProps = PropertiesService.getScriptProperties();
  let stored = scriptProps.getProperty('MASTER_PASSWORD');
  
  if (!stored) {
    // Set initial password if not configured
    stored = params.password || '1234';
    scriptProps.setProperty('MASTER_PASSWORD', stored);
  }

  if (params.password === stored) {
    return jsonResponse({
      success: true,
      token: stored, // In simple MVP, use validated session token
      message: 'Authenticated successfully',
    });
  } else {
    return jsonResponse({ success: false, error: 'Incorrect credentials' }, 401);
  }
}

function initializeSheets(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create all required sheets if not existing
  Object.keys(SHEET_HEADERS).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    // Check if headers exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS[sheetName]);
      sheet.getRange(1, 1, 1, SHEET_HEADERS[sheetName].length).setFontWeight('bold');
    }
  });

  if (params.newPassword) {
    PropertiesService.getScriptProperties().setProperty('MASTER_PASSWORD', params.newPassword);
  }

  return jsonResponse({
    success: true,
    message: 'All Red Book Google Sheet tabs initialized with correct schemas.',
  });
}

function handleGetBootstrap(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {
    profile: null,
    records: [],
  };

  // Get Child Profile
  const childSheet = ss.getSheetByName(SHEET_NAMES.CHILDREN);
  if (childSheet && childSheet.getLastRow() > 1) {
    const data = childSheet.getDataRange().getValues();
    const headers = data[0];
    const row = data[1]; // first child
    const child = {};
    headers.forEach((h, i) => { child[h] = row[i]; });
    result.profile = child;
  }

  // Get all records across sheets
  const recordSheets = [
    SHEET_NAMES.GROWTH,
    SHEET_NAMES.VACCINES,
    SHEET_NAMES.MILESTONES,
    SHEET_NAMES.REVIEWS,
    SHEET_NAMES.EVENTS,
    SHEET_NAMES.APPOINTMENTS,
    SHEET_NAMES.NOTES,
  ];

  recordSheets.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      for (let r = 1; r < data.length; r++) {
        const item = {};
        headers.forEach((h, i) => {
          let val = data[r][i];
          if (h.endsWith('Json') && typeof val === 'string') {
            try { val = JSON.parse(val); } catch(e){}
          }
          item[h] = val;
        });
        if (item.status !== 'deleted') {
          result.records.push(item);
        }
      }
    }
  });

  return jsonResponse({ success: true, data: result });
}

function handleSyncChanges(params) {
  const operations = params.operations || [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const processed = [];

  operations.forEach(op => {
    const sheetName = getSheetNameForRecordType(op.recordType);
    if (!sheetName) return;

    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(SHEET_HEADERS[sheetName] || ['id', 'data']);
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(op.recordId)) {
        rowIndex = i + 1; // 1-indexed row in sheet
        break;
      }
    }

    if (op.operation === 'delete') {
      if (rowIndex > 0) {
        // Soft delete: update status column if exists
        const statusCol = headers.indexOf('status') + 1;
        if (statusCol > 0) {
          sheet.getRange(rowIndex, statusCol).setValue('deleted');
        } else {
          sheet.deleteRow(rowIndex);
        }
      }
    } else {
      // Create or update
      const rowValues = headers.map(h => {
        let val = op.payload[h];
        if (h.endsWith('Json') && typeof val === 'object') {
          val = JSON.stringify(val);
        }
        return val !== undefined ? val : '';
      });

      if (rowIndex > 0) {
        // Update row
        sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);
      } else {
        // Append row
        sheet.appendRow(rowValues);
      }
    }

    processed.push(op.id);
  });

  return jsonResponse({
    success: true,
    processedIds: processed,
    timestamp: new Date().toISOString(),
  });
}

function getSheetNameForRecordType(recordType) {
  switch (recordType) {
    case 'growth': return SHEET_NAMES.GROWTH;
    case 'vaccination': return SHEET_NAMES.VACCINES;
    case 'milestone': return SHEET_NAMES.MILESTONES;
    case 'health_review': return SHEET_NAMES.REVIEWS;
    case 'health_event': return SHEET_NAMES.EVENTS;
    case 'appointment': return SHEET_NAMES.APPOINTMENTS;
    case 'note': return SHEET_NAMES.NOTES;
    default: return null;
  }
}

function jsonResponse(obj, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
