import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import {
  TuiScrollbarModule,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { TuiTagModule, TuiBadgeModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-analytic-result',
  standalone: true,
  imports: [
    CommonModule,
    TuiScrollbarModule,
    TuiSvgModule,
    TuiBadgeModule,
    TuiTagModule,
  ],
  template: `
    <div style="width: 60vw; padding: 20px;">
      <div class="row">
        <div class="col-5">
          <tui-scrollbar>
            <div style="max-height: 80vh">
              <table class="tui-table">
                <tbody>
                  @for(item of plotted; track item?.id){
                  <tr class="tui-table__tr tui-table__tr_border">
                    <td class="tui-table__td tui-text_body-m">
                      {{ item?.key }}
                    </td>
                    <td class="tui-table__td tui-text_body-m">
                      {{ item?.value }}
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
          </tui-scrollbar>
        </div>
        <div
          class="col-2 d-flex flex-column align-items-center justify-content-center"
        >
          <tui-badge
            status="success"
            class="tui-space_right-2 tui-space_bottom-4"
            [value]="algorithm + ' Algorithm'"
            size="l"
          ></tui-badge>
          <tui-svg src="tuiIconArrowRightLarge"></tui-svg>
        </div>
        <div class="col-5">
          <table class="tui-table">
            <tbody>
              @for(item of result; track item?.id){
              <tr class="tui-table__tr tui-table__tr_border">
                <td class="tui-table__td tui-text_body-m">{{ item?.key }}</td>
                <td class="tui-table__td tui-text_body-m">{{ item?.value }}</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrl: './analyticResult.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticResultComponent {
  constructor(
    @Inject(TuiDialogService)
    private readonly dialogs: TuiDialogService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<number, number>
  ) {}

  get data(): any {
    return this.context.data;
  }

  get result(): any[] {
    const list: any[] = [];
    const data: any = this.context.data;
    const result = data?.result;
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const value = result[key];

        list.push({ key, value });
      }
    }
    return list;
  }

  get algorithm(): string {
    const data: any = this.context.data;
    console.log(data);

    const algorithm = data?.algorithm;
    return algorithm;
  }

  get plotted(): any[] {
    const list: any[] = [];
    const data: any = this.context.data;
    const plotted = data?.plotted;
    for (const key in plotted) {
      if (Object.prototype.hasOwnProperty.call(plotted, key)) {
        const value = plotted[key];

        list.push({ key, value });
      }
    }
    return list;
  }
}
