import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TakepicturePageRoutingModule } from './takepicture-routing.module';

import { TakepicturePage } from './takepicture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TakepicturePageRoutingModule
  ],
  declarations: [TakepicturePage]
})
export class TakepicturePageModule {}
