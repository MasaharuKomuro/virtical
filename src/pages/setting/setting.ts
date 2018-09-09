import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionReference } from 'angularfire2/firestore/interfaces';
import { PlayerProvider } from '../../providers/player/player';
import { Player } from '../../model/Player';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Rx';
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { UploadTaskSnapshot } from 'angularfire2/storage/interfaces';
import { ImageHandle } from '../../providers/util/image-handle';

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

  public player: Player;

  public image_uri_for_preview: SafeUrl;

  public is_cordova_env: boolean;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public auth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private store: AngularFirestore,
    private alertCtrl: AlertController,
    public playerProvider: PlayerProvider,
    private camera: Camera,
    private domSanitizer: DomSanitizer,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private storage: AngularFireStorage,
    private imageHandle: ImageHandle
  ) {
  }

  ionViewDidLoad() {
    this.init();
    console.log('ionViewDidLoad SettingPage');
  }

  public init = () => {
    this.is_cordova_env = this.platform.is('cordova' );
    const loading = this.loadingCtrl.create( { content: '読込中 ...'} );
    loading.present();

    // プレイヤー情報をセットする
    this.playerProvider.player.subscribe( ( player: Player ) => {
      console.log( player );
      console.log( player.thumbnail_path );
      this.displayName = !!player.displayName ? player.displayName : '';
      this.player = player;
      this.imageHandle.getProfilePictureUrl( player ).subscribe( ( url ) => {
        this.image_uri_for_preview = url;
      });
      loading.dismiss();
    } );
  };

  // プロフィールを更新する
  public updateUserProfile = () => {
    const loading = this.loadingCtrl.create( { content: 'プロフィールを更新中 ...' } );
    loading.present();

    // 更新用のデータを作成する
    const set_data = {};
    if ( !!this.displayName ) {
      set_data['displayName'] = this.displayName;
    }
    if ( !!this.player.thumbnail_path ) {
      set_data['thumbnail_path'] = this.player.thumbnail_path;
    }
    if ( Object.keys( set_data ).length === 0 ) {
      // 入力されていません
      loading.dismiss();
    }

    // 更新を実行する
    console.log(`set data: `);
    console.log(set_data);
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

  // 入力ソースを選択する
  public imageSourceSelection = () => {

    // アクションシートを表示して、ソースを選択させる
    const actionSheet = this.actionSheetCtrl.create({
      title: '画像を選択',
      buttons: [
        {
          text: '撮影する',
          icon: 'camera',
          handler: this.getImage( this.camera.PictureSourceType.CAMERA )
        },{
          text: '保存された画像を選択する',
          icon: 'folder',
          handler: this.getImage( this.camera.PictureSourceType.PHOTOLIBRARY )
        },{
          text: '戻る',
          role: 'cancel',
          handler: () => { console.log('Cancel clicked'); }
        }
      ]
    });
    actionSheet.present();
  };

  // 画像をsource_typeの方法で取得する
  public getImage( source_type: number ) {
    return () => {
      const options: CameraOptions = {
        quality:         100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType:      source_type,
        allowEdit:       true,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.JPEG
      };

      const getPicture = this.camera.getPicture( options );

      // なぜかファイル入力モーダルが立ち上がらないので、強制的に発火
      if ( !!document.querySelector( '.cordova-camera-select' ) ) {
        ( document.querySelector( '.cordova-camera-select' ) as HTMLElement ).click();
      }

      getPicture.then( ( imageData ) => {
        // base64にエンコードされた結果を受け取る
        const image_uri = 'data:image/jpeg;charset=utf-8;base64, ' + imageData;
        // プレビュー用の変換もしておく
        this.image_uri_for_preview = this.domSanitizer.bypassSecurityTrustUrl( image_uri );
        // 画像をストレージにアップロードする
        this.uploadImage( image_uri );
      }, ( err ) => {
        console.log( err );
        const alert = this.alertCtrl.create( {
          title:   '画像を選択できません。',
          buttons: [ 'OK' ]
        } );
        alert.present();
      } );
    }
  }

  // プロフィール画像をアップロードする
  public uploadImage( image_uri: string ) {
    let loader = this.loadingCtrl.create({
      content: "アップロード中 ..."
    });
    loader.present();

    return Observable.fromPromise(
      this.storage.ref( 'image/' + this.player.uid ).putString( image_uri, 'data_url' )
      .then( ( snapshot: UploadTaskSnapshot ) => {
        loader.dismiss();
        console.log( snapshot );
        console.log( 'アップロード完了' );
        this.player.thumbnail_path = snapshot.metadata.fullPath;
        console.log( this.player);
      }).catch( ( error ) => {
        loader.dismiss();
        console.log( error );
        console.log( 'アップロード失敗' );
      })
    );
  };

}
