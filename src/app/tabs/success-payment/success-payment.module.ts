import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessPaymentPageRoutingModule } from './success-payment-routing.module';

import { SuccessPaymentPage } from './success-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessPaymentPageRoutingModule
  ],
  declarations: [SuccessPaymentPage]
})
export class SuccessPaymentPageModule {}
