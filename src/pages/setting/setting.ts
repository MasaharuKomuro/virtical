import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionReference } from 'angularfire2/firestore/interfaces';
import { PlayerProvider } from '../../providers/player/player';
import { Player } from '../../model/Player';

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

  public player: Player;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public auth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private store: AngularFirestore,
    private alertCtrl: AlertController,
    public playerProvider: PlayerProvider
    ) {
    const loading = this.loadingCtrl.create( { content: '読込中 ...'} );
    loading.present();
    const wait_for_player = setInterval( () => {
      if ( !!this.playerProvider.player ) {
        clearInterval( wait_for_player );
        this.playerProvider.player.subscribe( ( player: Player ) => {
          console.log( player );
          console.log( player.photoURL );
          this.displayName = !!player.displayName ? player.displayName : '';
          this.photoURL = !!player.photoURL ? player.photoURL : '';
          this.player = player;
          loading.dismiss();
        } );
      }
    }, 100);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  // プロフィールを更新する
  public updateUserProfile = () => {
    const loading = this.loadingCtrl.create( { content: '読込中...' } );
    loading.present();

    // 更新用のデータを作成する
    const set_data = {};
    if ( !!this.displayName ) {
      set_data['displayName'] = this.displayName;
    }
    if ( !!this.photoURL ) {
      set_data['photoURL'] = this.photoURL;
    }
    if ( Object.keys( set_data ).length === 0 ) {
      // 入力されていません
      loading.dismiss();
    }

    // 更新を実行する
    this.store.collection( 'players', ( ref: CollectionReference ) => {
      ref.doc( this.player.uid ).set( set_data, { merge: true } ).then( () => {
        loading.dismiss();
      }).catch( error => {
        loading.dismiss();
        this.alertCtrl.create( {
          title: '更新に失敗しました。',
          buttons: ['OK']
        } )
      });
      return ref;
    } );
  };

}
