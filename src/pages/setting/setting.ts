import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  public displayName: string;

  public photoURL: string;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public auth: AngularFireAuth,
    private loadingCtrl: LoadingController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    const loading = this.loadingCtrl.create( { content: '読込中...' } );
    loading.present();
    this.auth.user.subscribe( ( user: User ) => {
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      loading.dismiss();
    });
  }

  // プロフィールを更新する
  public updateUserProfile = () => {
    this.auth.user.subscribe( ( user: User ) => {
      user.updateProfile({ displayName: this.displayName, photoURL: this.photoURL })
    });
  };

}
