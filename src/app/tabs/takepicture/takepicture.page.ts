import { Component, OnInit } from '@angular/core';
import { CameraHandlerService } from 'src/app/handlers/camera-handler.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';

@Component({
  selector: 'app-takepicture',
  templateUrl: './takepicture.page.html',
  styleUrls: ['./takepicture.page.scss'],
  standalone: false
})
export class TakepicturePage implements OnInit {
  previewUrl: string | null = null;


  constructor(private cameraHandler: CameraHandlerService, private storageHandler : StorageHandlerService) { }

  ngOnInit() {
  }

  async getPhoto(action: string){
    let photo : any;
    if(action === 'gallery'){
      photo = await this.cameraHandler.getPhoto();
    }else{
      photo = await this.cameraHandler.getGalleryPhoto();
    }
    this.previewUrl = photo.preview; // Pour l’affichage immédiat
    this.storageHandler.savePhoto(photo);
  }

}
