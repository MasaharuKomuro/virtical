import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotDetailPage } from './spot-detail';

@NgModule({
  declarations: [
    SpotDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotDetailPage),
  ],
})
export class SpotDetailPageModule {}
