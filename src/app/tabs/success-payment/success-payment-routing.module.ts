import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessPaymentPage } from './success-payment.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessPaymentPageRoutingModule {}
