import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import {
  TuiScrollbarModule,
  TuiDialogContext,
  TuiDialogService,
} from '@taiga-ui/core';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-analytic-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="m-2">
      <table class="tui-table">
        <tbody>
          @for(item of result; track item?.id){ 
            <tr class="tui-table__tr tui-table__tr_border">
              <td class="tui-table__td tui-text_body-m">{{item?.key}}</td>
              <td class="tui-table__td tui-text_body-m">{{item?.value}}</td>
            </tr>
          }
        </tbody>
      </table>
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

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];

        list.push({ key, value });
      }
    }

    return list;
  }
}
