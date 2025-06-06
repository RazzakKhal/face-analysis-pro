import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeApiService {

  private uri = `https://khalapi.com/analyze-face/analyze`;

  constructor(private http: HttpClient) {

  }

  makeAnalyze(blob: Blob) {
    return this.http.post(`${this.uri}`, {
      blob
    }).pipe(
      take(1)
    )
  }
}
