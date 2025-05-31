import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyzeApiService } from 'src/app/handlers/analyze-api.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: false
})
export class ScanPage implements OnInit {

  constructor(private analyzeApiService: AnalyzeApiService, private storageHandlerService: StorageHandlerService, private router: Router) { }

  async ngOnInit() {
    await this.makeAnalyze()

  }

  async makeAnalyze() {
    // appel api
    const photo = await this.storageHandlerService.getPhoto();
    if (photo?.base64 && photo.format) {
      this.analyzeApiService.makeAnalyze(photo.base64, photo.format).subscribe({
        next : (response) => {
          this.storageHandlerService.saveReport(response);
          console.log('la reponse', response)
          this.router.navigateByUrl('/tabs/report')
        }
      })
    }

  }

}
