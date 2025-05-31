import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class StorageHandlerService {

  private readonly photoKey = 'user-score-photo';
  private readonly report = 'report';

  constructor() { }

  async savePhoto(photo: {
    base64: string | undefined;
    format: string;
    preview: string;
  }
  ): Promise<void> {
    try {
      await Preferences.set({
        key: this.photoKey,
        value: JSON.stringify(photo)
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la photo:', error);
    }
  }

  async getPhoto(): Promise<{
    base64: string | undefined;
    format: string;
    preview: string;
  } | null> {
    try {
      const result = await Preferences.get({ key: this.photoKey });
      return result.value ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la photo:', error);
      return null;
    }
  }

  async clearPhoto(): Promise<void> {
    try {
      await Preferences.remove({ key: this.photoKey });
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
    }
  }

  async saveReport(report : any
  ): Promise<void> {
    try {
      await Preferences.set({
        key: this.report,
        value: JSON.stringify(report)
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du rapport:', error);
    }
  }

    async getReport(): Promise<any> {
    try {
      const result = await Preferences.get({ key: this.report });
      return result.value ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport:', error);
      return null;
    }
  }
}
