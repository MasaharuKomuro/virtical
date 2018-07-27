import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { PokerSpot } from '../../../model/pokerSpot';
import { AngularFirestore, Query } from 'angularfire2/firestore';
import { CollectionReference } from 'angularfire2/firestore/interfaces';
import { Loading } from 'ionic-angular/components/loading/loading';
import { Comment } from '../../../model/Comment';

/**
 * Generated class for the SpotDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'page-spot-detail/:name',
  defaultHistory: [ 'SpotsPage' ]
})
@Component({
  selector: 'page-spot-detail',
  templateUrl: 'spot-detail.html',
})
export class SpotDetailPage {

  public spot: PokerSpot;

  public spot_id: string; // poker_spot.id

  public comments: Comment[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: AngularFirestore,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpotDetailPage');

    this.getSpotFromName();
  }

  // スポットを名前からスポットの全情報を検索する
  private getSpotFromName = () => {
    const name: string = this.navParams.get( 'name' );
    const loader = this.loadingCtrl.create({ content: '読込中 ...' });
    loader.present();

    this.store.collection( 'poker_spot', ( ref: CollectionReference ) => {
      const query: Query = ref.where( 'name', '==', name )
      return query;
    }).snapshotChanges().subscribe( ( spots ) => {

      if ( spots.length === 0 ) {
        console.warn( 'スポットを検索できません。' );
        loader.dismiss();
        const alert = this.alertCtrl.create({
          title: 'スポットを検索できませんでした。',
          buttons: ['OK']
        });
        alert.present();
        return;
      }
      this.spot = new PokerSpot( spots[0].payload.doc.data() );
      this.spot_id = spots[0].payload.doc.id;

      // コメントを取得する
      this.getComments( loader );
    }, error => {
      console.warn( 'スポットを検索できません。' );
      loader.dismiss();
      const alert = this.alertCtrl.create({
        title: 'スポットを検索できませんでした。',
        buttons: ['OK']
      });
      alert.present();
      return;
    });
  };

  // コメント投稿画面を開きます
  public openPostCommentModal = () => {
    const modal = this.modalCtrl.create( 'PostCommentModalPage', { spot_id: this.spot_id } );
    modal.present();
  };

  // コメントを取得する
  public getComments = ( loader?: Loading ) => {
    this.store.collection( 'spot_comments', ( ref ) => {
      const query: Query = ref.doc( this.spot_id ).collection( 'comments' )
        .orderBy( 'created_at', 'desc' );
      console.log( ref );
      return query;
    } ).valueChanges().subscribe( ( comments: Comment[] ) => {
      console.log( 'コメントが更新されました' );
      this.comments = comments;

      // ユーザ情報を取得する
      if ( !!this.loadingCtrl ) {
        loader.dismiss();
      }
    });
  };

}
