import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScorelessPageRoutingModule } from './scoreless-routing.module';

import { ScorelessPage } from './scoreless.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScorelessPageRoutingModule
  ],
  declarations: [ScorelessPage]
})
export class ScorelessPageModule {}
