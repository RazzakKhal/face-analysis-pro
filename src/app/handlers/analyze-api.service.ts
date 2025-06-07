import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeApiService {

  private uri = `https://khalapi.com/analyze-face/analyze`;
  private devUri = `http://localhost:5000/analyze`;


  constructor(private http: HttpClient) {

  }

  makeAnalyze(blob: Blob) {
    const formData = new FormData();
    formData.append('file', blob, `photo.jpeg`);
    return this.http.post(`${this.uri}`, formData, {
      responseType: 'blob' // ← allow to recept zip
    }).pipe(
      take(1)
    )
  }

  async getZipContent(response : any){
    const arrayBuffer = await response.arrayBuffer();
    return await JSZip.loadAsync(arrayBuffer);
  }
}
