import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotsPage } from './spots';
import { AgmCoreModule } from '@agm/core';
import { dev_api_key } from '../../api_keys/firebase';

@NgModule({
  declarations: [
    SpotsPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotsPage),
    AgmCoreModule.forRoot({
      apiKey: dev_api_key
    })
  ],
})
export class SpotsPageModule {}
