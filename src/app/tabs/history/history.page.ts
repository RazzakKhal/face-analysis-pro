import { Component, OnInit } from '@angular/core';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage  {
  reports: Array<{ id: string, imageUrl: string }> = [];

  constructor(
    private storageHandlerService: StorageHandlerService,
    private router: Router,
    private alertController : AlertController
  ) {}

  
  async ionViewWillEnter() {
         this.reports = await this.storageHandlerService.getReportHistory();
  }



  async viewReport(reportId: string) {
    await this.storageHandlerService.setReportFromHistory(reportId);
    this.router.navigateByUrl('/tabs/report');
  }


  async deleteReport(repordId : string){
    this.reports = await this.storageHandlerService.clearReport(repordId);
  }

  async confirmClearHistory() {
  const alert = await this.alertController.create({
    header: 'Confirmation',
    message: 'Do you want to permanently delete all analysis history?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Delete All',
        role: 'destructive',
        handler: async () => {
          await this.storageHandlerService.clearAllStorage();
          await this.storageHandlerService.clearPrincipalPhoto();
          
          this.reports = []; // mise à jour de l'affichage
        }
      }
    ]
  });

  await alert.present();
}

  hasReports(): boolean {
  return this.reports && this.reports.length > 0;
}

}
