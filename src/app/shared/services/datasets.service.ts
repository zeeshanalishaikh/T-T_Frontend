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

  public checkStates(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkStates', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public checkNullCount(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkNullCount', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public checkTransposeNum(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkTransposeNum', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public checkTransposeCat(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkTransposeCat', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public checkMissingData(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkMissingData', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public checkPairPlot(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkPairPlot', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }
  
  public checkAllRatio(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkAllRatio', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public checkOutLayerValue(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkOutLayerValue', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public checkCorrelationValue(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkCorrelationValue', [
      { placeholder: '{dataset_id}', value: dataset_id },
    ]);

    return this.http.get<any>(URL);
  }

  public performEdaColumWise(dataset_id: number, column: string): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'performEdaColumWise', [
      { placeholder: '{dataset_id}', value: dataset_id },
      { placeholder: '{column}', value: column },
    ]);

    return this.http.get<any>(URL);
  }

  public checkRatio(dataset_id: number, columnOne: string, columnTwo: string): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkRatio', [
      { placeholder: '{dataset_id}', value: dataset_id },
      { placeholder: '{columnOne}', value: columnOne },
      { placeholder: '{columnTwo}', value: columnTwo },
    ]);

    return this.http.get<any>(URL);
  }

  public checkMatrix(dataset_id: number): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkMatrix', [
      { placeholder: '{dataset_id}', value: dataset_id }
    ]);

    return this.http.get<any>(URL);
  }

  public checkError(dataset_id: number, columnOne: string, columnTwo: string): Observable<any> {
    const URL = this.urlGenerator.fetch('dataset', 'checkError', [
      { placeholder: '{dataset_id}', value: dataset_id },
      { placeholder: '{columnOne}', value: columnOne },
      { placeholder: '{columnTwo}', value: columnTwo },
    ]);

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
