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
  report : any;

  constructor(private storageHandlerService: StorageHandlerService) { }

  async ngOnInit() {
    const report = await this.storageHandlerService.getReport();
    if (report ) {
      this.report =report;
      console.log('le rapport', report)
    }

    const mainPhoto = await this.storageHandlerService.getPhoto();
    if(mainPhoto && mainPhoto.base64){
      this.analyzedImage = `data:image/jpeg;base64,${mainPhoto.base64}`;
    }

  }

  getTierRatioMessage(tier1: number, tier2: number, tier3: number): string {
  const ratio1 = (tier1 / tier2).toFixed(2);
  const ratio3 = (tier3 / tier2).toFixed(2);

  return `We noticed that if the second tier is equal to or smaller than the others, it's generally a sign of beauty. Your ratios for this measurement are ${ratio1} : 1 : ${ratio3}.`;
}

getVerticalRatioMessage(tier1: number, tier2: number, tier3: number, tier4: number, tier5: number): string {
  const ratio1 = (tier1 / tier3).toFixed(2);
  const ratio2 = (tier2 / tier3).toFixed(2);
  const ratio3 = (tier4 / tier3).toFixed(2);
  const ratio4 = (tier5 / tier3).toFixed(2);

  return  `A balanced vertical facial ratio — where the eye width, inter-eye distance, and outer spacing align — is often seen in attractive faces. Your current proportions are ${ratio1} : ${ratio2} : 1 : ${ratio3} : ${ratio4}.`;

}

}
