import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CameraHandlerService } from 'src/app/handlers/camera-handler.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';

@Component({
  selector: 'app-takepicture',
  templateUrl: './takepicture.page.html',
  styleUrls: ['./takepicture.page.scss'],
  standalone: false
})
export class TakepicturePage  {
  previewUrl: string | null = null;

  constructor(private cameraHandler: CameraHandlerService, private storageHandler : StorageHandlerService) { }

  
  async takePhoto(action: string){
    await this.storageHandler.clearPhoto();
    let photo : any;
    if(action === 'gallery'){
      photo = await this.cameraHandler.getGalleryPhoto();
    }else{
      photo = await this.cameraHandler.getPhoto();
    }
    this.previewUrl = photo.preview; // Pour l’affichage immédiat
    await this.storageHandler.savePhoto(photo);
  }

}
