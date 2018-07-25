import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ControlPage } from './control';
import { MapProvider } from '../../providers/map/map';

@NgModule({
  declarations: [
    ControlPage
  ],
  imports: [
    IonicPageModule.forChild(ControlPage)
  ],
  providers: [
    MapProvider
  ]
})
export class ControlPageModule {}
