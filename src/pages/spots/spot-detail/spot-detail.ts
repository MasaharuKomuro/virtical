import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { PokerSpot } from 'src/model/pokerSpot';
import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionReference } from 'angularfire2/firestore/interfaces';
import { QuerySnapshot } from 'firebase';

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

  public id: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: AngularFirestore,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpotDetailPage');

    this.getSpotFromName();
  }

  // スポットを名前から検索します
  private getSpotFromName = () => {
    const name: string = this.navParams.get( 'name' );
    const loader = this.loadingCtrl.create({ content: '読込中 ...' });
    loader.present()

    this.store.collection( 'poker_spot', ( ref: CollectionReference ) => {
      console.log( ref );
      ref.where( 'name', '==', name ).get().then( ( result: QuerySnapshot ) => {
        console.log( result );
        if ( result.docs.length === 0 ) {
          console.warn( '店を検索できません。' );
          loader.dismiss();
          const alert = this.alertCtrl.create({
            title: 'スポットを検索できませんでした。',
            buttons: ['OK']
          });
          alert.present();
          return;
        }
        this.spot = result.docs[0].data() as PokerSpot;
        this.id = result.docs[0].id;
        loader.dismiss();
      }).catch( error => {
        console.warn( error );
        loader.dismiss();
      });
    });
  };

}
