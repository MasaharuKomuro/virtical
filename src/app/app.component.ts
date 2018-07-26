import { Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = 'TabsPage';

  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private auth: AngularFireAuth, private modalCtrl: ModalController
  ) {
      console.log( location.href );
    platform.ready().then(() => {

      // statusBar.styleDefault();
      // splashScreen.hide();

      this.auth.authState.subscribe( ( user: User ) => {

        // ログインしていない
        if ( !user ) {
          let contactModal = this.modalCtrl.create( 'LoginPage' );
          contactModal.present();
        }
      });
    });
  }
}
