import { Routes } from '@angular/router';

// COMPONENTS
import { MainComponent } from './pages/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { EdaComponent } from './pages/eda/eda.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
  },
  {
    path: 'eda',
    component: EdaComponent,
  },
];
