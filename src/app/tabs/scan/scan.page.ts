import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnalyzeApiService } from 'src/app/handlers/analyze-api.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';
import { Subscription } from 'rxjs';
import { PhotoHandlerService } from 'src/app/handlers/photo-handler.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: false
})
export class ScanPage {

  currentPhoto: any;
  progress = 0;
  loadingDone = false;
  private apiSubscription?: Subscription;
  private stopProgress = false;

  constructor(
    private analyzeApiService: AnalyzeApiService,
    private storageHandlerService: StorageHandlerService,
    private router: Router,
    private alertController: AlertController,
    private photoHandlerService: PhotoHandlerService
  ) { }

  async ionViewWillEnter() {
    this.stopProgress = false;
    await this.makeAnalyze();
  }

  ionViewWillLeave() {
    this.stopProgress = true;
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    this.progress = 0;
    this.currentPhoto = null;
  }

  async simulateProgressUntil100(): Promise<void> {
    this.progress = 0;
    while (this.progress < 99 && !this.stopProgress) {
      const increment = this.progress < 90
        ? Math.floor(Math.random() * 8) + 1
        : Math.floor(Math.random() * 2) + 1;

      const delay = Math.floor(Math.random() * 150) + 150;
      await new Promise(resolve => setTimeout(resolve, delay));
      this.progress = Math.min(this.progress + increment, 99);
    }

    if (!this.stopProgress) {
      await new Promise(resolve => setTimeout(resolve, 300));
      this.progress = 100;
    }
  }

  async makeAnalyze() {
    // await this.deleteCongratulationIfExist();
    const photo = await this.storageHandlerService.getPrincipalPhoto();
    if (!photo) {
      console.warn('📷 No valid photo found, skipping analysis.');
      return;
    }

    this.currentPhoto = photo.webPath;
    const report = await this.getReportFromApi(photo.webPath!)

    // const progressPromise = this.simulateProgressUntil100();


    // try {
    //   const [_, response]: any = await Promise.all([progressPromise, apiPromise]);

    //   // Si l'utilisateur a quitté la page pendant l'attente, on ne fait rien
    //   if (this.stopProgress) {
    //     console.log('⏹️ Analysis aborted due to page leave.');
    //     return;
    //   }

    //   try {
    //     console.log('💾 Saving analysis result...');
    //     await this.storageHandlerService.saveReport(response);
    //   } catch (saveErr) {
    //     console.error('❌ Failed to save report:', saveErr);
    //     throw new Error('Error saving analysis report');
    //   }

    //   this.router.navigateByUrl('/tabs/report');

    // } catch (error) {
    //   if (this.stopProgress) {
    //     console.log('⏹️ Error ignored because user left the page:', error);
    //     return;
    //   }

    //   console.error('❌ Caught error during analysis flow:', error);
    //   this.progress = 0;
    //   await this.notifyError(error);
    //   this.router.navigateByUrl('/tabs/takepicture');
    // }
  }

  async notifyError(error: any) {
    const alert = await this.alertController.create({
      header: 'Analysis Failed',
      message: error.status === 422
        ? 'An important part of the face is not visible.'
        : 'There seems to be a problem with the remote server.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async deleteCongratulationIfExist() {
    //  const congra = await this.storageHandlerService.getCongratulation()
    //  if(congra !== null){
    //   await this.storageHandlerService.clearCongratulation();
    //  }
  }

  async getReportFromApi(webPath: string) {
    const blob = await this.photoHandlerService.getBlobFromPhoto(webPath)
    this.analyzeApiService.makeAnalyze(blob).subscribe({
      next: async (response) => {
        const zip = await this.analyzeApiService.getZipContent(response);
        const reportId = `report_${Date.now()}`;
        await this.storageHandlerService.saveReportMetadata(reportId, zip);
        await this.storageHandlerService.saveReportImages(reportId, zip);
        await this.storageHandlerService.saveCurrentReportId(reportId);
        this.router.navigateByUrl('/tabs/report');

      },
      error: (error) => { console.log("l'erreur est : ", error) },
      complete: () => { }
    })
  }
}
