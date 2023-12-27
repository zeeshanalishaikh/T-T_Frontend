import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit,
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
  TuiSvgModule,
  TuiButtonModule,
  TuiDropdownModule,
  TuiDialogModule,
  TuiDialogService,
  TuiAlertService,
  TuiLinkModule,
  TuiGroupModule,
  TuiErrorModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
  tuiCapitalize,
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

import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AnalyticResultComponent } from '../../components/analyticResult/analyticResult.component';
import { AlgorithmService } from '@service/algorithm.service';
import { DatasetService } from '@service/datasets.service';
import { DatasetsModel } from '@model/dataset.interface';
import { RecordsModel } from '@model/records.interface';

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
  selector: 'app-analytics',
  standalone: true,
  imports: [...angularImports, ...TaigaImports],
  template: `
    <div class="analytic">
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
              <h1 class="tui-text_h4 mb-3 mt-2">Analytics</h1>
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
                    <div>Pick Algorithm</div>
                    @if(activeTab > 0){
                    <div>
                      <strong>Selected: </strong>
                      @switch (algorithmController.value){ @case ('knn') { K-NN
                      Algorithm } @case ('logistic') { Logistic Algorithm }
                      @case ('xgboost') { XGBoost Algorithm } @case ('catboost')
                      { CatBoost Algorithm } }
                    </div>
                    }
                  </div>
                </button>
                <button tuiStep [disabled]="activeTab <= 0">Plot Values</button>
              </tui-stepper>
            </div>
          </div>
          <div class="row justify-content-center py-4">
            @switch (activeTab) { @case (0) {
            <div class="col-9">
              <form tuiGroup [collapsed]="false">
                <tui-radio-block
                  contentAlign="right"
                  [formControl]="algorithmController"
                  item="knn"
                  size="l"
                >
                  <div class="content">
                    <strong>knn</strong>
                    <div>
                      An orange is a fruit of various citrus species in the
                      family Rutaceae
                    </div>
                  </div>
                </tui-radio-block>
                <tui-radio-block
                  contentAlign="right"
                  [formControl]="algorithmController"
                  item="logistic"
                  size="l"
                >
                  <div class="content">
                    <strong>Logistic</strong>
                    <div>
                      Not to be confused with neither
                      <em>pines</em>
                      nor
                      <em>apples</em>
                    </div>
                  </div>
                </tui-radio-block>
                <tui-radio-block
                  contentAlign="right"
                  [formControl]="algorithmController"
                  item="xgboost"
                  size="l"
                >
                  <div class="content">
                    <strong>xgBoost</strong>
                    <div>
                      Not to be confused with neither
                      <em>pines</em>
                      nor
                      <em>apples</em>
                    </div>
                  </div>
                </tui-radio-block>
                <tui-radio-block
                  contentAlign="right"
                  [formControl]="algorithmController"
                  item="catboost"
                  size="l"
                >
                  <div class="content">
                    <strong>catBoost</strong>
                    <div>
                      Not to be confused with neither
                      <em>pines</em>
                      nor
                      <em>apples</em>
                    </div>
                  </div>
                </tui-radio-block>
              </form>
            </div>
            } @case (1) {
            <div class="col-9">
              <div class="row my-4">
                <div class="col-6">
                  <tui-select [formControl]="datasetController">
                    Dataset
                    <input tuiTextfield placeholder="Choose a dataset" />
                    <tui-data-list-wrapper
                      *tuiDataList
                      [items]="datasetNames"
                    ></tui-data-list-wrapper>
                  </tui-select>
                </div>
                <div class="col-6 d-flex align-items-center justify-content-end">
                  <span class="tui-text_h6 mx-2">Plot Value | </span>  
                  <button
                    tuiButton
                    appearance="secondary"
                    size="s"
                    class="m-1"
                    (click)="onPlotCKD()"
                  >
                    CKD
                  </button>
                   <button
                    tuiButton
                    appearance="secondary"
                    size="s"
                    class="m-1"
                    (click)="onPlotNotCKD()"
                  >
                    Not CKD
                  </button>
                  <button
                    tuiButton
                    appearance="accent"
                    size="s"
                    class="m-1"
                    (click)="onPlotReset()"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <form [formGroup]="formController">
                <div class="row my-4">
                  <div class="col">
                    <tui-input-number
                      formControlName="age"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                      [min]="12"
                      [max]="60"
                    >
                      Age
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="bp"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Bp
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="sg"
                      [tuiTextfieldCleaner]="true"
                      [step]="0.1"
                    >
                      Sg
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="al"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Al
                    </tui-input-number>
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col">
                    <tui-input-number
                      formControlName="su"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Su
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-select formControlName="rbc">
                      Rbc
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['abnormal', 'normal']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                  <div class="col">
                    <tui-select formControlName="pc">
                      Pc
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['abnormal', 'normal']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                  <div class="col">
                    <tui-select formControlName="pcc">
                      Pcc
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['notpresent', 'present']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col">
                    <tui-select formControlName="ba">
                      Ba
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['notpresent', 'present']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="bgr"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Bgr
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="bu"
                      [tuiTextfieldCleaner]="true"
                      [step]="0.1"
                    >
                      Bu
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="sc"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Sc
                    </tui-input-number>
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col">
                    <tui-input-number
                      formControlName="sod"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Sod
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="pot"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Pot
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="hemo"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Hemo
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="pcv"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Pcv
                    </tui-input-number>
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col">
                    <tui-input-number
                      formControlName="wc"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Wc
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-input-number
                      formControlName="rc"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Rc
                    </tui-input-number>
                  </div>
                  <div class="col">
                    <tui-select formControlName="htn">
                      Htn
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['no', 'yes']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                  <div class="col">
                    <tui-select formControlName="dm">
                      Dm
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['no', 'yes']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                </div>
                <div class="row my-4">
                  <div class="col">
                    <tui-select formControlName="cad">
                      Cad
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['no', 'yes']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                  <div class="col">
                    <tui-select formControlName="appet">
                      Appet
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['poor', 'good']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                  <div class="col">
                    <tui-select formControlName="pe">
                      Pe
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['no', 'yes']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                  <div class="col">
                    <tui-select formControlName="ane">
                      Ane
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['no', 'yes']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                </div>
              </form>
            </div>
            } }
          </div>
          <div class="row justify-content-center py-4">
            <div class="col-9">
              <div class="row justify-content-end">
                <div class="col-4 d-flex justify-content-end">
                  @if(activeTab != 0){
                  <button
                    tuiButton
                    appearance="secondary-destructive"
                    size="m"
                    class="m-1"
                    (click)="activeTab = activeTab - 1"
                  >
                    Back
                  </button>
                  } @if(activeTab <= 0){
                  <button
                    tuiButton
                    appearance="primary"
                    size="m"
                    class="m-1"
                    (click)="activeTab = activeTab + 1"
                    [disabled]="stepValidation()"
                  >
                    Next
                  </button>
                  } @if(activeTab === 1){
                  <button
                    tuiButton
                    appearance="secondary"
                    size="m"
                    class="m-1"
                    (click)="onCalculate()"
                    [showLoader]="showCalculateLoader"
                    [disabled]="stepValidation()"
                  >
                    Calculate
                  </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit {
  // Breadcrumb Values
  breadcrumbs = [
    {
      caption: 'Dashboard',
      routerLink: '/home',
    },
    {
      caption: 'Analytics',
      routerLink: '/analytics',
    },
  ];

  // List
  datasetList: DatasetsModel[] = [];
  datasetNames: string[] = [];

  showCalculateLoader = false;

  // Tab Index
  activeTab = 0;

  // Values
  algorithmController = new FormControl();
  datasetController = new FormControl();
  formController = new FormGroup({
    age: new FormControl(24),
    bp: new FormControl(),
    sg: new FormControl(),
    al: new FormControl(24),
    su: new FormControl(),
    rbc: new FormControl(),
    pc: new FormControl(),
    pcc: new FormControl(),
    ba: new FormControl(),
    bgr: new FormControl(),
    bu: new FormControl(),
    sc: new FormControl(),
    sod: new FormControl(),
    pot: new FormControl(),
    hemo: new FormControl(),
    pcv: new FormControl(),
    wc: new FormControl(),
    rc: new FormControl(),
    htn: new FormControl(),
    dm: new FormControl(),
    cad: new FormControl(),
    appet: new FormControl(),
    pe: new FormControl(),
    ane: new FormControl(),
  });

  fetchCkdValue = [
    {
      age: 64,
      bp: 60,
      sg: 1.015,
      al: 2,
      su: 0,
      bgr: 303,
      bu: 46.2,
      sc: 0.8,
      sod: 128.5,
      pot: 5,
      hemo: 10.1,
      pcv: 36,
      wc: 7800,
      rc: 5.2,
      rbc: '',
      pc: 'normal',
      pcc: 'notpresent',
      ba: 'notpresent',
      htn: 'yes',
      dm: 'yes',
      cad: 'no',
      appet: 'good',
      pe: 'no',
      ane: 'no',
    },
  ];
  fetchNotCkdValue = [
    {
      age: 48,
      bp: 80,
      sg: 1.02,
      al: 1,
      su: 0,
      bgr: 121,
      bu: 36,
      sc: 1.2,
      sod: 0,
      pot: 0,
      hemo: 15.4,
      pcv: 44,
      wc: 7800,
      rc: 5.2,
      rbc: '',
      pc: 'normal',
      pcc: 'notpresent',
      ba: 'notpresent',
      htn: 'yes',
      dm: 'yes',
      cad: 'no',
      appet: 'good',
      pe: 'no',
      ane: 'no',
    },
  ];

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    @Inject(Injector)
    private readonly injector: Injector,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService,
    @Inject(AlgorithmService)
    private readonly algorithmService: AlgorithmService,
    @Inject(DatasetService)
    private readonly datasetService: DatasetService
  ) {}

  ngOnInit(): void {
    this.datasetService.getAll().subscribe((datasetList: DatasetsModel[]) => {
      this.datasetList = datasetList;
      this.datasetNames = datasetList.map((el) => el?.Name);
    });
  }

  stepValidation(): boolean {
    let result = false;

    switch (this.activeTab) {
      case 0:
        result = this.algorithmController.value ? false : true;
        this.formController.reset();
        this.datasetController.reset();
        break;
      case 1:
        result = this.datasetController.value ? false : true;
        break;
    }

    return result;
  }

  onPlotCKD() {
    const randomIndex = Math.floor(Math.random() * this.fetchCkdValue.length);
    const object = this.fetchCkdValue[randomIndex];

    this.formController.setValue(object);
  }

  onPlotNotCKD() {
    const randomIndex = Math.floor(Math.random() * this.fetchNotCkdValue.length);
    const object = this.fetchNotCkdValue[randomIndex];

    this.formController.setValue(object);
  }

  onPlotReset() {
    this.formController.reset()
  }

  onCalculate() {
    this.showCalculateLoader = true;
    
    const algorithm: string = this.algorithmController.value;
    const dataset = this.datasetList.find(
      (el: DatasetsModel) => el.Name === this.datasetController.value
    );

    const data = this.formController.value;
    let plotted: Partial<RecordsModel> = {
      age: data.age || 0,
      bp: data.bp || 0,
      sg: data.sg || 0,
      al: data.al || 0,
      su: data.su || 0,
      rbc: data.rbc || '',
      pc: data.pc || '',
      pcc: data.pcc || '',
      ba: data.ba || '',
      bgr: data.bgr || 0,
      bu: data.bu || 0,
      sc: data.sc || 0,
      sod: data.sod || 0,
      pot: data.pot || 0,
      hemo: data.hemo || 0,
      pcv: data.pcv || 0,
      wc: data.wc || 0,
      rc: data.rc || 0,
      htn: data.htn || '',
      dm: data.dm || '',
      cad: data.cad || '',
      appet: data.appet || '',
      pe: data.pe || '',
      ane: data.ane || '',
    };

    this.algorithmService
      .calculateResult(algorithm, dataset!.id, plotted)
      .subscribe((result: any) => {
        const data = {
          algorithm,
          plotted,
          result,
        };
        this.showCalculateLoader = false;
        this.dialogs
          .open<number>(
            new PolymorpheusComponent(AnalyticResultComponent, this.injector),
            {
              data,
              dismissible: true,
              label: 'Calculated Result',
              size: 'auto',
            }
          )
          .subscribe({
            next: (data: any) => {
              console.info(`Dialog emitted data = ${data}`);
            },
            complete: () => {
              console.info('Dialog closed');
            },
          });
      });
  }
}
