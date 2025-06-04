import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class StorageHandlerService {

  private readonly photoFile = 'photo.json';
  private readonly reportFile = 'report.json';
  private readonly historyFolder = 'history';
  private readonly congratFile = 'congratulation.json';

  constructor() {}

  async savePhoto(photo: {
    base64: string | undefined;
    format: string;
    preview: string;
  }): Promise<void> {
    await Filesystem.writeFile({
      path: this.photoFile,
      data: JSON.stringify(photo),
      directory: Directory.Data,
      encoding: 'utf8' as any
    });
  }

  async getPhoto(): Promise<{
    base64: string | undefined;
    format: string;
    preview: string;
  } | null> {
    try {
      const result = await Filesystem.readFile({
        path: this.photoFile,
        directory: Directory.Data,
        encoding: 'utf8' as any
      });
      return JSON.parse(result.data as string);
    } catch {
      return null;
    }
  }

  async clearPhoto(): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: this.photoFile,
        directory: Directory.Data
      });
    } catch {}
  }

  async saveReport(report: any): Promise<void> {
     // Sauvegarde principale
  await Filesystem.writeFile({
    path: this.reportFile,
    data: JSON.stringify(report),
    directory: Directory.Data,
    encoding: 'utf8' as any

  });

  // 🔁 Charger la photo actuelle pour ajouter la preview
  const photo = await this.getPhoto();

  // Créer un nom de fichier unique pour l’historique
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const historyFileName = `${this.historyFolder}/report_${timestamp}.json`;

  const cleanPreview = (photo?.preview?.startsWith('data:image') && photo?.preview.includes(',')) 
  ? photo.preview.split(',')[1]
  : null;
  // Sauvegarde dans l’historique avec preview incluse
  await Filesystem.writeFile({
    path: historyFileName,
    data: JSON.stringify({ ...report, date: new Date().toISOString(), preview: cleanPreview }),
    directory: Directory.Data,
    recursive: true,
    encoding: 'utf8' as any

  });
  }

  async getReport(): Promise<any> {
    try {
      const result = await Filesystem.readFile({
        path: this.reportFile,
        directory: Directory.Data,
        encoding: 'utf8' as any
      });
      return JSON.parse(result.data as string);
    } catch {
      return null;
    }
  }

  async getReportHistory(): Promise<any[]> {
    try {
      const { files } = await Filesystem.readdir({
        path: this.historyFolder,
        directory: Directory.Data
      });

      const reports: any[] = [];
      for (const file of files) {
        const result = await Filesystem.readFile({
          path: `${this.historyFolder}/${file.name}`,
          directory: Directory.Data,
          encoding: 'utf8' as any
        });
        reports.push(JSON.parse(result.data as string));
      }

      return reports.sort((a, b) => (b.date || 0).localeCompare(a.date || 0));
    } catch {
      return [];
    }
  }

  async clearReportHistory(): Promise<void> {
    try {
      const { files } = await Filesystem.readdir({
        path: this.historyFolder,
        directory: Directory.Data
      });

      for (const file of files) {
        await Filesystem.deleteFile({
          path: `${this.historyFolder}/${file.name}`,
          directory: Directory.Data
        });
      }
    } catch {}
  }

  async setReportFromHistory(report: any): Promise<void> {
    await Filesystem.writeFile({
      path: this.reportFile,
      data: JSON.stringify(report),
      directory: Directory.Data,
      encoding: 'utf8' as any
    });
  }

  async setCongratulation(): Promise<void> {
    await Filesystem.writeFile({
      path: this.congratFile,
      data: 'present',
      directory: Directory.Data,
      encoding: 'utf8' as any
    });
  }

  async getCongratulation(): Promise<string | null> {
    try {
      const result = await Filesystem.readFile({
        path: this.congratFile,
        directory: Directory.Data,
        encoding: 'utf8' as any
      });
      return result.data as string;
    } catch {
      return null;
    }
  }

  async clearCongratulation(): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: this.congratFile,
        directory: Directory.Data
      });
    } catch {}
  }
}
