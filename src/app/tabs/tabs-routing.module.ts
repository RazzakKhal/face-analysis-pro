import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../tabs/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'takepicture',
        loadChildren: () => import('../tabs/takepicture/takepicture.module').then(m => m.TakepicturePageModule)
      },
      {
        path: 'scan',
        loadChildren: () => import('../tabs/scan/scan.module').then(m => m.ScanPageModule)
      },
      {
        path: 'score',
        loadChildren: () => import('../tabs/score/score.module').then(m => m.ScorePageModule)
      },
      {
        path: 'success-payment',
        loadChildren: () => import('../tabs/success-payment/success-payment.module').then(m => m.SuccessPaymentPageModule)
      },
      {
        path: 'report',
        loadChildren: () => import('../tabs/report/report.module').then(m => m.ReportPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
      },
      {
        path: 'paywall',
        loadChildren: () => import('./paywall/paywall.module').then(m => m.PaywallPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
