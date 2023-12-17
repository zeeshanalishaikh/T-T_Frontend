import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLGenerator } from '../util/endpointGenerator.util';

@Injectable({
  providedIn: 'any',
})
export class DatasetService {
  constructor(
    private http: HttpClient,
    @Inject(URLGenerator)
    private urlGenerator: URLGenerator
  ) {}

  public getAll(): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'getAll');
    return this.http.get<any>(URL);
  }

  public create(fileName: string): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'create');

    return this.http.post<any>(URL, {
      fileName,
    });
  }

  public getRecords(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'getRecords', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public getSample(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'getSample', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }
}
