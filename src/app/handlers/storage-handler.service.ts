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
  private readonly reportFile = 'report.json';
  private readonly historyFolder = 'history';
  private readonly congratFile = 'congratulation.json';

  constructor() { }


  private async readAsBase64(blob : Blob) {

    return await this.convertBlobToBase64(blob) as string;
  }

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
    console.log('image avant : ', (fileUri.uri));
    console.log('image apres : ', Capacitor.convertFileSrc(fileUri.uri));

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
    const report: Report = JSON.parse((await this.getCurrentReport(reportId!)).value!);
    console.log('le rapport : ', report)
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

    console.log('les images : ', images)
    return { report: { ...report } as Report, images: images as unknown as ReportImages } as GlobalReport;
  }



  // async getReportHistory(): Promise<any[]> {
  //   try {
  //     const { files } = await Filesystem.readdir({
  //       path: this.historyFolder,
  //       directory: Directory.Data
  //     });

  //     const reports: any[] = [];
  //     for (const file of files) {
  //       const result = await Filesystem.readFile({
  //         path: `${this.historyFolder}/${file.name}`,
  //         directory: Directory.Data,
  //         encoding: 'utf8' as any
  //       });
  //       reports.push(JSON.parse(result.data as string));
  //     }

  //     return reports.sort((a, b) => (b.date || 0).localeCompare(a.date || 0));
  //   } catch {
  //     return [];
  //   }
  // }

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

  // async setReportFromHistory(report: any): Promise<void> {
  //   await Filesystem.writeFile({
  //     path: this.reportFile,
  //     data: JSON.stringify(report),
  //     directory: Directory.Data,
  //     encoding: 'utf8' as any
  //   });
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
