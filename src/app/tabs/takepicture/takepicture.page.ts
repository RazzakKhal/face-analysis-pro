import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { CameraHandlerService } from 'src/app/handlers/camera-handler.service';
import { StorageHandlerService } from 'src/app/handlers/storage-handler.service';

@Component({
  selector: 'app-takepicture',
  templateUrl: './takepicture.page.html',
  styleUrls: ['./takepicture.page.scss'],
  standalone: false
})
export class TakepicturePage {
  previewUrl: string | undefined;

  constructor(private cameraHandler: CameraHandlerService, private storageHandler: StorageHandlerService) { }


  async takePhoto(action: string) {
    try {
      await this.storageHandler.clearPrincipalPhoto();
      let photo: Photo;
      if (action === 'gallery') {
        photo = await this.cameraHandler.getPhotoFromGallery();
      } else {
        photo = await this.cameraHandler.getPhotoFromCamera();
      }
      this.previewUrl = photo.webPath;
      await this.storageHandler.savePrincipalPhoto(photo);
    } catch {

    }

  }

}
