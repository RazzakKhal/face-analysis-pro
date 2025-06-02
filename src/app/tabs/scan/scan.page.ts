import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AnalyzeApiService } from 'src/app/handlers/analyze-api.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: false
})
export class ScanPage implements OnInit {

  constructor(private analyzeApiService: AnalyzeApiService, private storageHandlerService: StorageHandlerService, private router: Router, private alertController: AlertController // ✅ Injection de AlertController
) { }

  async ngOnInit() {
    await this.makeAnalyze()

  }

  async makeAnalyze() {
    // appel api
    const photo = await this.storageHandlerService.getPhoto();
    if (photo?.base64 && photo.format) {
      this.analyzeApiService.makeAnalyze(photo.base64, photo.format).subscribe({
        next : async (response) => {
          await this.storageHandlerService.saveReport(response);
          console.log('la reponse', response)
          this.router.navigateByUrl('/tabs/report')
        }, 
        error: async (error) => {
          await this.notifyError(error);
          this.router.navigateByUrl('/tabs/takepicture')
        }
      })
    }

  }

   async notifyError(error : any) {
    let alert;

    if(error.status === 422){
      alert = await this.alertController.create({
      header: 'Analysis Failed',
      message: 'An important part of the face is not visible.',
      buttons: ['OK']
    });
    }else{
      alert = await this.alertController.create({
      header: 'Analysis Failed',
      message: 'There seems to be a problem with the remote server.',
      buttons: ['OK']
    });
    }
    await alert.present();
  }

}
