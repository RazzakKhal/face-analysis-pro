import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaywallPage } from './paywall.page';

const routes: Routes = [
  {
    path: '',
    component: PaywallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaywallPageRoutingModule {}
