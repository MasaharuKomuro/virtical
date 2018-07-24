import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import * as moment from 'moment-mini';

/**
 * Generated class for the ControlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-control',
  templateUrl: 'control.html',
})
export class ControlPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private store: AngularFirestore ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ControlPage');
  }

  // ポーカー店をDB登録する
  public setPokerSpot = () => {
    const poker_spot_ref = this.store.collection('poker_spot' );
    const now = moment().format( 'YYYY-MM-DD H:mm:ss' );

    const spots = [
      { name: "Nine Field", address1: "群馬県太田市飯田町1069", address2: "", address_description: "", tel: "0276-49-5640", updated_at: now },
      { name: "Birds Eye", address1: "東京都武蔵野市吉祥寺本町1-22-10", address2: "寿々木B1F", address_description: "総武線 / 吉祥寺町 徒歩5分", tel: "0422-20-2072", updated_at: now },
      { name: "DOPE CLUB -roppongi-", address1: "東京都港区六本木4-10-11", address2: "八巻ビル2F", address_description: "千代田線 / 乃木坂駅 徒歩3分", tel: "", updated_at: now },
      { name: "煌Bar&amp;Lounge", address1: "港区白金6-6-1", address2: "ンション芝白金2Ｆ", address_description: "東京メトロ白金高輪駅より徒歩10分", tel: "03-6277-1373", updated_at: now },
      { name: "AZB10", address1: "東京都港区麻布十番1-11-3", address2: "東亜ビル6F", address_description: "東京メトロ麻布十番駅より徒歩１分", tel: "080-7974-9880", updated_at: now },
      { name: "EDGE", address1: "荒川区西日暮里5目12－11", address2: "コピタービル４F", address_description: "JR西日暮里駅より徒歩2分", tel: "03-5604-5354", updated_at: now },
      { name: "Pool &amp; Darts Cafe side", address1: "東京都練馬区桜台1-8-2", address2: "ニュー桜台ビルB1 西武池袋線桜台駅より徒歩３分", tel: "03-6914-8975", updated_at: now },
      { name: "中野 P - labo", address1: "東京都中野区中野5-32-4", address2: "中野ステーションハイツ505", address_description: "JR中野駅より徒歩2分", tel: "090-2550-7755", updated_at: now },
      { name: "ゲームスペース柏木", address1: "新宿区百人町1-24-7", address2: "", address_description: "JR / 大久保駅南口 徒歩3分", tel: "03-5937-1977", updated_at: now },
      { name: "Flamingo", address1: "静岡県静岡市葵区瀬名中央4-7-3", address2: "", address_description: "JR / 草薙駅 徒歩15分", tel: "054-208-3122", updated_at: now },
      { name: "grabs", address1: "名古屋市中区栄2目7-13", address2: "ヴィア白川B1F", address_description: "JR / 名古屋駅 徒歩20分", tel: "052-202-5600", updated_at: now },
      { name: "Juicy Lucy", address1: "愛知県名古屋市緑区鴻仏目1-304", address2: "", address_description: "名鉄本戦 / 左京山駅 車8分", tel: "052-878-8381", updated_at: now },
      { name: "Ritz", address1: "愛知県名古屋市中区栄3-13-1", address2: "南呉服町ビル３Ｆ", address_description: "名古屋市営地下鉄栄駅より徒歩５分", tel: "052-261-0076", updated_at: now },
      { name: "DAYSY", address1: "愛知県 名古屋市中区新栄1-11-14", address2: "東泉ニュータウンビル5F", address_description: "名古屋市営地下鉄栄駅より徒歩１１分", tel: "052-265-5727", updated_at: now },
      { name: "Liiink", address1: "三重県四日市市諏訪栄町4-9", address2: "長谷川ビル2Ｆ", address_description: "近鉄 / 四日市駅 徒歩1分", tel: "059-329-5303", updated_at: now },
      { name: "shot gun", address1: "滋賀県栗東市出庭516-7", address2: "", address_description: "JR / 守山駅 車6分", tel: "077-552-2400", updated_at: now },
      { name: "POOL BLOW", address1: "京都府京都市右京区西京極新田町21", address2: "", address_description: "JR / 京都駅 車10分", tel: "075-321-0133", updated_at: now },
      { name: "Jet", address1: "京都市下京区西七条南月読町101", address2: "", address_description: "JR京都線西大路駅徒歩12分", tel: "075-754-7428", updated_at: now },
      { name: "Poker CLUB M", address1: "大阪市北区曽根崎新地2-6-21", address2: "GUILD 5F", address_description: "JR / 大阪駅 徒歩9分", tel: "06-6131-9033", updated_at: now },
      { name: "T-two", address1: "大阪府大阪市中央区東心斎橋2-4-19", address2: "屋町ギャラクシービル3号館3階", address_description: "地下鉄御堂筋線心斎橋駅6番出口から徒歩5分", tel: "06-6212-7781", updated_at: now },
      { name: "Straight Pool", address1: "大阪市中央区南船場2-10-21", address2: "宝サンキュービル1階", address_description: "大阪市営地下鉄心斎橋駅徒歩10分", tel: "06-6241-6610", updated_at: now },
      { name: "Hurly Burly", address1: "大阪市西区北堀江1-4-14", address2: "H2Oビル1F・B1", address_description: "地下鉄 / 四ツ橋駅 徒歩1分", tel: "06-4394-8344", updated_at: now },
      { name: "BLUFF BAR", address1: "大阪府大阪市中央区心斎橋筋2-3-7", address2: "ロイヤル北川4F", address_description: "地下鉄 / なんば駅 徒歩5分", tel: "06-6214-0007", updated_at: now },
      { name: "なにわのマイドロイド", address1: "大阪府大阪市浪速区難波中2-4-8", address2: "アインエステートビル6階", address_description: "南海 / 難波駅 徒歩3分", tel: "06-6632-2118 ", updated_at: now },
      { name: "じゅぴた～", address1: "大阪府大阪市浪速区日本橋4-7-26", address2: "ワンダー3ビル4F", address_description: "南海 / 難波駅 徒歩7分", tel: "06-6586-9306", updated_at: now },
      { name: "POOL JAM 心斎橋", address1: "大阪府大阪市東心斎橋1-18-6", address2: "ギャラリービル3F", address_description: "地下鉄 / 心斎橋駅 徒歩5分", tel: "06-6241-9000", updated_at: now },
      { name: "POOL JAM", address1: "大阪府東大阪市上小阪3-13-22", address2: "", address_description: "地下鉄 / 心斎橋駅 徒歩5分", tel: "06-6730-5044", updated_at: now },
      { name: "Plus2", address1: "大阪府大阪市西区北堀江1-10-2", address2: "レストビル3F", address_description: "地下鉄 / 心斎橋駅 徒歩10分", tel: "06-6532-6577", updated_at: now },
      { name: "柔", address1: "大阪府東大阪市上小阪3-4-2", address2: "", address_description: "JR / 俊徳道駅 車4分", tel: "06-6725-3905", updated_at: now },
      { name: "M's cafe", address1: "大阪府大阪市中央区宗右衛門町3-5", address2: "", address_description: "地下鉄 / 日本橋駅 徒歩7分", tel: "06-6213-6101", updated_at: now },
      { name: "blast", address1: "大阪市浪速区難波中2-7-7", address2: "なんばKFビル3F", address_description: "", tel: "06-6943-8850", updated_at: now },
      { name: "NUTS BAR", address1: "大阪府大阪市中央区西心斎橋21-18", address2: "OPUS1ビル4F", address_description: "地下鉄 / 心斎橋駅 徒歩5分", tel: "06-6484-7072", updated_at: now },
      { name: "CROWD", address1: "大阪府八尾市楠根町2-55-1", address2: "", address_description: "近鉄 / 久宝寺口駅 徒歩16分", tel: "0729-24-7515", updated_at: now },
      { name: "SOHO", address1: "和歌山県和歌山市鳴神973-10", address2: "", address_description: "JR / 和歌山駅 車7分", tel: "073-472-3855", updated_at: now },
      { name: "Tres", address1: "兵庫県神戸市中央区布引町3-2-1", address2: "団布引ビル2F", address_description: "阪急・JR / 三宮駅 徒歩5分", tel: "078-862-1019", updated_at: now },
      { name: "Arekey", address1: "兵庫県西宮市下大市東町１４−８", address2: "", address_description: "阪急今津線 / 門戸厄神駅 徒歩2", tel: "0798-54-1717", updated_at: now },
      { name: "BAD BEATS Bar", address1: "岡山県岡山市駅前町1-10-21", address2: "2F", address_description: "JR / 岡山駅 徒歩5分", tel: "0729-24-7515", updated_at: now },
      { name: "pet itdemon", address1: "広島県広島市中区薬研堀5-6", address2: "Mビル5F", address_description: "広島電鉄 / 銀山駅 徒歩5分", tel: "082-247-7151", updated_at: now },
      { name: "WABISABI", address1: "広島県福山市神辺町川南816-1", address2: "", address_description: "JR / 神辺駅 徒歩13分", tel: "084-962-2811", updated_at: now },
      { name: "backdoorbar", address1: "福岡市中央区西中洲1-4", address2: "ロスぺリタ西中洲Ⅱ 7F-B", address_description: "福岡市地下鉄天神南駅徒歩7分", tel: "092-791-1010", updated_at: now },
      { name: "Bar BULLETS", address1: "沖縄県那覇市牧志2-18-7", address2: "伸産業ビル2Ｆ", address_description: "モノレール / 美栄橋駅 徒歩1分", tel: "080-2753-9831", updated_at: now },
    ];

    spots.map( ( elem ) => {
      poker_spot_ref.add( elem );
    });
  };

  // public test1 = () => {
  //   const data = {
  //     name:                "Nine Field",
  //     address:             {
  //       state: "群馬県",
  //       city:  "太田市",
  //       line:  "飯田町1069"
  //     },
  //     address_description: "",
  //     tel:                 "0276-49-5640"
  //   };
  //   this.store.collection( 'poker_spot' ).doc('test').set( data );
  // };


}
