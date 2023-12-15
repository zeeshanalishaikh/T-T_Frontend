import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TuiSvgModule,
  TuiButtonModule,
  TuiDropdownModule,
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

const angularImports = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
];

const TaigaImports = [
  // CORE
  TuiSvgModule,
  TuiButtonModule,
  TuiDropdownModule,
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
    <div class="home">
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
                <button tuiStep>Pick Algorithm</button>
                <button tuiStep [disabled]="activeTab <= 0">Plot Values</button>
                <button tuiStep [disabled]="activeTab <= 1">Summary</button>
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
                  item="KNN"
                  size="l"
                >
                  <div class="content">
                    <strong>KNN</strong>
                    <div>
                      An orange is a fruit of various citrus species in the
                      family Rutaceae
                    </div>
                  </div>
                </tui-radio-block>
                <tui-radio-block
                  contentAlign="right"
                  [formControl]="algorithmController"
                  item="L"
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
                  item="XG"
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
                  item="CAT"
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
              @switch (algorithmController.value) { @case ('KNN') {
              <form [formGroup]="knnformController" (ngSubmit)="onKNNSubmit()">
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
                      formControlName="sob"
                      [tuiTextfieldCleaner]="true"
                      [step]="1"
                    >
                      Sob
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
                <div class="row my-4">
                  <div class="col-3">
                    <tui-select formControlName="classification">
                      Classification
                      <input tuiTextfield placeholder="Choose a value" />
                      <tui-data-list-wrapper
                        *tuiDataList
                        [items]="['notckd', 'ckd']"
                      ></tui-data-list-wrapper>
                    </tui-select>
                  </div>
                </div>
              </form>
              } @case ('L') {
              <div>Logistic</div>
              } @case ('XG') {
              <div>xgBoost</div>
              } @case ('CAT') {
              <div>catBoost</div>
              } }
            </div>
            } @case (2) {
            <div class="col-9">
              <div class="row justify-content-center">
                <div class="col-4">
                  <p
                    class="tui-text_h6 mb-3 mx-2 text-center"
                    style="color: var(--tui-success-fill); font-weight: 600;"
                  >
                    Plotted Values
                  </p>
                  <hr />
                  <table class="tui-table">
                    <tbody>
                      <tr class="tui-table__tr tui-table__tr_border">
                        <th class="tui-table__th">Fields</th>
                        <th class="tui-table__th">Values</th>
                      </tr>
                      @for(item of knnValues; track item.value){
                      <tr class="tui-table__tr tui-table__tr_border">
                        <td class="tui-table__td_font-size_s">{{ item.key }}</td>
                        <td class="tui-table__td_font-size_s">{{ item.value }}</td>
                      </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
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
                  } @if(activeTab <= 1){
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
export class AnalyticsComponent {
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

  activeTab = 0;
  algorithmController = new FormControl('');

  readonly knnformController = new FormGroup({
    age: new FormControl(),
    bp: new FormControl(),
    sg: new FormControl(),
    al: new FormControl(),
    su: new FormControl(),
    rbc: new FormControl(),
    pc: new FormControl(),
    pcc: new FormControl(),
    ba: new FormControl(),
    bgr: new FormControl(),
    bu: new FormControl(),
    sc: new FormControl(),
    sob: new FormControl(),
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
    classification: new FormControl(),
  });

  get knnValues() {
    const list: any[] = [];
    const knn: any = this.knnformController.value;
    for (const key in knn) {
      if (Object.prototype.hasOwnProperty.call(knn, key)) {
        const value: any = knn[key];
        list.push({ key: tuiCapitalize(key || ''), value });
      }
    }
    return list;
  }

  stepValidation(): boolean {
    let result = false;

    switch (this.activeTab) {
      case 0:
        result = this.algorithmController.value ? false : true;
        break;

      default:
        break;
    }

    return result;
  }

  onKNNSubmit() {}
}
