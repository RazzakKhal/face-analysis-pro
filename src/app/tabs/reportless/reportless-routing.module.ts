import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportlessPage } from './reportless.page';

const routes: Routes = [
  {
    path: '',
    component: ReportlessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportlessPageRoutingModule {}
