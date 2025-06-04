import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnalyzeApiService } from 'src/app/handlers/analyze-api.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';
import { Subscription } from 'rxjs';

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
    private alertController: AlertController
  ) {}

  async ionViewWillEnter() {
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
    const photo = await this.storageHandlerService.getPhoto();
    if (photo?.base64 && photo.format) {
      this.currentPhoto = photo.base64;

      const progressPromise = this.simulateProgressUntil100();

      const apiPromise = new Promise((resolve, reject) => {
        this.apiSubscription = this.analyzeApiService.makeAnalyze(photo.base64 as string, photo.format)
          .subscribe({
            next: resolve,
            error: reject
          });
      });

      try {
        const response: any = await Promise.all([progressPromise, apiPromise]).then(results => results[1]);

        if (!this.stopProgress) {
          await this.storageHandlerService.saveReport(response);
          this.router.navigateByUrl('/tabs/report');
        }
      } catch (error) {
        if (!this.stopProgress) {
          this.progress = 0;
          await this.notifyError(error);
          this.router.navigateByUrl('/tabs/takepicture');
        }
      }
    }
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
}
