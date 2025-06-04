import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: false
})
export class ReportPage {

  analyzedImage: string | null = null;
  report: any;
  idealRatios = {
    height_width: 1.46,
    nose_ratio: 1.618,
    nose_mouth_ratio: 1.618,
    nose_lip_menton_ratio: 1.618,
    lip_ratio: 1.618,
    eye_ratio: 3.0
  };

  constructor(private storageHandlerService: StorageHandlerService, private alertController: AlertController
) { }

  async ionViewWillEnter() {
    const report = await this.storageHandlerService.getReport();
    if (report) {
      this.report = report;
      const idealCount = this.countIdealRatios();
      const congratulation =await this.storageHandlerService.getCongratulation()
      if (idealCount >= 3 && congratulation === null) {
        this.presentCongratulationPopup();
      }
    }

    const mainPhoto = await this.storageHandlerService.getPhoto();
    if (mainPhoto && mainPhoto.base64) {
      this.analyzedImage = `data:image/jpeg;base64,${mainPhoto.base64}`;
    }
  }

  isIdeal(value: number, ideal: number): boolean {
    if (!value || !ideal) return false;
    const min = ideal * 0.80;
    const max = ideal * 1.20;
    return value >= min && value <= max;
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
    return `A balanced vertical facial ratio — where the eye width, inter-eye distance, and outer spacing align — is often seen in attractive faces. Your current proportions are ${ratio1} : ${ratio2} : 1 : ${ratio3} : ${ratio4}.`;
  }

  async presentCongratulationPopup() {
    const alert = await this.alertController.create({
      header: 'Congratulations!',
      message: 'Your facial proportions are better than the average. That’s a rare harmony!',
      buttons: ['OK']
    });

    await alert.present();
    await this.storageHandlerService.setCongratulation()
  }

  countIdealRatios(): number {
    let count = 0;
    const ratios = this.report?.ratios;
    if (!ratios) return 0;

    const checks = [
      this.isIdeal(ratios.nose_ratio, this.idealRatios.nose_ratio),
      this.isIdeal(ratios.nose_mouth_ratio, this.idealRatios.nose_mouth_ratio),
      this.isIdeal(ratios.nose_lip_menton_ratio, this.idealRatios.nose_lip_menton_ratio),
      this.isIdeal(ratios.lip_ratio, this.idealRatios.lip_ratio),
      this.isIdeal(ratios.eye_ratio, this.idealRatios.eye_ratio),
      this.isIdeal(this.report?.ratio_height_width, this.idealRatios.height_width)
    ];

    for (const isOk of checks) {
      if (isOk) count++;
    }

    return count;
  }
}
