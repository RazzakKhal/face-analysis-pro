import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TakepicturePage } from './takepicture.page';

const routes: Routes = [
  {
    path: '',
    component: TakepicturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TakepicturePageRoutingModule {}
