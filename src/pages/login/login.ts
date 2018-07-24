import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component( {
  selector:    'page-login',
  templateUrl: 'login.html'
} )
export class LoginPage {

  public email: string;

  public password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public angularFireAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log( 'ionViewDidLoad LoginPage' );
  }

  login() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.angularFireAuth.auth.signInWithEmailAndPassword( this.email, this.password ).then( () => {
      loader.dismiss();
      this.viewCtrl.dismiss();
    } ).catch( err => {
      loader.dismiss();
      let alert = this.alertCtrl.create( {
        title:    'ログインエラー',
        subTitle: 'ログインできませんでした。',
        buttons:  [ 'OK' ]
      } );
      alert.present();
    });
  }

  logout(): void {// 変更
    this.angularFireAuth.auth.signOut().then(() => {
    }).then(() => alert('ログアウトしました。'))
    .catch( err => {
      console.log(err);
      alert('ログアウトに失敗しました。\n' + err);
    })
  }

}
