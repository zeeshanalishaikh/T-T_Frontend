import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { RecordsModel } from '@model/records.interface';
import { DatasetService } from '@service/datasets.service';

import {
  TuiScrollbarModule,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    CommonModule,
    TuiScrollbarModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiBadgeModule,
  ],
  template: `
    <tui-scrollbar>
      <div style="max-width: 80vw;">
        <table tuiTable class="table mt-4" [columns]="columns()">
          <thead>
            <tr tuiThGroup>
              <th tuiTh [resizable]="true">Age</th>
              <th tuiTh [resizable]="true">Bp</th>
              <th tuiTh [resizable]="true">Sg</th>
              <th tuiTh [resizable]="true">Al</th>
              <th tuiTh [resizable]="true">Su</th>
              <th tuiTh [resizable]="true">Rbc</th>
              <th tuiTh [resizable]="true">Pc</th>
              <th tuiTh [resizable]="true">Pcc</th>
              <th tuiTh [resizable]="true">Ba</th>
              <th tuiTh [resizable]="true">Bgr</th>
              <th tuiTh [resizable]="true">Bu</th>
              <th tuiTh [resizable]="true">Sc</th>
              <th tuiTh [resizable]="true">Sob</th>
              <th tuiTh [resizable]="true">Pot</th>
              <th tuiTh [resizable]="true">Hemo</th>
              <th tuiTh [resizable]="true">Pcv</th>
              <th tuiTh [resizable]="true">Wc</th>
              <th tuiTh [resizable]="true">Rc</th>
              <th tuiTh [resizable]="true">Htn</th>
              <th tuiTh [resizable]="true">Dm</th>
              <th tuiTh [resizable]="true">Cad</th>
              <th tuiTh [resizable]="true">Appet</th>
              <th tuiTh [resizable]="true">Pe</th>
              <th tuiTh [resizable]="true">Ane</th>
              <th tuiTh [resizable]="true">Classification</th>
            </tr>
          </thead>
          <tbody tuiTbody [data]="selectedList()">
            @for(item of selectedList(); track item.age) {
            <tr tuiTr>
              <td *tuiCell="'rbc'" tuiTd>
                @if(item.rbc){
                <tui-badge
                  [status]="item.rbc == 'normal' ? 'success' : 'error'"
                  [value]="item.rbc"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'pc'" tuiTd>
                @if(item.pc){
                <tui-badge
                  [status]="item.pc == 'normal' ? 'success' : 'error'"
                  [value]="item.pc"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'pcc'" tuiTd>
                @if(item.pcc){
                <tui-badge
                  [status]="item.pcc == 'present' ? 'success' : 'error'"
                  [value]="item.pcc"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'ba'" tuiTd>
                @if(item.ba){
                <tui-badge
                  [status]="item.ba == 'present' ? 'success' : 'error'"
                  [value]="item.ba"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'htn'" tuiTd>
                @if(item.htn){
                <tui-badge
                  [status]="item.htn == 'yes' ? 'success' : 'error'"
                  [value]="item.htn"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'dm'" tuiTd>
                @if(item.dm){
                <tui-badge
                  [status]="item.dm == 'yes' ? 'success' : 'error'"
                  [value]="item.dm"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'cad'" tuiTd>
                @if(item.cad){
                <tui-badge
                  [status]="item.cad == 'yes' ? 'success' : 'error'"
                  [value]="item.cad"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'appet'" tuiTd>
                @if(item.appet){
                <tui-badge
                  [status]="item.appet == 'good' ? 'success' : 'error'"
                  [value]="item.appet"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'pe'" tuiTd>
                @if(item.pe){
                <tui-badge
                  [status]="item.pe == 'yes' ? 'success' : 'error'"
                  [value]="item.pe"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'ane'" tuiTd>
                @if(item.ane){
                <tui-badge
                  [status]="item.ane == 'yes' ? 'success' : 'error'"
                  [value]="item.ane"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>

              <td *tuiCell="'classification'" tuiTd>
                @if(item.classification){
                <tui-badge
                  [status]="item.classification == 'ckd' ? 'success' : 'error'"
                  [value]="item.classification"
                  class="tui-space_right-2 tui-space_bottom-2"
                ></tui-badge>
                }
              </td>
            </tr>
            }
          </tbody>
          <!-- <tfoot>
            <tr>
              <td [colSpan]="columns().length">
              </td>
            </tr>
          </tfoot> -->
        </table>
      </div>
    </tui-scrollbar>
    <tui-table-pagination
      class="tui-space_top-2"
      [total]="total()"
      [size]="size()"
      (pageChange)="page.set($event)"
    ></tui-table-pagination>
  `,
  styleUrl: './view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit {
  // Sample Records
  datasetSample = signal<Partial<RecordsModel>[]>([]);

  // DataTable
  columns = signal<string[]>([]);
  page = signal<number>(0);
  size = signal<number>(5);
  total = computed(() => this.datasetSample().length);

  // DataTable Pagination
  startingPoint = computed(() => this.page() * this.size());
  endingPoint = computed(() => this.page() * this.size() + this.size());
  selectedList = computed(() =>
    this.datasetSample().slice(this.startingPoint(), this.endingPoint())
  );

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<number, number>,
    @Inject(DatasetService)
    private readonly datasetService: DatasetService
  ) {}

  ngOnInit(): void {
    this.columns.set([
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
      'classification',
    ]);

    const dataset_id = this.context.data;
    this.datasetService
      .getSample(dataset_id)
      .subscribe((data: RecordsModel[]) =>
        this.datasetSample.set(
          data.map((el: RecordsModel) => {
            const { id, dataset_id, ...record } = el;
            return record;
          })
        )
      );
  }
}
