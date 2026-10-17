import { db } from './db';
import { OutboxItem } from '../types';

export interface SyncResult {
  success: boolean;
  message: string;
  processedCount: number;
  timestamp: string;
}

export class ApiClient {
  async testConnection(url: string, password?: string): Promise<{ success: boolean; message: string }> {
    if (!url || !url.startsWith('http')) {
      return { success: false, message: 'Invalid URL provided' };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'ping',
          password: password || '',
        }),
      });

      const data = await response.json();
      if (data.success) {
        return { success: true, message: data.message || 'Connected successfully!' };
      } else {
        return { success: false, message: data.error || 'Connection failed' };
      }
    } catch (e: any) {
      return { success: false, message: 'Network or CORS error: ' + (e.message || 'Could not reach server') };
    }
  }

  async initializeRemoteSheet(url: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'initialize',
          newPassword: newPassword || '1234',
        }),
      });
      const data = await response.json();
      return {
        success: data.success,
        message: data.message || (data.success ? 'Spreadsheet initialized' : data.error),
      };
    } catch (e: any) {
      return { success: false, message: 'Failed to initialize sheet: ' + e.message };
    }
  }

  async syncOutbox(): Promise<SyncResult> {
    const config = await db.getConfig();
    const url = config.backend.googleScriptUrl;
    const password = config.backend.googleScriptPassword;

    if (!url) {
      return {
        success: true,
        message: 'Local mode: no remote backend configured',
        processedCount: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const outbox: OutboxItem[] = await db.getOutbox();
    if (outbox.length === 0) {
      return {
        success: true,
        message: 'Everything is up to date',
        processedCount: 0,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'syncChanges',
          password,
          operations: outbox,
        }),
      });

      const result = await response.json();
      if (result.success && Array.isArray(result.processedIds)) {
        for (const id of result.processedIds) {
          await db.removeFromOutbox(id);
        }
        return {
          success: true,
          message: `Synced ${result.processedIds.length} changes to Google Sheets`,
          processedCount: result.processedIds.length,
          timestamp: result.timestamp || new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to sync with Google Sheets',
          processedCount: 0,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: 'Sync offline or network failure: ' + e.message,
        processedCount: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const api = new ApiClient();
