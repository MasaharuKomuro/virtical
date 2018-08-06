import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { LoginPageModule } from '../pages/login/login.module';
import { dev_api_key, firebaseConfig } from '../api_keys/firebase';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ControlPageModule } from '../pages/control/control.module';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { AgmCoreModule } from '@agm/core';
import { MapProvider } from '../providers/map/map';
import { AgmDirectionModule } from 'agm-direction';
import { PlayerProvider } from '../providers/player/player';
import { PipesModule } from '../pipes/pipes.module';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from 'angularfire2/storage';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    LoginPageModule,
    ControlPageModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig,{}),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AgmCoreModule.forRoot({
      apiKey: dev_api_key
    }),
    AgmDirectionModule,
    HttpClientModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    MapProvider,
    PlayerProvider,
    File,
    Camera,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {}
