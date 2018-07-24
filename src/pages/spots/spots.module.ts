import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotsPage } from './spots';

@NgModule({
  declarations: [
    SpotsPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotsPage),
  ],
})
export class SpotsPageModule {}
