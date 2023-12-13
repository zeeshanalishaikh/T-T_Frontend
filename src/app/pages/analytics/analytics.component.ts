import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  signal,
} from '@angular/core';
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
} from '@taiga-ui/core';
import {
  TuiBreadcrumbsModule,
  TuiStepperModule,
  TuiRadioBlockModule,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiGroupModule,
    TuiDropdownModule,
    TuiLinkModule,
    TuiBreadcrumbsModule,
    TuiStepperModule,
    TuiRadioBlockModule,
  ],
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
                <button tuiStep [disabled]="activeTab <= 1">Result</button>
              </tui-stepper>
            </div>
          </div>
          <div class="row justify-content-center py-4">
            @if(activeTab == 0) {
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
                  item="SVM"
                  size="l"
                >
                  <div class="content">
                    <strong>SVM</strong>
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
                  item="LR"
                  size="l"
                >
                  <div class="content">
                    <strong>linear regression</strong>
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
                  item="LGR"
                  size="l"
                >
                  <div class="content">
                    <strong>Logistic Regression</strong>
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
            }
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
}
