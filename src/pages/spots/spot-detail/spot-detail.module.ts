import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotDetailPage } from './spot-detail';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SpotDetailPage
  ],
  imports: [
    IonicPageModule.forChild(SpotDetailPage),
    PipesModule
  ],
})
export class SpotDetailPageModule {}
