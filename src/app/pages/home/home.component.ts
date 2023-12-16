import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { Observable, of, Subject, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import {
  TuiRootModule,
  TuiDialogModule,
  TuiSvgModule,
  TuiButtonModule,
  TuiDropdownModule,
  TuiDialogService,
  TuiAlertService,
  TuiLinkModule,
} from '@taiga-ui/core';
import {
  TuiBreadcrumbsModule,
  TuiCarouselModule,
  TuiIslandModule,
  TuiInputFilesModule,
  TuiActionModule,
  TuiPaginationModule,
  TuiFileLike,
} from '@taiga-ui/kit';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';

import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';



import { DatasetService } from '@service/datasets.service';
import { ViewComponent } from '../../components/view/view.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    TuiRootModule,
    TuiDialogModule,
    TuiSvgModule,
    TuiLinkModule,
    TuiButtonModule,
    TuiDropdownModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiBreadcrumbsModule,
    TuiCarouselModule,
    TuiIslandModule,
    TuiActionModule,
    TuiPaginationModule,
    TuiInputFilesModule,
  ],
  providers: [DatasetService],
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
                routerLink=""
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
            <div class="col-2">
              <h1 class="tui-text_h4 mb-3 mt-2">Dashboard</h1>
              <span
                class="tui-text_body-xl"
                style="color: var(--tui-success-fill); font-weight: 600;"
              >
                Actions
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
          <div class="row my-3 justify-content-between">
            <div class="col">
              <button tuiButton appearance="primary" size="s" class="m-1">
                Perform E.D.A
              </button>
              <button
                tuiButton
                appearance="primary"
                size="s"
                class="m-1"
                [routerLink]="['/analytics']"
              >
                Analytics
              </button>
            </div>
            <div class="col-2 d-flex justify-content-end">
              <button
                tuiButton
                appearance="secondary-destructive"
                [icon]="open() ? 'tuiIconClose' : 'tuiIconFilePlus'"
                size="s"
                class="m-1"
                [tuiDropdown]="content"
                [tuiDropdownManual]="open()"
                (click)="onDropdown()"
              >
                {{ open() ? 'Cancel' : 'Add new' }}
                <ng-template #content>
                  <form class="m-3">
                    <span class="tui-text_body-s">
                      Please select Dataset File.
                    </span>
                    <tui-input-files
                      *ngIf="!control.value"
                      accept="text/csv"
                      [formControl]="control"
                      size="m"
                      (reject)="onReject($event)"
                      class="mt-3"
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
                      size="s"
                      [disabled]="!readyFile()"
                      [showLoader]="uploadLoading()"
                      (click)="onSubmit()"
                      class="tui-space_right-3 tui-space_bottom-3 mt-2"
                    >
                      Upload
                    </button>
                  </form>
                </ng-template>
              </button>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <p class="tui-text_body-m">Dataset List</p>
            </div>
          </div>
          <div class="row justify-content-between">
            <table tuiTable class="table" [columns]="columns()">
              <thead>
                <tr tuiThGroup>
                  <th tuiTh [resizable]="true">#</th>
                  <th tuiTh [resizable]="true">Name</th>
                  <th tuiTh [resizable]="true">After Nan Records</th>
                  <th tuiTh [resizable]="true">Total Records</th>
                  <th tuiTh [resizable]="true">Created On</th>
                  <th tuiTh [resizable]="true">Action</th>
                </tr>
              </thead>
              <tbody tuiTbody [data]="selectedList()">
                @for(item of selectedList(); track item.id) {
                <tr tuiTr>
                  <td *tuiCell="'date'" tuiTd>
                    {{ item.date | date : 'dd/MM/yyyy' }}
                  </td>
                  <td *tuiCell="'id'" tuiTd>
                    <button
                      tuiButton
                      appearance="flat"
                      size="s"
                      title="View"
                      shape="rounded"
                      type="button"
                      (click)="view(item.id)"
                    >
                      View
                    </button>
                  </td>
                </tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <td [colSpan]="columns().length">
                    <tui-table-pagination
                      class="tui-space_top-2"
                      [total]="total()"
                      [size]="size()"
                      (pageChange)="page.set($event)"
                    ></tui-table-pagination>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  breadcrumbs = [
    {
      caption: 'Dashboard',
      routerLink: '/home',
    },
  ];

  // Input Box
  readyFile = signal<boolean>(false);
  uploadLoading = signal<boolean>(false);
  file_name = signal<string>('');

  open = signal<boolean>(false); //DropDown

  // File Handling
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
        this.readyFile.set(true);
        this.file_name.set(file.name);

        return file;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  // DataTable
  columns = signal<string[]>([]);
  datasetList = signal<any[]>([]);
  page = signal<number>(0);
  size = signal<number>(5);
  total = computed(() => this.datasetList().length);

  // DataTable Pagination
  startingPoint = computed(() => this.page() * this.size());
  endingPoint = computed(() => this.page() * this.size() + this.size());
  selectedList = computed(() =>
    this.datasetList().slice(this.startingPoint(), this.endingPoint())
  );

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    @Inject(Injector)
    private readonly injector: Injector,
    @Inject(TuiAlertService)
    private readonly alerts: TuiAlertService,
    @Inject(DatasetService)
    private readonly datasetService: DatasetService
  ) {}

  ngOnInit(): void {
    this.columns.set(['no', 'name', 'nan', 'total', 'date', 'id']);
    this.fetchData();
  }

  fetchData() {
    this.datasetService.getAll().subscribe((list: any) => {
      const DataTable = list.map((el: any, index: number) => ({
        id: el?.id,
        no: index + 1,
        name: el?.Name || el?.fileName,
        date: el?.created_at,
        nan: el?.AfterNanRecords,
        total: el?.TotalRecords,
      }));

      this.datasetList.set(DataTable);
    });
  }

  onSubmit() {
    this.uploadLoading.set(true);
    this.datasetService.create(this.file_name()).subscribe(() => {
      this.alerts
        .open(`Dataset Imported Successfully`, {
          label: 'Notification',
          status: 'success',
        })
        .subscribe();

      this.open.set(false);
      this.uploadLoading.set(false);
      this.fetchData();
    });
  }

  onDropdown() {
    this.open.update((value) => !value);
    this.removeFile();
  }

  view(data: number) {
    this.dialogs
      .open<number>(new PolymorpheusComponent(ViewComponent, this.injector), {
        data,
        dismissible: true,
        label: 'Dataset Sample',
        size: 'auto',
      })
      .subscribe({
        next: (data: any) => {
          console.info(`Dialog emitted data = ${data}`);
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }
}
