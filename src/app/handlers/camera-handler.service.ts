import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraHandlerService {

  constructor() { }

  async getPhoto() {
    const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera
  });

  return {
    base64: photo.base64String,
    format: photo.format || 'jpeg',
    preview: `data:image/${photo.format};base64,${photo.base64String}`
  };
  }

  async getGalleryPhoto() {
    const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Photos
  });

  return {
    base64: photo.base64String,
    format: photo.format || 'jpeg',
    preview: `data:image/${photo.format};base64,${photo.base64String}`
  };
  }
}
