import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class AlgorithmService {
  private endpoint = `${environment.baseUrl}/algo`;

  constructor(private http: HttpClient) {}

  public calculateResult(algorithm: string, dataset_id: number, body: any): Observable<any> {
    const URL = `${this.endpoint}/${algorithm}?_id=${dataset_id}`;
    return this.http.post<any>(URL, body);
  }
}
