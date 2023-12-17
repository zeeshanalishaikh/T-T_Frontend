import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecordsModel } from '@model/records.interface';
import { URLGenerator } from '../util/endpointGenerator.util';

@Injectable({
  providedIn: 'any',
})
export class AlgorithmService {
  constructor(
    private http: HttpClient,
    @Inject(URLGenerator)
    private urlGenerator: URLGenerator
  ) {}

  public calculateResult(
    algorithm: string,
    dataset_id: number,
    body: Partial<RecordsModel>
  ): Observable<any> {
    const URL = this.urlGenerator.fetch('algorithm', 'calculateResult', [
      { placeholder: '{algorithm}', value: algorithm },
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);
    return this.http.post<any>(URL, body);
  }
}
