import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreAiApiService {

  constructor(private http : HttpClient) { }

  sendPhotoToBackend(imageBlob: Blob) {
    const formData = new FormData();
    formData.append('image', imageBlob, 'photo.jpg');

    return this.http.post('http://<IP>:5000/analyze', formData);
  }
  
}
