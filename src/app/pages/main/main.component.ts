import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  TuiCarouselModule,
  TuiIslandModule,
  TuiActionModule,
  TuiPaginationModule,
} from '@taiga-ui/kit';
import { TuiSvgModule, TuiButtonModule } from '@taiga-ui/core';

interface MembersInfoType {
  name: string;
  rollNo: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiCarouselModule,
    TuiIslandModule,
    TuiActionModule,
    TuiPaginationModule,
  ],
  providers: [],
  template: `
    <div class="container  py-5">
      <div class="row pb-3">
        <div class="col">
          <img src="assets/img/logo.png" />
        </div>
      </div>
      <div class="row pb-3">
        <div class="col-6">
          <p class="tui-text_h6 mt-4">Welcome to</p>
          <p class="tui-text_h2">Chronic Kidney Disease</p>
          <p class="tui-text_h6 mb-2">Semester Project For</p>
          <p class="tui-text_h6 " style="color: #4ac99b;">
            Tools & Techniques For Data Sciences
          </p>
          <p class="tui-text_h6 px-1" style="color: var(--tui-text-03)">
            Dr. Syed Hasan Adil & Engr. Muhammad Anas
          </p>
        </div>
        <div class="col-4 d-flex align-items-center pt-5">
          <div style="height: 100%; width: 100%;">
            <div tuiCarouselButtons>
              <tui-carousel
                #carousel
                class="carousel"
                [duration]="3000"
                [index]="index()"
                (indexChange)="onIndexChange($event)"
              >
                @for(member of MemberList(); track member.name){
                <tui-island size="l" textAlign="center" *tuiItem>
                  <div class="tui-island__content">
                    <p class="tui-island__category">Member</p>
                    <h3 class="tui-island__title">
                      <tui-svg src="tuiIconUserLarge" class="m-3"></tui-svg>
                      <br />
                      {{ member.name }}
                    </h3>
                    <p class="tui-island__paragraph">{{ member.rollNo }}</p>
                  </div>
                </tui-island>
                }
              </tui-carousel>
              <br />
              <tui-pagination
                size="s"
                class="pagination"
                [length]="MemberList().length"
                [index]="index()"
                (indexChange)="onIndexChange($event)"
              ></tui-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="row pb-5">
        <div class="col">
          <button
            appearance="accent"
            tuiButton
            type="button"
            size="m"
            class="tui-space_right-3 tui-space_bottom-3"
            [routerLink]="['/home']"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  public index = signal<number>(0);
  public MemberList = signal<MembersInfoType[]>([]);

  constructor() {
    this.MemberList.set([
      {
        name: 'Zeeshan Ali',
        rollNo: 'MSDS-23101132',
      },
      {
        name: 'Ume Farwa Ali Pirzada',
        rollNo: 'MSDS-23101130',
      },
      {
        name: 'Mariha Noor Larik',
        rollNo: 'MSDS-23101136',
      },
    ]);
  }

  onIndexChange(e: number) {
    this.index.set(e);
  }
}
