import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScorelessPage } from './scoreless.page';

const routes: Routes = [
  {
    path: '',
    component: ScorelessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScorelessPageRoutingModule {}
