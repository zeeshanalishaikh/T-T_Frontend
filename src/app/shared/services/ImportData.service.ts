import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class ImportDataService {
  private endpoint = `${environment.baseUrl}/file`;

  constructor(private http: HttpClient) {}

  public import(fileName: string): Observable<any> {
    const URL = `${this.endpoint}/import`;

    return this.http.post<any>(URL, {
      fileName,
    });
  }
}
