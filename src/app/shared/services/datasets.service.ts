import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class DatasetService {
  private endpoint = `${environment.baseUrl}/file`;

  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    const URL = `${this.endpoint}/result/data`;
    return this.http.get<any>(URL);
  }

  public create(fileName: string): Observable<any> {
    const URL = `${this.endpoint}/import`;

    return this.http.post<any>(URL, {
      fileName,
    });
  }

  public getRecords(dataset_id: number): Observable<any> {
    const URL = `${this.endpoint}/${dataset_id}/records`;
    return this.http.get<any>(URL);
  }

  public getSample(id: number): Observable<any> {
    const URL = `${this.endpoint}/result/datadetail?id=${id}`;
    return this.http.get<any>(URL);
  }
}
