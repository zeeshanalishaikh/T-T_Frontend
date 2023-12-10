import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  collapseAnimation,
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';

import {
  TuiCarouselModule,
  TuiIslandModule,
  TuiInputFilesModule,
  TuiActionModule,
  TuiPaginationModule,
  TuiFileLike,
} from '@taiga-ui/kit';
import { TuiSvgModule, TuiButtonModule } from '@taiga-ui/core';

import { Observable, of, Subject, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiCarouselModule,
    TuiIslandModule,
    TuiActionModule,
    TuiPaginationModule,
    TuiInputFilesModule,
  ],
  template: `
    <div class="home">
      <div class="container">
        <div class="row pb-5">
          <div class="col">
            <img src="assets/img/logo.png" width="180" alt="Logo" />
            <h1 class="tui-text_h1 mb-3 mt-2">Welcome,</h1>
            <p class="tui-text_h6 px-1" style="color: var(--tui-text-03)">
              What would you like to perform
            </p>
          </div>
        </div>
        <div
          class="p-5 mb-5"
          style="background-color: #fff; border-radius: 20px;"
        >
          <div class="row pb-2">
            <span class="tui-text_h6" style="color: var(--tui-success-fill)">
              Actions
            </span>
            <span
              class="tui-text_body-s pb-4"
              style="color: var(--tui-text-03);"
            >
              Browse and view..
            </span>
          </div>
          <div class="row ">
            <div class="col">
              @if (!showFileUpload) {
              <tui-island [@collapseOnLeave] [@expandOnEnter]>
                <h3 class="tui-island__title">Training</h3>
                <p class="tui-island__paragraph">
                  Import Dataset regarding Chronic Kidney Disease to train
                  algorithm.
                </p>
                <button
                  tuiButton
                  type="button"
                  appearance="flat"
                  size="m"
                  class="tui-island__footer-button"
                  (click)="showFileUpload = !showFileUpload"
                >
                  Select
                </button>
              </tui-island>
              } @else {
              <form class="mt-3">
                <tui-input-files
                  *ngIf="!control.value"
                  [formControl]="control"
                  (reject)="onReject($event)"
                ></tui-input-files>

                <tui-files class="tui-space_top-1">
                  <tui-file
                    *ngIf="loadedFiles$ | async as file"
                    [file]="file"
                    [showDelete]="control.enabled"
                    (removed)="removeFile()"
                  ></tui-file>

                  <tui-file
                    *ngIf="rejectedFiles$ | async as file"
                    state="error"
                    [file]="file"
                    [showDelete]="control.enabled"
                    (removed)="clearRejected()"
                  ></tui-file>

                  <tui-file
                    *ngIf="loadingFiles$ | async as file"
                    state="loading"
                    [file]="file"
                    [showDelete]="control.enabled"
                  ></tui-file>
                </tui-files>
                <button
                  appearance="accent"
                  tuiButton
                  type="button"
                  size="m"
                  [disabled]="!readyFile"
                  [showLoader]="uploadLoading"
                  (click)="onSubmit()"
                  class="tui-space_right-3 tui-space_bottom-3 mt-3"
                >
                  Upload
                </button>
                <button
                  appearance="secondary-destructive"
                  tuiButton
                  type="button"
                  size="m"
                  class="tui-space_right-3 tui-space_bottom-3 mt-3"
                  (click)="showFileUpload = !showFileUpload"
                >
                  back
                </button>
              </form>
              }
            </div>
            <div class="col offset-1">
              <tui-island>
                <h3 class="tui-island__title">EDA</h3>
                <p class="tui-island__paragraph">
                  Perform exploratory data analysis from the Dataset selected.
                </p>
                <button
                  tuiButton
                  type="button"
                  appearance="flat"
                  size="m"
                  [disabled]="!EnableAction"
                  class="tui-island__footer-button"
                >
                  Check
                </button>
              </tui-island>
            </div>
            <div class="col">
              <tui-island>
                <h3 class="tui-island__title">Check Accuracy</h3>
                <p class="tui-island__paragraph">
                  Check different algorithm's accuracy for performing
                  predictions.
                </p>
                <button
                  tuiButton
                  type="button"
                  appearance="flat"
                  size="m"
                  [disabled]="!EnableAction"
                  class="tui-island__footer-button"
                >
                  Check
                </button>
              </tui-island>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './home.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    collapseAnimation(),
    collapseOnLeaveAnimation(),
    expandOnEnterAnimation(),
  ],
})
export class HomeComponent {
  showFileUpload = false;
  EnableAction = false;
  readyFile = false;
  uploadLoading = false;

  readonly control = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => (file ? this.makeRequest(file) : of(null)))
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        this.readyFile = true;
        return file;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  onSubmit() {
    this.uploadLoading = true;

    setTimeout(() => {
      this.uploadLoading = false;
    }, 3000);
  }
}
