import { Component, EventEmitter, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, TextInput } from 'ionic-angular';
import { AngularFirestore, QueryDocumentSnapshot, QuerySnapshot } from 'angularfire2/firestore';
import { PokerSpot } from '../../model/pokerSpot';
import { Storage } from '@ionic/storage';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@IonicPage()
@Component( {
  selector:    'page-spots',
  templateUrl: 'spots.html'
} )
export class SpotsPage {

  @ViewChild( 'filter_keyword_input' ) filter_keyword_input: TextInput;

  public _spots: PokerSpot[] = [];

  public spots = new EventEmitter<PokerSpot[]>();

  // 現在地
  public geo_position: Geoposition;

  public map_config = {
    zoom: 11
  };

  private filterSpots = (): PokerSpot[] => {
    return this._spots.filter( ( spot: PokerSpot ) => {
      const target = (spot.name + spot.address1 + spot.address2 + spot.address_description + spot.tel).toLowerCase();
      return target.indexOf( this.filter.toLowerCase() ) !== -1;
    } );
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: AngularFirestore,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private geolocation: Geolocation
  ) {
  }

  // フィルターリングキーワード
  private _filter;

  get filter() {
    return this._filter;
  }

  set filter( value ) {
    this._filter = value;
    console.log( 'set' );
    this.spots.emit( this.filterSpots() );
  }

  ionViewDidLoad() {
    console.log( 'ionViewDidLoad SpotsPage' );

    // 位置情報を取得
    this.geolocation.getCurrentPosition().then( ( position: Geoposition ) => {
      console.log( position );
      this.geo_position = position;
    } ).catch( ( error ) => {
      console.warn( 'Error getting location', error );
    } );

    const loader = this.loadingCtrl.create( {
      content: '読込中...'
    } );
    loader.present();

    this.storage.get( 'spots' ).then( ( spots: string ) => {
      this._spots = JSON.parse( spots ) || [];

      if ( !!this._spots && this._spots.length !== 0 ) {
        this.spots.emit( this._spots );
        loader.dismiss();
      } else {
        console.log( 'ポーカースポット情報を取得' );
        this.store.firestore.collection( 'poker_spot' ).get().then( ( snapShot: QuerySnapshot<PokerSpot> ) => {
          console.log( snapShot );
          snapShot.docs.map( ( doc: QueryDocumentSnapshot<PokerSpot> ) => {
            this._spots.push( new PokerSpot( doc.data() as PokerSpot ) );
          } );
          this.storage.set( 'spots', JSON.stringify( this._spots ) );
          this.spots.emit( this._spots );
          loader.dismiss();
        } ).catch( error => {
          console.log( error );
          loader.dismiss();
        } );
      }
    } );
  }

}
