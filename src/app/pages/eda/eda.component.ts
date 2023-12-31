import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Signal,
  computed,
  signal,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  TuiRootModule,
  TuiScrollbarModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiButtonModule,
  TuiDropdownModule,
  TuiDialogModule,
  TuiAlertService,
  TuiLinkModule,
  TuiGroupModule,
  TuiErrorModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiBreadcrumbsModule,
  TuiFieldErrorPipeModule,
  TuiStepperModule,
  TuiInputModule,
  TuiRadioModule,
  TuiRadioBlockModule,
  TuiInputNumberModule,
  TuiInputDateModule,
  TuiDataListWrapperModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { combineLatest } from 'rxjs';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';

import { DatasetService } from '@service/datasets.service';
import {
  DatasetDetailModel,
  DatasetNullCountModel,
  DatasetTransposeCategoricalModel,
  DatasetTransposeNumericalModel,
  DatasetsModel,
} from '@model/dataset.interface';

const angularImports = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
];

const TaigaImports = [
  // CORE
  TuiRootModule,
  TuiScrollbarModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiButtonModule,
  TuiDropdownModule,
  TuiDialogModule,
  TuiLinkModule,
  TuiGroupModule,
  TuiErrorModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
  // KIT
  TuiFieldErrorPipeModule,
  TuiBreadcrumbsModule,
  TuiStepperModule,
  TuiInputModule,
  TuiRadioModule,
  TuiRadioBlockModule,
  TuiInputNumberModule,
  TuiInputDateModule,
  TuiDataListWrapperModule,
  TuiSelectModule,
];

@Component({
  selector: 'app-eda',
  standalone: true,
  imports: [...angularImports, NgxEchartsDirective, ...TaigaImports],
  template: ` <div class="analytic">
    <div class="container">
      <div
        class="py-3 px-4 my-3"
        style="background-color: #fff; border-radius: 20px;"
      >
        <div class="row pb-2">
          <div class="col d-flex align-items-center">
            <a
              tuiButton
              size="xs"
              routerLink="/home"
              icon="tuiIconChevronLeft"
              style="margin-right: 10px;"
            >
            </a>
            <tui-breadcrumbs>
              <ng-container>
                <a *tuiItem tuiLink routerLink="" icon="tuiIconHome"> </a>
              </ng-container>
              @for(item of breadcrumbs; track item.caption) {
              <ng-container>
                <a *tuiItem tuiLink [routerLink]="item.routerLink">
                  {{ item.caption }}
                </a>
              </ng-container>
              }
            </tui-breadcrumbs>
          </div>
        </div>
        <div class="row pb-2 justify-content-between">
          <div class="col-3">
            <h1 class="tui-text_h4 mb-3 mt-2">Exploratory Data Analysis</h1>
            <span
              class="tui-text_body-xl"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              On different Algorithms
            </span>
            <br />
            <span
              class="tui-text_body-s pb-4"
              style="color: var(--tui-text-03);"
            >
              Browse and view..
            </span>
          </div>
          <div class="col-2 d-flex justify-content-end">
            <img src="assets/img/logo.png" style="height: 100px;" />
          </div>
        </div>
        <div class="row justify-content-center py-4">
          <div class="col-6">
            <tui-stepper
              [(activeItemIndex)]="activeTab"
              class=" d-flex justify-content-evenly"
            >
              <button tuiStep>
                <div style="text-align: left;">
                  <div>Pick Dataset</div>
                  @if(activeTab > 0){
                  <div>
                    <strong>Selected: </strong>
                    {{ datasetController.value }}
                  </div>
                  }
                </div>
              </button>
              <button tuiStep [disabled]="activeTab <= 0">More Details</button>
              <button tuiStep [disabled]="activeTab <= 0">Column wise</button>
            </tui-stepper>
          </div>
        </div>
        @if(activeTab == 0){
        <div class="row justify-content-center py-4">
          <div class="col-4">
            <form>
              <tui-select [formControl]="datasetController">
                Dataset
                <input tuiTextfield placeholder="Choose a file" />
                <tui-data-list-wrapper
                  *tuiDataList
                  [items]="DTNameList()"
                ></tui-data-list-wrapper>
              </tui-select>
            </form>
          </div>
          <div class="col-1">
            <button
              tuiButton
              appearance="secondary"
              size="m"
              class="m-1"
              [disabled]="!datasetController.value"
              [showLoader]="showDTStatesLoader()"
              (click)="onDTSelect()"
            >
              Select
            </button>
          </div>
          <div class="col-2">
            <button
              tuiButton
              appearance="secondary-destructive"
              size="m"
              class="m-1"
              [disabled]="!enableMoreDetails()"
              [showLoader]="showMoreDetailsLoader()"
              (click)="onMoreDetails()"
            >
              More Details
            </button>
          </div>
        </div>
        @if(showDatasetStates()){
        <hr />
        <div class="row justify-content-center py-2">
          <div class="col-4">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Dataset Statistic's
            </p>
          </div>
          <div class="col-4">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Null Count
            </p>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-4">
            <tui-scrollbar>
              <div style="height: 400px;">
                <table class="tui-table">
                  <tbody>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Average record size in memory
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Average record size in memory'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Duplicate rows
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Duplicate rows'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Duplicate rows( %)
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Duplicate rows( %)'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Missing cells
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Missing cells'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Missing cells (%)
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Missing cells (%)'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Number of observations
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Number of observations'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Number of variables
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Number of variables'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">Numeric</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Numeric'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        Total size in memory
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['Total size in memory'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">boolean</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['boolean'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">categorical</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ datasetStates()['categorical'] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </tui-scrollbar>
          </div>
          <div class="col-4">
            <tui-scrollbar>
              <div style="height: 400px;">
                <table class="tui-table">
                  <tbody>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">age</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['age'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">al</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['al'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">ane</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['ane'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">appet</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['appet'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">ba</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['ba'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">bgr</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['bgr'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">bp</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['bp'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">bu</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['bu'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">cad</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['cad'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">
                        classification
                      </td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['classification'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">dm</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['dm'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">hemo</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['hemo'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">htn</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['htn'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">pc</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['pc'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">pcc</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['pcc'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">pcv</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['pcv'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">pe</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['pe'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">pot</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['pot'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">rbc</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['rbc'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">rc</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['rc'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">sc</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['sc'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">sg</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['sg'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">sod</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['sod'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">su</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['su'] }}
                      </td>
                    </tr>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">wc</td>
                      <td class="tui-table__td tui-text_body-s">
                        {{ nullCount()['wc'] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </tui-scrollbar>
          </div>
        </div>
        } } @else if(activeTab == 1) {
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Missing Data
            </p>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <tui-loader [showLoader]="showMissingDataLoader" [overlay]="true">
            <div class="col-12">
              <div echarts [options]="MissingData()"></div>
            </div>
          </tui-loader>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Correlation Heatmap
            </p>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <tui-loader [showLoader]="showCorrelationLoader" [overlay]="true">
            <div class="col-12">
              <div echarts [options]="correlationData()"></div>
            </div>
          </tui-loader>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Transpose Numerical
            </p>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-11">
            <tui-loader [showLoader]="showTransposeNumLoader" [overlay]="true">
              @if(!showTransposeNumLoader){
              <tui-scrollbar>
                <div style="height: 400px;">
                  <table class="tui-table">
                    <tbody>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__th tui-text_body-s">Columns</td>
                        <td class="tui-table__th tui-text_body-s">25%</td>
                        <td class="tui-table__th tui-text_body-s">50%</td>
                        <td class="tui-table__th tui-text_body-s">75%</td>
                        <td class="tui-table__th tui-text_body-s">Count</td>
                        <td class="tui-table__th tui-text_body-s">Max</td>
                        <td class="tui-table__th tui-text_body-s">Mean</td>
                        <td class="tui-table__th tui-text_body-s">Min</td>
                        <td class="tui-table__th tui-text_body-s">Missing</td>
                        <td class="tui-table__th tui-text_body-s">Std</td>
                        <td class="tui-table__th tui-text_body-s">Variance</td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Age</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['age']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Al</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['al']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Bgr</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bgr']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Bp</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bp']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Bu</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['bu']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Hemo</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['hemo']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Pcv</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pcv']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Pot</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['pot']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Rc</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['rc']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Sc</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sc']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Sg</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sg']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Sod</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['sod']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Su</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['su']!['Variance'] }}
                        </td>
                      </tr>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td tui-text_body-s">Wc</td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['25%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['50%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['75%'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['Count'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['Max'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['Mean'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['Min'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['Missing'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['Std'] }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ transposeNum()['wc']!['Variance'] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </tui-scrollbar>
              }
            </tui-loader>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              OutLair Value
            </p>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <tui-loader [showLoader]="showOutLayerLoader" [overlay]="true">
              <div echarts [options]="outLayerData()"></div>
            </tui-loader>
          </div>
        </div>
        <div class="row justify-content-center py-4">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Transpose Categorical
            </p>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-11">
            <tui-loader [showLoader]="showTransposeCatLoader" [overlay]="true">
              @if(!showTransposeCatLoader){
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Columns</td>
                    <td class="tui-table__th tui-text_body-s">ane</td>
                    <td class="tui-table__th tui-text_body-s">appet</td>
                    <td class="tui-table__th tui-text_body-s">ba</td>
                    <td class="tui-table__th tui-text_body-s">cad</td>
                    <td class="tui-table__th tui-text_body-s">dm</td>
                    <td class="tui-table__th tui-text_body-s">htn</td>
                    <td class="tui-table__th tui-text_body-s">pc</td>
                    <td class="tui-table__th tui-text_body-s">pcc</td>
                    <td class="tui-table__th tui-text_body-s">pe</td>
                    <td class="tui-table__th tui-text_body-s">rbc</td>
                    <td class="tui-table__th tui-text_body-s">
                      classification
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">Count</td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['ane'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['appet'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['ba'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['cad'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['dm'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['htn'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['pc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['pcc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['pe'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['rbc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['count']!['classification'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">Freq</td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['ane'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['appet'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['ba'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['cad'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['dm'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['htn'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['pc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['pcc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['pe'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['rbc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['freq']!['classification'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">Top</td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['ane'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['appet'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['ba'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['cad'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['dm'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['htn'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['pc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['pcc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['pe'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['rbc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['top']!['classification'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">Unique</td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['ane'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['appet'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['ba'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['cad'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['dm'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['htn'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['pc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['pcc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['pe'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['rbc'] }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ transposeCat()['unique']!['classification'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
              }
            </tui-loader>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Pair Plot
            </p>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <tui-loader [showLoader]="showPairPlotLoader" [overlay]="true">
              <div echarts [options]="PairPlotData()"></div>
            </tui-loader>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              All Ratio
            </p>
          </div>
        </div>
        <tui-loader [showLoader]="showAllRatioLoader" [overlay]="true">
          @if(!showAllRatioLoader){
          <div class="row justify-content-center py-2">
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Age</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['age']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['age']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['age']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['age']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Al</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['al']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['al']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['al']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['al']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Bgr</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bgr']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bgr']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bgr']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bgr']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Bp</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bp']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bp']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bp']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bp']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Bu</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bu']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bu']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bu']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['bu']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Hemo</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['hemo']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['hemo']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['hemo']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['hemo']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Pcv</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pcv']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pcv']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pcv']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pcv']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Pot</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pot']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pot']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pot']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['pot']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <div class="row justify-content-center py-2">
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Rc</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['rc']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['rc']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['rc']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['rc']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Sc</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sc']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sc']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sc']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sc']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Sg</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sg']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sg']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sg']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sg']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Sod</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sod']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sod']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sod']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['sod']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Su</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['su']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['su']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['su']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['su']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-1">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">Wc</td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['wc']['0'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['wc']['1'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['wc']['2'] }}
                    </td>
                  </tr>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ allRatio()['wc']['3'] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          }
        </tui-loader>
        <div class="row justify-content-center pt-4 pb-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Matrix
            </p>
          </div>
        </div>
        <tui-loader [showLoader]="showMatrixLoader" [overlay]="true">
          @if(ROCCurveValueData().length && ROCCurveValueData().length){
          <div class="row justify-content-center py-2">
            <div class="col-3">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">
                      Confusion Matrix
                    </td>
                    <td class="tui-table__th tui-text_body-s"></td>
                  </tr>
                  @for(item of confusionMatrixData(); track item?.prop) {
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ item?.prop }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ item?.value }}
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="col-1"></div>
            <div class="col-3">
              <table class="tui-table">
                <tbody>
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__th tui-text_body-s">ROC Curve</td>
                    <td class="tui-table__th tui-text_body-s"></td>
                  </tr>
                  @for(item of ROCCurveValueData(); track item?.prop) {
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-s">
                      {{ item?.prop }}
                    </td>
                    <td class="tui-table__td tui-text_body-s">
                      {{ item?.value }}
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          }
        </tui-loader>
        } @else if(activeTab == 2){
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Column Details
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <form>
              <tui-select [formControl]="edaColumnController">
                Column
                <input tuiTextfield placeholder="Choose a column" />
                <tui-data-list-wrapper
                  *tuiDataList
                  [items]="[
                    'age',
                    'bp',
                    'sg',
                    'al',
                    'su',
                    'rbc',
                    'pc',
                    'pcc',
                    'ba',
                    'bgr',
                    'bu',
                    'sc',
                    'sob',
                    'pot',
                    'hemo',
                    'pcv',
                    'wc',
                    'rc',
                    'htn',
                    'dm',
                    'cad',
                    'appet',
                    'pe',
                    'ane',
                    'classification'
                  ]"
                ></tui-data-list-wrapper>
              </tui-select>
            </form>
          </div>
          <div class="col-1">
            <button
              tuiButton
              appearance="secondary"
              size="m"
              class="m-1"
              [disabled]="!edaColumnController.value"
              (click)="onEdaColumnChange()"
            >
              Select
            </button>
          </div>
        </div>
        <tui-loader [showLoader]="showEdaColumnLoader" [overlay]="true">
          <div class="row justify-content-center py-4">
            <div class="col-4">
              <tui-scrollbar>
                <div style="max-height: 400px;">
                  <table class="tui-table">
                    <tbody>
                      @for(item of edaColumnStates; track item.prop){
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__th tui-text_body-s">
                          {{ item?.prop }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ item?.value }}
                        </td>
                      </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </tui-scrollbar>
            </div>
            <div class="col-8">
              @if(showEdaChart()){
              <div echarts [options]="edaColumnData()"></div>
              }
            </div>
          </div>
        </tui-loader>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Error
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <form>
              <tui-select [formControl]="errorColumnOneController">
                Column
                <input tuiTextfield placeholder="Choose a column" />
                <tui-data-list-wrapper
                  *tuiDataList
                  [items]="[
                    'age',
                    'bp',
                    'sg',
                    'al',
                    'su',
                    'rbc',
                    'pc',
                    'pcc',
                    'ba',
                    'bgr',
                    'bu',
                    'sc',
                    'sob',
                    'pot',
                    'hemo',
                    'pcv',
                    'wc',
                    'rc',
                    'htn',
                    'dm',
                    'cad',
                    'appet',
                    'pe',
                    'ane',
                    'classification'
                  ]"
                ></tui-data-list-wrapper>
              </tui-select>
            </form>
          </div>
          <div class="col-4">
            <form>
              <tui-select [formControl]="errorColumnTwoController">
                Column
                <input tuiTextfield placeholder="Choose a column" />
                <tui-data-list-wrapper
                  *tuiDataList
                  [items]="[
                    'age',
                    'bp',
                    'sg',
                    'al',
                    'su',
                    'rbc',
                    'pc',
                    'pcc',
                    'ba',
                    'bgr',
                    'bu',
                    'sc',
                    'sob',
                    'pot',
                    'hemo',
                    'pcv',
                    'wc',
                    'rc',
                    'htn',
                    'dm',
                    'cad',
                    'appet',
                    'pe',
                    'ane',
                    'classification'
                  ]"
                ></tui-data-list-wrapper>
              </tui-select>
            </form>
          </div>
          <div class="col-1">
            <button
              tuiButton
              appearance="secondary"
              size="m"
              class="m-1"
              [disabled]="
                !(
                  errorColumnOneController.value &&
                  errorColumnTwoController.value
                )
              "
              (click)="onErrorChange()"
            >
              Select
            </button>
          </div>
        </div>
        <tui-loader [showLoader]="showErrorLoader" [overlay]="true">
          <div class="row justify-content-center py-4">
            <div class="col-4">
              <tui-scrollbar>
                <div style="max-height: 400px;">
                  <table class="tui-table">
                    <tbody>
                      @for(item of errorStates; track item.prop){
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__th tui-text_body-s">
                          {{ item?.prop }}
                        </td>
                        <td class="tui-table__td tui-text_body-s">
                          {{ item?.value }}
                        </td>
                      </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </tui-scrollbar>
            </div>
            <div class="col-8">
              @if(showErrorChart()){
              <div echarts [options]="errorData()"></div>
              }
            </div>
          </div>
        </tui-loader>
        <div class="row justify-content-center py-2">
          <div class="col-12">
            <p
              class="tui-text_body-xl text-center"
              style="color: var(--tui-success-fill); font-weight: 600;"
            >
              Find Ratio
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <form>
              <tui-select [formControl]="ratioColumnOneController">
                Column
                <input tuiTextfield placeholder="Choose a column" />
                <tui-data-list-wrapper
                  *tuiDataList
                  [items]="[
                    'age',
                    'bp',
                    'sg',
                    'al',
                    'su',
                    'rbc',
                    'pc',
                    'pcc',
                    'ba',
                    'bgr',
                    'bu',
                    'sc',
                    'sob',
                    'pot',
                    'hemo',
                    'pcv',
                    'wc',
                    'rc',
                    'htn',
                    'dm',
                    'cad',
                    'appet',
                    'pe',
                    'ane',
                    'classification'
                  ]"
                ></tui-data-list-wrapper>
              </tui-select>
            </form>
          </div>
          <div class="col-4">
            <form>
              <tui-select [formControl]="ratioColumnTwoController">
                Column
                <input tuiTextfield placeholder="Choose a column" />
                <tui-data-list-wrapper
                  *tuiDataList
                  [items]="[
                    'age',
                    'bp',
                    'sg',
                    'al',
                    'su',
                    'rbc',
                    'pc',
                    'pcc',
                    'ba',
                    'bgr',
                    'bu',
                    'sc',
                    'sob',
                    'pot',
                    'hemo',
                    'pcv',
                    'wc',
                    'rc',
                    'htn',
                    'dm',
                    'cad',
                    'appet',
                    'pe',
                    'ane',
                    'classification'
                  ]"
                ></tui-data-list-wrapper>
              </tui-select>
            </form>
          </div>
          <div class="col-1">
            <button
              tuiButton
              appearance="secondary"
              size="m"
              class="m-1"
              [disabled]="
                !(
                  ratioColumnOneController.value &&
                  ratioColumnTwoController.value
                )
              "
              (click)="onRatioColumnChange()"
            >
              Select
            </button>
          </div>
        </div>
        <div class="row justify-content-center py-2">
          <div class="col-6">
            <tui-loader [showLoader]="showRatioLoader" [overlay]="true">
              @if(ratioColumnOneProp() && ratioColumnTwoProp() &&
              ratioColumnThreeProp()) {
              <div class="d-flex">
                <table class="tui-table">
                  <tbody>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__th tui-text_body-s">
                        {{ ratioColumnOneProp() }}
                      </td>
                    </tr>
                    @for(value of ratioColumnOneData(); track value) {
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">{{ value }}</td>
                    </tr>
                    }
                  </tbody>
                </table>
                <table class="tui-table">
                  <tbody>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__th tui-text_body-s">
                        {{ ratioColumnTwoProp() }}
                      </td>
                    </tr>
                    @for(value of ratioColumnTwoData(); track value) {
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">{{ value }}</td>
                    </tr>
                    }
                  </tbody>
                </table>
                <table class="tui-table">
                  <tbody>
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__th tui-text_body-s">
                        {{ ratioColumnThreeProp() }}
                      </td>
                    </tr>
                    @for(value of ratioColumnThreeData(); track value) {
                    <tr class="tui-table__tr tui-table__tr_border">
                      <td class="tui-table__td tui-text_body-s">{{ value }}</td>
                    </tr>
                    }
                  </tbody>
                </table>
              </div>
              }
            </tui-loader>
          </div>
        </div>
        }
      </div>
    </div>
  </div>`,
  styleUrl: './eda.component.css',
  providers: [provideEcharts()],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EdaComponent implements OnInit {
  // Breadcrumb Values
  breadcrumbs = [
    {
      caption: 'Dashboard',
      routerLink: '/home',
    },
    {
      caption: 'EDA',
      routerLink: '/eda',
    },
  ];

  // Tab Index
  activeTab = 0;

  // Boolean Values

  showDTStatesLoader = signal<boolean>(false);
  showMoreDetailsLoader = signal<boolean>(false);
  showMissingDataLoader = false;
  showCorrelationLoader = false;
  showTransposeNumLoader = false;
  showTransposeCatLoader = false;
  showPairPlotLoader = false;
  showOutLayerLoader = false;
  showAllRatioLoader = false;
  showRatioLoader = false;
  showMatrixLoader = false;
  showEdaColumnLoader = false;
  showErrorLoader = false;

  showDatasetStates = signal<boolean>(false);
  enableMoreDetails = signal<boolean>(false);
  showEdaChart = signal<boolean>(false);
  showErrorChart = signal<boolean>(false);

  // Controller
  datasetController = new FormControl();
  edaColumnController = new FormControl();
  ratioColumnOneController = new FormControl();
  ratioColumnTwoController = new FormControl();
  errorColumnOneController = new FormControl();
  errorColumnTwoController = new FormControl();

  // Dataset
  dataset = signal<Partial<DatasetsModel>>({});
  datasetId = computed(() => this.dataset().id);
  datasetStates = signal<Partial<DatasetDetailModel>>({});
  nullCount = signal<Partial<DatasetNullCountModel>>({});
  transposeNum = signal<Partial<DatasetTransposeNumericalModel>>({});
  transposeCat = signal<Partial<DatasetTransposeCategoricalModel>>({});
  allRatio = signal<any>({});

  edaColumnWise: any;
  edaColumnStates: any[] = [];
  errorStates: any[] = [];

  // Dataset Dropdown
  datasetList = signal<DatasetsModel[]>([]);
  DTNameList = computed(() => this.datasetList().map((el) => el.Name));

  // Charts
  MissingData = signal<EChartsOption>({});
  PairPlotData = signal<EChartsOption>({});
  outLayerData = signal<EChartsOption>({});
  correlationData = signal<EChartsOption>({});
  edaColumnData = signal<EChartsOption>({});
  errorData = signal<EChartsOption>({});

  ratioColumnOneProp = signal<string>('');
  ratioColumnTwoProp = signal<string>('');
  ratioColumnThreeProp = signal<string>('');

  ratioColumnOneData = signal<string[]>([]);
  ratioColumnTwoData = signal<string[]>([]);
  ratioColumnThreeData = signal<string[]>([]);

  confusionMatrixData = signal<any[]>([]);
  ROCCurveValueData = signal<any[]>([]);

  constructor(
    @Inject(DatasetService)
    private readonly datasetService: DatasetService,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.datasetService
      .getAll()
      .subscribe((DT: DatasetsModel[]) => this.datasetList.set(DT));
  }

  onDTSelect(): any {
    this.showDTStatesLoader.update((value) => !value);
    this.showDatasetStates.set(false);

    const datasetName = this.datasetController?.value;
    const dataset = this.datasetList().find((DT) => DT.Name === datasetName);

    if (dataset) this.dataset.set(dataset);
    else {
      return this.alerts
        .open(`Dataset Not Found`, {
          label: 'Notification',
          status: 'error',
        })
        .subscribe();
    }

    // Combine Multiple RequestCalls
    combineLatest(
      this.datasetService.checkStates(this.datasetId()!),
      this.datasetService.checkNullCount(this.datasetId()!)
    ).subscribe((res) => {
      const [datasetStates, datasetNullCount] = res;

      this.showDatasetStates.set(true);
      this.enableMoreDetails.set(true);
      this.showDTStatesLoader.update((value) => !value);

      this.datasetStates.set(datasetStates);
      this.nullCount.set(datasetNullCount);
    });
  }

  createMissingDataChart(data: any): any {
    return {
      legend: {},
      tooltip: {},
      dataset: {
        source: [
          ['column', 'missing Value'],
          ['age', data['age']],
          ['al', data['al']],
          ['ane', data['ane']],
          ['appet', data['appet']],
          ['ba', data['ba']],
          ['bgr', data['bgr']],
          ['bp', data['bp']],
          ['bu', data['bu']],
          ['cad', data['cad']],
          ['classification', data['classification']],
          ['dm', data['dm']],
          ['hemo', data['hemo']],
          ['htn', data['htn']],
          ['pc', data['pc']],
          ['pcc', data['pcc']],
          ['pcv', data['pcv']],
          ['pe', data['pe']],
          ['pot', data['pot']],
          ['rbc', data['rbc']],
          ['rc', data['rc']],
          ['sc', data['sc']],
          ['sg', data['sg']],
          ['sod', data['sod']],
          ['su', data['su']],
          ['wc', data['wc']],
        ],
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      yAxis: {},
      series: [{ type: 'bar' }],
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
    };
  }

  createPairPlotChart(data: any): any {
    let source: any[] = [];

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const col = data[key];
        const value = [];
        for (const key1 in col) {
          if (Object.prototype.hasOwnProperty.call(col, key1)) {
            const element = col[key1];

            value.push(element);
          }
        }

        source.push(value);
      }
    }

    return {
      grid: [
        {
          left: '5%',
          top: '2%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '35%',
          top: '2%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '65%',
          top: '2%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '5%',
          top: '28%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '35%',
          top: '28%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '65%',
          top: '28%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '5%',
          top: '54%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '35%',
          top: '54%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '65%',
          top: '54%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
        {
          left: '5%',
          top: '78%',
          width: '25%',
          height: '20%',
          containLabel: true,
          show: true,
        },
      ],
      tooltip: {},
      xAxis: [
        {
          gridIndex: 0,
          type: 'category',
          data: ['no', 'yes`'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'Ane',
        },
        {
          gridIndex: 1,
          type: 'category',
          data: ['good', 'poor'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'appet',
        },
        {
          gridIndex: 2,
          type: 'category',
          data: ['notpresent', 'present'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'ba',
        },
        {
          gridIndex: 3,
          type: 'category',
          data: ['no', 'yes'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'cad',
        },
        {
          gridIndex: 4,
          type: 'category',
          data: ['no', 'yes'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'dm',
        },
        {
          gridIndex: 5,
          type: 'category',
          data: ['abnormal', 'normal'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'htn',
        },
        {
          gridIndex: 6,
          type: 'category',
          data: ['abnormal', 'normal'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'pc',
        },
        {
          gridIndex: 7,
          type: 'category',
          data: ['notpresent', 'present'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'pcc',
        },
        {
          gridIndex: 8,
          type: 'category',
          data: ['no', 'yes'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'pe',
        },
        {
          gridIndex: 9,
          type: 'category',
          data: ['abnormal', 'normal'],
          axisTick: {
            alignWithLabel: true,
          },
          name: 'rbc',
        },
      ],
      yAxis: [
        { gridIndex: 0 },
        { gridIndex: 1 },
        { gridIndex: 2 },
        { gridIndex: 3 },
        { gridIndex: 4 },
        { gridIndex: 5 },
        { gridIndex: 6 },
        { gridIndex: 7 },
        { gridIndex: 8 },
        { gridIndex: 9 },
      ],
      series: [
        {
          name: 'Ane',
          type: 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: source[0],
        },
        {
          name: 'Appet',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: source[1],
        },
        {
          name: 'Ba',
          type: 'bar',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: source[2],
        },
        {
          name: 'Cad',
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: source[3],
        },
        {
          name: 'Dm',
          type: 'bar',
          xAxisIndex: 4,
          yAxisIndex: 4,
          data: source[4],
        },
        {
          name: 'Htn',
          type: 'bar',
          xAxisIndex: 5,
          yAxisIndex: 5,
          data: source[5],
        },
        {
          name: 'Pc',
          type: 'bar',
          xAxisIndex: 6,
          yAxisIndex: 6,
          data: source[6],
        },
        {
          name: 'Pcc',
          type: 'bar',
          xAxisIndex: 7,
          yAxisIndex: 7,
          data: source[7],
        },
        {
          name: 'Pe',
          type: 'bar',
          xAxisIndex: 8,
          yAxisIndex: 8,
          data: source[8],
        },
        {
          name: 'Rbc',
          type: 'bar',
          xAxisIndex: 9,
          yAxisIndex: 9,
          data: source[9],
        },
      ],
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
    };
  }

  createOutLayerValueChart(data: any): any {
    const grid: any[] = [
      {
        top: '0%',
        left: '0%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '0%',
        left: '25%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '0%',
        left: '50%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '0%',
        left: '75%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '25%',
        left: '0%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '25%',
        left: '25%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '25%',
        left: '50%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '25%',
        left: '75%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '50%',
        left: '0%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '50%',
        left: '25%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '50%',
        left: '50%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '50%',
        left: '75%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '75%',
        left: '0%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '75%',
        left: '25%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '50%',
        left: '50%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
      {
        top: '50%',
        left: '75%',
        width: '20%',
        height: '20%',
        containLabel: true,
        show: true,
      },
    ];
    const xAxis: any[] = [
      {
        gridIndex: 0,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 1,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 2,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 3,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 4,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 5,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 6,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 7,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 8,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 9,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 10,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 11,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 12,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      {
        gridIndex: 13,
        type: 'value',
        scale: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
    ];
    const yAxis: any[] = [
      {
        gridIndex: 0,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 1,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 2,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 3,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 4,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 5,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 6,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 7,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 8,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 9,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 10,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 11,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 12,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
      {
        gridIndex: 13,
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
      },
    ];

    const dataset: any[] = [];
    const series: any[] = [];

    let numberOfDataset = 0;
    let xAxisNumber = 0;
    let yAxisNumber = 0;

    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        let value: any[] = data[prop];

        // Add Dataset
        dataset.push({
          source: [value.length === 0 ? [0] : value],
        });

        dataset.push({
          fromDatasetIndex: numberOfDataset,
          transform: {
            type: 'boxplot',
          },
        });

        numberOfDataset = numberOfDataset + 2;

        series.push({
          name: prop,
          type: value.length === 0 ? 'scatter' : 'boxplot',
          xAxisIndex: xAxisNumber,
          yAxisIndex: yAxisNumber,
          datasetIndex: numberOfDataset - 1,
        });

        xAxisNumber = xAxisNumber + 1;
        yAxisNumber = yAxisNumber + 1;
      }
    }

    return {
      tooltip: {},
      grid,
      dataset,
      xAxis,
      yAxis,
      series,
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
    };
  }

  createCorrelationChart(data: any): any {
    const {
      correlation_values,
      xcolumn: xAxisCategories,
      ycolumn: yAxisCategories,
    } = data;

    const value = (correlation_values as any[])
      .map((el: any) => [
        (xAxisCategories as string[]).findIndex((x) => x == el.x),
        (yAxisCategories as string[]).findIndex((y) => y == el.y),
        el.value,
      ])
      .filter((el: any) => el[2] > 0);

    return {
      tooltip: {},
      grid: {
        height: '50%',
        top: '10%',
      },
      xAxis: {
        type: 'category',
        data: xAxisCategories,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: yAxisCategories,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
      },
      series: [
        {
          name: 'Correlation',
          type: 'heatmap',
          data: value,
          label: {
            show: true,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
    };
  }

  createErrorDataChart(data: any): any {
    const props = Object.keys(data);

    const xAxis: any[] = data[props[0]];
    const yAxis: any[] = data[props[1]];

    const value: any = [];
    for (var i = 0; i < xAxis.length; i++) {
      value.push([yAxis[i], xAxis[i]]);
    }

    return {
      legend: {},
      tooltip: {},
      xAxis: [{}],
      yAxis: [{}],
      series: [
        {
          symbolSize: 5,
          data: value,
          type: 'scatter',
        },
      ],
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none'
        }
      ],
    };
  }

  onMoreDetails() {
    this.activeTab = 1;

    // Loaders
    this.showMissingDataLoader = true;
    this.showCorrelationLoader = true;
    this.showTransposeNumLoader = true;
    this.showTransposeCatLoader = true;
    this.showPairPlotLoader = true;
    this.showOutLayerLoader = true;
    this.showAllRatioLoader = true;
    this.showMatrixLoader = true;

    this.datasetService.checkMissingData(this.datasetId()!).subscribe((res) => {
      const { id: missingData_id, ...missingData } = res;

      this.MissingData.set(this.createMissingDataChart(missingData));
      this.showMissingDataLoader = false;
    });

    this.datasetService
      .checkCorrelationValue(this.datasetId()!)
      .subscribe((res) => {
        const { id: correlation_id, ...correlation } = res;

        this.correlationData.set(this.createCorrelationChart(correlation));
        this.showCorrelationLoader = false;
      });

    this.datasetService
      .checkTransposeNum(this.datasetId()!)
      .subscribe((res) => {
        const { id: transposeNum_id, ...transposeNum } = res;

        this.transposeNum.set(transposeNum);
        this.showTransposeNumLoader = false;
      });

    this.datasetService
      .checkTransposeCat(this.datasetId()!)
      .subscribe((res) => {
        const { id: transposeCat_id, ...transposeCat } = res;

        this.transposeCat.set(transposeCat);
        this.showTransposeCatLoader = false;
      });

    this.datasetService.checkPairPlot(this.datasetId()!).subscribe((res) => {
      const { id: pairPlot_id, ...pairPlot } = res;

      this.PairPlotData.set(this.createPairPlotChart(pairPlot));
      this.showPairPlotLoader = false;
    });

    this.datasetService
      .checkOutLayerValue(this.datasetId()!)
      .subscribe((res) => {
        const { id: outLayerValue_id, ...outLayerValue } = res;

        this.outLayerData.set(this.createOutLayerValueChart(outLayerValue));
        this.showOutLayerLoader = false;
      });

    this.datasetService.checkAllRatio(this.datasetId()!).subscribe((res) => {
      const { id: allRatio_id, ...allRatio } = res;

      this.allRatio.set(allRatio);
      this.showAllRatioLoader = false;
    });

    this.datasetService.checkMatrix(this.datasetId()!).subscribe((res) => {
      const confusionMatrix = res['Confusion Matrix'];
      const ROCCurve = res['ROC Curve'];

      const confusionMatrixValue = [];
      const ROCCurveValue = [];

      for (const prop in confusionMatrix) {
        if (Object.prototype.hasOwnProperty.call(confusionMatrix, prop)) {
          const value = confusionMatrix[prop];

          confusionMatrixValue.push({ prop, value });
        }
      }

      for (const prop in ROCCurve) {
        if (Object.prototype.hasOwnProperty.call(ROCCurve, prop)) {
          const value = ROCCurve[prop];

          ROCCurveValue.push({ prop, value });
        }
      }

      this.confusionMatrixData.set(confusionMatrixValue);
      this.ROCCurveValueData.set(ROCCurveValue);
      this.showMatrixLoader = false;
    });
  }

  onEdaColumnChange() {
    const column = this.edaColumnController.value;
    const id = this.datasetId() || 0;

    this.showEdaColumnLoader = true;

    this.datasetService.performEdaColumWise(id, column).subscribe((res) => {
      setTimeout(() => {
        this.showEdaColumnLoader = false;

        this.edaColumnWise = res;
        const type = res?.statistics?.type;

        const data = [];
        const states = res?.statistics;

        if (states) {
          delete states.type;
          for (const prop in states) {
            if (Object.prototype.hasOwnProperty.call(states, prop)) {
              const value = states[prop];

              data.push({ prop, value });
            }
          }
        }

        this.edaColumnStates = data;

        if (type === 'num') {
          this.edaColumnData.set({
            xAxis: {
              type: 'category',
              data: res?.histogram.map((el: any) => el.value),
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: res?.histogram.map((el: any) => el.count),
                type: 'bar',
              },
            ],
          });

          this.showEdaChart.set(true);
        } else if (type === 'cat') {
          this.edaColumnData.set({
            xAxis: {
              type: 'value',
            },
            yAxis: {
              type: 'category',
              data: res?.histogram.map((el: any) => el.value),
            },
            series: [
              {
                data: res?.histogram.map((el: any) => el.count),
                type: 'bar',
              },
            ],
          });

          this.showEdaChart.set(true);
        }
      }, 3000);
    });
  }

  onRatioColumnChange() {
    this.showRatioLoader = true;

    const id = this.datasetId() || 0;
    const columnOne = this.ratioColumnOneController.value;
    const columnTwo = this.ratioColumnTwoController.value;

    this.datasetService
      .checkRatio(id, columnOne, columnTwo)
      .subscribe((res) => {
        const { id, selected_columns } = res;

        const keys = Object.keys(selected_columns);

        this.ratioColumnOneProp.set(keys[0]);
        this.ratioColumnTwoProp.set(keys[1]);
        this.ratioColumnThreeProp.set(keys[2]);

        this.ratioColumnOneData.set(
          Object.values(selected_columns[keys[0]]) as string[]
        );
        this.ratioColumnTwoData.set(
          Object.values(selected_columns[keys[1]]) as string[]
        );
        this.ratioColumnThreeData.set(
          Object.values(selected_columns[keys[2]]) as string[]
        );

        this.showRatioLoader = false;
      });
  }

  onErrorChange() {
    this.showErrorLoader = true;

    const id = this.datasetId() || 0;
    const columnOne = this.errorColumnOneController.value;
    const columnTwo = this.errorColumnTwoController.value;

    this.datasetService
      .checkError(id, columnOne, columnTwo)
      .subscribe((res) => {
        const { id, 'Heatmap Data': data, ...detail } = res;

        const item = [];

        for (const prop in detail) {
          if (Object.prototype.hasOwnProperty.call(detail, prop)) {
            const value = detail[prop];
            item.push({ prop, value });
          }
        }
        this.errorStates = item;
        this.errorData.set(this.createErrorDataChart(data));

        this.showErrorChart.set(true);
        this.showErrorLoader = false;
      });
  }
}
