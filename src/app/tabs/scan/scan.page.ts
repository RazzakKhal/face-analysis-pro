import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnalyzeApiService } from 'src/app/handlers/analyze-api.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';
import { forkJoin, interval, Observable, Subscription, takeWhile, tap } from 'rxjs';
import { PhotoHandlerService } from 'src/app/handlers/photo-handler.service';
import { PaymentService } from 'src/app/handlers/payment.service';

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
  private progressSubscription? : Subscription

  constructor(
    private analyzeApiService: AnalyzeApiService,
    private storageHandlerService: StorageHandlerService,
    private router: Router,
    private alertController: AlertController,
    private photoHandlerService: PhotoHandlerService,
    private paymentService : PaymentService,
    private storageHandler : StorageHandlerService
  ) { }

  async ionViewWillEnter() {
    await this.makeAnalyze();
  }

  ionViewWillLeave() {

    this.progressSubscription?.unsubscribe();
    this.progress = 0;
    this.currentPhoto = null;
  }

  simulateProgressUntil100() {
  this.progress = 0;

  return interval(200).pipe(
    takeWhile(() => this.progress < 99),
    tap(() => {
      const increment = this.progress < 90
        ? Math.floor(Math.random() * 8) + 1
        : 1;

      this.progress += increment;
    })
  );
  }

  async makeAnalyze() {
    const isPremium = await this.paymentService.checkPremium();
    if (!isPremium) {
        this.paymentService.isCustomerSubject.next(false)
    } 
    await this.storageHandlerService.clearCongratulation()
    const photo = await this.storageHandlerService.getPrincipalPhoto();
    if (!photo) {
      console.warn('📷 No valid photo found, skipping analysis.');
      return;
    }

    this.currentPhoto = photo.webPath;
    const progress$ = this.simulateProgressUntil100();
    const api$ = this.getReportFromApi(photo.webPath!);

    forkJoin([progress$, api$]).subscribe({
      next: async () => {
          this.router.navigateByUrl('/tabs/report');
      },
      error: async (err) => {
          this.progress = 0;
          await this.notifyError(err);
          this.router.navigateByUrl('/tabs/takepicture');
      },
      complete: async () => {
          await this.storageHandler.clearPrincipalPhoto();

      }
    });


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

  /**
   * observable that contains the logical for the report process
   * @param webPath 
   * @returns 
   */
   getReportFromApi(webPath: string) {
    return new Observable(observer => {
    this.photoHandlerService.getBlobFromPhoto(webPath).then(blob => {
      this.analyzeApiService.makeAnalyze(blob).subscribe({
        next: async (response) => {
          const zip = await this.analyzeApiService.getZipContent(response);
          const reportId = `report_${Date.now()}`;
          await this.storageHandlerService.saveReportMetadata(reportId, zip);
          await this.storageHandlerService.saveReportImages(reportId, zip);
          await this.storageHandlerService.saveCurrentReportId(reportId);
          observer.next(undefined);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  });
  }
}
