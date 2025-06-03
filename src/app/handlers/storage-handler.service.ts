import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageHandlerService {

  private readonly photoKey = 'user-score-photo';
  private readonly reportKey = 'report';
  private readonly historyKey = 'report-history';

  constructor() {}

  async savePhoto(photo: {
    base64: string | undefined;
    format: string;
    preview: string;
  }): Promise<void> {
    await Preferences.set({
      key: this.photoKey,
      value: JSON.stringify(photo)
    });
  }

  async getPhoto(): Promise<{
    base64: string | undefined;
    format: string;
    preview: string;
  } | null> {
    const result = await Preferences.get({ key: this.photoKey });
    return result.value ? JSON.parse(result.value) : null;
  }

  async clearPhoto(): Promise<void> {
    await Preferences.remove({ key: this.photoKey });
  }

  async saveReport(report: any): Promise<void> {
    await Preferences.set({
      key: this.reportKey,
      value: JSON.stringify(report)
    });

    const history = await this.getReportHistory();
    const newEntry = { ...report, date: new Date().toISOString() };
    history.unshift(newEntry); // ajoute en tête
    await Preferences.set({
      key: this.historyKey,
      value: JSON.stringify(history)
    });
  }

  async getReport(): Promise<any> {
    const result = await Preferences.get({ key: this.reportKey });
    return result.value ? JSON.parse(result.value) : null;
  }

  async getReportHistory(): Promise<any[]> {
    const result = await Preferences.get({ key: this.historyKey });
    return result.value ? JSON.parse(result.value) : [];
  }

  async clearReportHistory(): Promise<void> {
    await Preferences.remove({ key: this.historyKey });
  }

  async setReportFromHistory(report: any): Promise<void> {
    await Preferences.set({
      key: this.reportKey,
      value: JSON.stringify(report)
    });
  }
}
