import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportlessPageRoutingModule } from './reportless-routing.module';

import { ReportlessPage } from './reportless.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportlessPageRoutingModule
  ],
  declarations: [ReportlessPage]
})
export class ReportlessPageModule {}
