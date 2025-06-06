import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhotoHandlerService {

  constructor() { }

  async getBlobFromPhoto(webPath : string){
    const response = await fetch(webPath);
    return response.blob();
  }
}
