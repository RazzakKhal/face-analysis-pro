import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import * as JSZip from 'jszip';
import { GlobalReport, Report, ReportImages } from '../models/interfaces/report';

@Injectable({
  providedIn: 'root'
})
export class StorageHandlerService {

  private readonly photoFile = 'photo.json';
  private readonly congratFile = 'congratulation.json';
  private readonly historyKey = 'report_history';


  constructor() { }


  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  /**
   * save photo as JSON in DATA/photo.json
   * @param photo 
   */
  async savePrincipalPhoto(photo: Photo): Promise<void> {
    await Filesystem.writeFile({
      path: this.photoFile,
      data: JSON.stringify(photo),
      directory: Directory.Data,
      encoding: Encoding.UTF8
    });
  }

  /**
   * Get the photo taken by camera or gallery and return it as string
   * @returns 
   */
  async getPrincipalPhoto(): Promise<Photo> {
    const result = await Filesystem.readFile({
      path: this.photoFile,
      directory: Directory.Data,
      encoding: Encoding.UTF8
    });
    return JSON.parse(result.data as string);

  }

  /**
   * Clear the principal photo from DATA directory
   */
  async clearPrincipalPhoto(): Promise<void> {
    try {
      await Filesystem.deleteFile({
        path: this.photoFile,
        directory: Directory.Data
      });
    } catch {
      console.warn('no principalPicture to Delete')
    }

  }

  async saveCurrentReportId(reportId: string) {
    await Preferences.set({
      key: 'currentReport',
      value: reportId
    });
  }

  /**
   * use to get the report id of the current report
   * @returns 
   */
  async getCurrentReportId() {
    return await Preferences.get({ key: 'currentReport' });
  }

  /**
   * use to get the entire JSON of the current report
   * @param reportId 
   * @returns 
   */

  async getCurrentReport(reportId: string) {
    return await Preferences.get({ key: reportId });
  }

  /**
   * use to display a photo without save it in RAM, directly from FileSystem
   * @param reportId 
   * @param filename 
   * @returns 
   */
  async getImageDataUrlFromReport(reportId: string, filename: string): Promise<string> {
    const path = `reports/${reportId}/${filename}`;
    const fileUri = await Filesystem.getUri({ path, directory: Directory.Data });


    return Capacitor.convertFileSrc(fileUri.uri);
  }

  /**
   * use to save the data in the json (ratio numbers)
   * @param reportId 
   * @param zip 
   * @returns 
   */
  async saveReportMetadata(reportId: string, zip: JSZip) {
    const file = zip.file('metadata.json');
    if (!file) return;

    const text = await file.async('text');
    await Preferences.set({
      key: reportId,
      value: text
    });

    await this.addReportIdToHistoryReport(reportId);
  }


  /**
   * 
   * @param reportId use to save all the photo with measurement
   * @param zip 
   */
  async saveReportImages(reportId: string, zip: JSZip) {
    const entries = Object.keys(zip.files);

    for (const filename of entries) {
      if (filename.endsWith('.jpg')) {
        const blob = await zip.file(filename)!.async('blob');


        await Filesystem.writeFile({
          path: `reports/${reportId}/${filename}`,
          data: await this.convertBlobToBase64(blob) as string,
          directory: Directory.Data,
          recursive: true
        });
      }
    }
  }

  async getFullReport(): Promise<any> {
    const reportId = (await this.getCurrentReportId()).value
    if(!reportId) return null;
    const report: Report = JSON.parse((await this.getCurrentReport(reportId!)).value!);
    if (!report) return null;

    const imageKeys = [
      'original',
      'eye_dims',
      'face_dims',
      'grid_horizontal',
      'grid_vertical',
      'nose_dims',
      'mouth_nose_widths',
      'nose_lip_chin',
      'lip_thickness'
    ];

    const images: Record<string, string> = {};
    for (const key of imageKeys) {
      images[key] = await this.getImageDataUrlFromReport(reportId!, `${key}.jpg`);
    }

    return { report: { ...report } as Report, images: images as unknown as ReportImages } as GlobalReport;
  }

  /**
   * add the report to the list of report in history
   * @param reportId 
   */
  async addReportIdToHistoryReport(reportId: string) {
    const history = await this.getReportHistoryIds();
    history.unshift(reportId);
    await Preferences.set({
      key: this.historyKey,
      value: JSON.stringify(history)
    });
  }

  /**
   * use to get the list that contains the history of reports
   * @returns 
   */
  async getReportHistoryIds(): Promise<string[]> {
    const { value } = await Preferences.get({ key: this.historyKey });
    return value ? JSON.parse(value) : [];
  }


  /**
   * use to get All reports (their original photo and id)
   * @returns 
   */
  async getReportHistory(): Promise<any[]> {
    const ids = await this.getReportHistoryIds();
    const history: Array<{ id: string, imageUrl: string }> = [];

    for (const id of ids) {

      let imageUrl: string;
      try {
        const path = `reports/${id}/original.jpg`;
        const fileUri = await Filesystem.getUri({ path, directory: Directory.Data });
        imageUrl = Capacitor.convertFileSrc(fileUri.uri);
      } catch (e) {
        console.warn(`⚠️ Image introuvable pour le rapport ${id}`, e);
        imageUrl = '';
      }

      history.push({ id, imageUrl });
    }

    return history;
  }


  /**
   * make a report from history as new current report
   * @param report 
   */
  async setReportFromHistory(reportId: string): Promise<void> {
    await Preferences.set({
      key: 'currentReport',
      value: reportId
    });
  }


  /**
   * delete a report from prefenrence, filesystem, and history
   * @param reportId 
   * @returns 
   */
  async clearReport(reportId: string) {
    try {
      // Supprime le report dans Preferences
      await Preferences.remove({ key: reportId });

      // Supprime les images du répertoire
      await Filesystem.rmdir({
        path: `reports/${reportId}`,
        directory: Directory.Data,
        recursive: true
      });

      // Supprime l'id du tableau d'historique
      const currentHistory = await Preferences.get({ key: 'report_history' });
      const ids = currentHistory.value ? JSON.parse(currentHistory.value) : [];
      const updated = ids.filter((id: string) => id !== reportId);
      await Preferences.set({
        key: 'report_history',
        value: JSON.stringify(updated)
      });

      return await this.getReportHistory();
    } catch (err) {
      console.error('❌ Échec suppression rapport :', err);
      return await this.getReportHistory();
    }
  }

  /**
   * clear all reports
   */
  async clearAllStorage(): Promise<void> {
  try {
    await Filesystem.rmdir({
      path: 'reports',
      directory: Directory.Data,
      recursive: true
    });
  } catch (err) {
    console.warn('Erreur lors du nettoyage du filesystem', err);
  }

  // Supprime toutes les préférences (rapports, currentReport, historique, etc.)
  try {
    await Preferences.clear();
  } catch (err) {
    console.warn('Erreur lors du nettoyage des préférences', err);
  }
}


  // async clearReportHistory(): Promise<void> {
  //   try {
  //     const { files } = await Filesystem.readdir({
  //       path: this.historyFolder,
  //       directory: Directory.Data
  //     });

  //     for (const file of files) {
  //       await Filesystem.deleteFile({
  //         path: `${this.historyFolder}/${file.name}`,
  //         directory: Directory.Data
  //       });
  //     }
  //   } catch {}
  // }

  // async setCongratulation(): Promise<void> {
  //   await Filesystem.writeFile({
  //     path: this.congratFile,
  //     data: 'present',
  //     directory: Directory.Data,
  //     encoding: 'utf8' as any
  //   });
  // }

  // async getCongratulation(): Promise<string | null> {
  //   try {
  //     const result = await Filesystem.readFile({
  //       path: this.congratFile,
  //       directory: Directory.Data,
  //       encoding: 'utf8' as any
  //     });
  //     return result.data as string;
  //   } catch {
  //     return null;
  //   }
  // }

  // async clearCongratulation(): Promise<void> {
  //   try {
  //     await Filesystem.deleteFile({
  //       path: this.congratFile,
  //       directory: Directory.Data
  //     });
  //   } catch {}
  // }
}
