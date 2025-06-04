import { Component, OnInit } from '@angular/core';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage  {
  reports: any[] = [];

  constructor(
    private storageHandlerService: StorageHandlerService,
    private router: Router
  ) {}

  
  async ionViewWillEnter() {
        this.reports = await this.storageHandlerService.getReportHistory();
  }



  async viewReport(report: any) {
    await this.storageHandlerService.setReportFromHistory(report);
    this.router.navigateByUrl('/tabs/report');
  }

  async clearHistory() {
    await this.storageHandlerService.clearReportHistory();
    this.reports = [];
  }

  hasReports(): boolean {
  return this.reports && this.reports.length > 0;
}

}
