import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionReference } from 'angularfire2/firestore/interfaces';
import { PlayerProvider } from '../../providers/player/player';
import { Player } from '../../model/Player';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

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

  public imageURI: any;

  public imageFileName: any;

  public is_cordova_env: boolean;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public auth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private store: AngularFirestore,
    private alertCtrl: AlertController,
    public playerProvider: PlayerProvider,
    private camera: Camera,
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer,
    private platform: Platform
  ) {
    this.is_cordova_env = this.platform.is('cordova' );
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
        const alert = this.alertCtrl.create( {
          title: '更新に失敗しました。',
          buttons: ['OK']
        } );
        alert.present();
      });
      return ref;
    } );
  };

  public getImage() {
    console.log( 'image' );
    const options: CameraOptions = {
      quality:         100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType:      this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit:       true
    };

    const getPicture = this.camera.getPicture( options );

    // なぜかファイル入力モーダルが立ち上がらないので、強制的に発火
    if ( !!document.querySelector( '.cordova-camera-select' ) ) {
      (document.querySelector( '.cordova-camera-select' ) as HTMLElement).click();
    }

    getPicture.then( ( imageData ) => {
      this.imageURI = this.domSanitizer.bypassSecurityTrustUrl(
        'data:image/jpeg;charset=utf-8;base64, ' + imageData
      );
      console.log( this.httpClient );
    }, ( err ) => {
      console.log( err );
      const alert = this.alertCtrl.create( {
        title:   '写真を選択できません。',
        buttons: [ 'OK' ]
      } );
      alert.present();
    } );
  }

}
