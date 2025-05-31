import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeApiService {

  private port = '5000'
    private uri = `http://localhost:${this.port}/analyze`;

  constructor(private http: HttpClient) {

   }

   makeAnalyze(image_base64 : string, format: string){
    return this.http.post(`${this.uri}`, {
      image_base64,
      format
    }).pipe(
      take(1)
    )
   }
}
