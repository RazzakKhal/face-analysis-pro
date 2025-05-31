import { Component, OnInit } from '@angular/core';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: false
})
export class ReportPage implements OnInit {

  analyzedImage: string | null = null; // <--- variable liée à l'image

  constructor(private storageHandlerService: StorageHandlerService) { }

  async ngOnInit() {
    const report = await this.storageHandlerService.getReport();
    if (report && report.image_base64) {
      this.analyzedImage = `data:image/jpeg;base64,${report.image_base64}`;
    }
  }

}
