import { Component, EventEmitter, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, TextInput } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { PokerSpot } from '../../model/pokerSpot';
import { Storage } from '@ionic/storage';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AgmInfoWindow } from '@agm/core';
import { UserProvider } from '../../providers/user/user';
import { AngularFireAuth } from 'angularfire2/auth';

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
  public my_position: google.maps.LatLng;
  // マップの中心地
  public center_position: google.maps.LatLng;

  public map_config = {
    zoom: 11
  };

  private filterSpots = (): PokerSpot[] => {
    return this._spots.filter( ( spot: PokerSpot ) => {
      const target = (spot.name + spot.address1 + spot.address2 + spot.address_description + spot.tel).toLowerCase();
      return target.indexOf( this.filter.toLowerCase() ) !== -1;
    } );
  };

  // 現在地
  public origin: google.maps.LatLng = null;
  // 目的地
  public destination: google.maps.LatLng = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: AngularFirestore,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private geolocation: Geolocation,
    public auth: AngularFireAuth
  ) {}

  // フィルターリングキーワード
  private _filter;

  get filter() {
    return this._filter;
  }

  set filter( value ) {
    this._filter = value;
    this.spots.emit( this.filterSpots() );
  }

  public debug_message: string = '';

  @ViewChildren( AgmInfoWindow ) agmInfoWindows: QueryList<AgmInfoWindow>;

  public show_direction: boolean = false;

  // 距離の近い順に並び替える
  private sortWithDistance = () => {
    if ( !this.my_position || this._spots.length === 0 ) {
      return;
    }
    const latitude = this.my_position.lat();
    const longitude = this.my_position.lng();

    this._spots.sort( ( a: PokerSpot, b: PokerSpot ) => {
      this.debug_message += a.address1 + ' : ' + b.address1;
      if ( !a.geo && !b.geo ) {
        return 0;
      } else if ( !!a.geo && !b.geo ) {
        return 1;
      } else if ( !a.geo && !!b.geo ) {
        return -1;
      }
      this.debug_message += '\n<br>';

      const dist_a = Math.sqrt(
        Math.pow( latitude - a.latitude, 2 ) +
        Math.pow( longitude - a.longitude, 2 ) );
      const dist_b = Math.sqrt(
        Math.pow( latitude - b.latitude, 2 ) +
        Math.pow( longitude - b.longitude, 2 ) );
      return ( dist_a > dist_b ) ? 1 : -1;
    });

    this.spots.emit( this._spots );
  };

  private getMyLocation = () => {
    this.geolocation.getCurrentPosition().then( ( position: Geoposition ) => {
      console.log( position );
      this.my_position     = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
      this.center_position = this.my_position;
      setTimeout( _ => this.spots.emit( this._spots ) );
      this.sortWithDistance();
    } ).catch( ( error ) => {
      console.warn( 'Error getting location', error );
    } );
  };

  private getSpots = () => {
    const loader = this.loadingCtrl.create( {
      content: '読込中...'
    } );
    loader.present();

    this.store.collection( 'poker_spot' ).valueChanges().subscribe( ( spots: PokerSpot[] ) => {
      console.log( spots );
      spots.map( ( spot: PokerSpot ) => {
        this._spots.push( new PokerSpot( spot ) );
      } );
      this.storage.set( 'spots', JSON.stringify( this._spots ) );
      this.spots.emit( this._spots );
      loader.dismiss();
      this.sortWithDistance();
    });
  };

  ionViewDidLoad() {
    console.log( 'ionViewDidLoad SpotsPage' );

    // 位置情報を取得
    this.getMyLocation();

    // スポット一覧を取得する
    this.getSpots();
  }

  test = () => {
    console.log( this.spots );
    console.log( this._spots );
    this.spots.emit( this._spots);
  };

  // 経路を表示する
  showDirection = ( spot: PokerSpot ) => {
    console.log( 'show direction' );
    console.log( spot );
    this.show_direction = false;
    // 前の経路を削除するために、setTimeout に逃す
    setTimeout( _ => {
      this.show_direction = true;
      // 現在地・目的地をセット
      this.origin = new google.maps.LatLng(
        this.my_position.lat(),
        this.my_position.lng() );
      this.destination = new google.maps.LatLng( spot.latitude, spot.longitude );
      // フィルターに目的地を追加
      this.filter = spot.name;
      this.closeAgmInfoWindows();
    }, 300);
  };

  // 全ての infoWindow を閉じる
  public closeAgmInfoWindows = () => {
    this.agmInfoWindows.forEach( ( agmInfoWindow: AgmInfoWindow ) => {
      agmInfoWindow.close();
    } );
  };

  // マップの中央位置を選択した spot に変更する
  public setCenterPosition = ( spot: PokerSpot, event: MouseEvent = null ) => {
    if ( !!event ) {
      event.stopPropagation();
    }
    this.center_position = new google.maps.LatLng( spot.latitude, spot.longitude );
  }
}
