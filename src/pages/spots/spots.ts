import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from 'angularfire2/firestore';
import { PokerSpot } from '../../model/pokerSpot';

/**
 * Generated class for the SpotsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-spots',
  templateUrl: 'spots.html',
})
export class SpotsPage {

  public spots: PokerSpot[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: AngularFirestore,
    private loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpotsPage');

    const loader = this.loadingCtrl.create({
      content: "読込中..."
    });
    loader.present();

    this.store.firestore.collection( 'poker_spot' ).get().then( ( snapShot: QuerySnapshot<PokerSpot> ) => {
      snapShot.docs.map( ( doc: QueryDocumentSnapshot<PokerSpot> ) => {
        this.spots.push( new PokerSpot( doc.data() as PokerSpot ) );
      });
      loader.dismiss();
    }).catch( error => {
      console.log( error );
      loader.dismiss();
    });
  }

}
