import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AboutPageModule } from '../pages/about/about.module';
import { ContactPageModule } from '../pages/contact/contact.module';
import { ArticlePageModule } from '../pages/article/article.module';
import { AngularFireModule } from 'angularfire2';
import { LoginPageModule } from '../pages/login/login.module';
import { firebaseConfig } from '../api_keys/firebase';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
  ],
  imports: [
    AboutPageModule,
    ContactPageModule,
    ArticlePageModule,
    BrowserModule,
    LoginPageModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig,{}),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
