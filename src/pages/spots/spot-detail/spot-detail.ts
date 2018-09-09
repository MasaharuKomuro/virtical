import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonicPage,
  LoadingController,
  ModalController, NavController,
  NavParams
} from 'ionic-angular';
import { PokerSpot } from '../../../model/pokerSpot';
import { AngularFirestore, Query } from 'angularfire2/firestore';
import { CollectionReference, DocumentChangeAction } from 'angularfire2/firestore/interfaces';
import { Loading } from 'ionic-angular/components/loading/loading';
import { Comment } from '../../../model/Comment';
import { Player } from '../../../model/Player';
import { PlayerProvider } from '../../../providers/player/player';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { ImageHandle } from '../../../providers/util/image-handle';

/**
 * Genemy_rated class for the SpotDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'detail/:name',
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

  public rate_average: number = 3; // 0は評価なし

  public my_rate: number = 3;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: AngularFirestore,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    public playerProvider: PlayerProvider,
    private auth: AngularFireAuth,
    private imageHandle: ImageHandle
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpotDetailPage');

    this.getSpotFromName();
  }

  // スポット名からスポットの全情報を検索する
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
        loader.dismiss().catch(() => {});
        const alert = this.alertCtrl.create({
          title: 'スポットを検索できませんでした。',
          buttons: ['OK']
        });
        alert.present();
        return;
      }
      this.spot = new PokerSpot( spots[0].payload.doc.data() );
      this.spot_id = spots[0].payload.doc.id;
      this.my_rate = this.spot.rate[ this.playerProvider.user.uid ] || 3;

      // 平均レートをセットする
      this.setRateAverage();

      // コメントを取得する
      this.getComments( loader );
    }, error => {
      console.warn( 'スポットを検索できません。' );
      loader.dismiss().catch(() => {});
      const alert = this.alertCtrl.create({
        title: 'スポットを検索できませんでした。',
        buttons: ['OK']
      });
      alert.present();
      return;
    });
  };

  // 返金評価をセットする
  public setRateAverage = () => {
    if ( !!this.spot.rate ) {
      let sum = 0;
      for ( const key in this.spot.rate ) {
        if ( this.spot.rate.hasOwnProperty( key ) ) {
          sum += this.spot.rate[key];
        }
      }
      this.rate_average = sum / Object.keys( this.spot.rate ).length;
    } else {
      this.rate_average = 0;
    }
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
    } ).snapshotChanges().subscribe( ( dcActions: DocumentChangeAction<Comment>[] ) => {
      console.log( 'コメントが更新されました' );

      this.comments = [];
      dcActions.map( dcAction => {
        const comment: Comment = new Comment( dcAction.payload.doc.data() );
        comment.comment_id = dcAction.payload.doc.id;
        this.comments.push( comment );
      });

      // ユーザ情報を取得する
      // 全てのユーザ情報を取得して、コメントに join する
      this.store.collection( 'players' ).valueChanges().subscribe( ( players: Player[] ) => {
        this.comments.forEach( ( comment: Comment) => {
          comment.player = players.find( ( player: Player ) => {
            return player.uid === comment.uid;
          });
          this.imageHandle.getProfilePictureUrl( comment.player ).subscribe();
        });
      });
      loader.dismiss().catch(() => {});
    });
  };

  // コメントを編集するアクションシートを表示する
  public openActionSheet = ( index: number ) => {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'のコメントの変更',
      buttons: [
        {
          text: '削除',
          role: 'destructive',
          icon: 'trash',
          handler: this.deleteConfirm( this.comments[ index ] )
        },{
          text: '編集',
          icon: 'refresh',
          handler: this.editComment( this.comments[ index ] )
        },{
          text: '戻る',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  };

  // コメントを編集する
  private editComment = ( comment: Comment ) => {
    return () => {
      const modal = this.modalCtrl.create( 'PostCommentModalPage', {
        spot_id: this.spot_id, action: 'edit', comment: comment } );
      modal.present();
    };
  };

  // 本当に消していいか確認する
  private deleteConfirm = ( comment: Comment ) => {
    return () => {
      const alert = this.alertCtrl.create({
        title: '本当に削除してよろしいですか？',
        message: 'この操作は戻せません。',
        buttons: [
          {
            text: '戻る',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: '消す',
            handler: this.deleteComment( comment )
          }
        ]
      });
      alert.present();
    }
  };

  // コメントを削除する
  private deleteComment = ( comment: Comment ) => {
    return () => {
      const loading = this.loadingCtrl.create({ content: '削除中 ...' });
      loading.present();

      // 認証状態を確認する
      this.auth.authState.subscribe( ( user: User ) => {
        if ( !user ) {
          const alert = this.alertCtrl.create({
            title:    '認証エラー',
            subTitle: 'ログイン情報が確認できませんでした。再度ログインしてください。',
            buttons:  [ 'OK' ]
          });
          alert.present();
          loading.dismiss().catch(() => {});
        }

        // 削除する
        this.store.collection( 'spot_comments', ( ref ) => {
          console.log( '消す対象 ');
          console.log( comment.comment_id );
          ref.doc( this.spot_id ).collection( 'comments' ).doc( comment.comment_id ).delete()
            .then( () => {
              console.log( '削除成功' );
              loading.dismiss().catch(() => {});
          }).catch( error => {
            const alert = this.alertCtrl.create({
              title:    '削除処理に失敗しました。',
              buttons:  [ 'OK' ]
            });
            alert.present();
          });
          return ref;
        })
      });
    };
  };

  public goodOrBad = ( index: number, action: 'good' | 'bad' ) => {
    const loading = this.loadingCtrl.create({ content: '更新中 ...' });
    loading.present();

    // とりあえず認証状態を確認する
    this.auth.authState.subscribe( ( user: User ) => {
      if ( !user ) {
        const alert = this.alertCtrl.create( {
          title:    '認証エラー',
          subTitle: 'ログイン情報が確認できませんでした。再度ログインしてください。',
          buttons:  [ 'OK' ]
        } );
        alert.present();
        loading.dismiss().catch(() => {});
      }

      const comment: Comment = this.comments[ index ];

      console.log( 'from' );
      console.log( comment[action] );

      // good or bad のアクションを反映する

      if ( !!comment[ action ] ) {
        if ( !!comment[ action ][ user.uid ] ) {
          delete comment[ action ][ user.uid ];
        } else {
          comment[ action ][user.uid] = true;
        }
      } else {
        comment[ action ] = { [user.uid]: true };
      }

      // アクションの保存を反映する
      this.store.collection( 'spot_comments', ( ref ) => {
        ref.doc( this.spot_id ).collection( 'comments' ).doc( comment.comment_id ).update(
          action, comment[action] ).then( () => {
          console.log( '成功' );
          loading.dismiss().catch(() => {});
        }).catch( error => {
          console.warn( error );
          const alert = this.alertCtrl.create({
            title:    'いいね処理に失敗しました。',
            buttons:  [ 'OK' ]
          });
          loading.dismiss();
          alert.present();
        });
        return ref;
      } );
    });
  };

  // いいね もしくは バッド の数を返す
  public getGoodsOrBadsLength = ( index: number, action: string ) => {
    if ( !this.comments[index][action] ) {
      return 0;
    }
    return Object.keys( this.comments[index][action] ).length;
  };

  // my_rate を登録する
  public submitRate = () => {
    const loading = this.loadingCtrl.create({ content: '更新中 ...' });
    loading.present();

    // とりあえず認証状態を確認する
    this.auth.authState.subscribe( ( user: User ) => {
      if ( !user ) {
        const alert = this.alertCtrl.create( {
          title:    '認証エラー',
          subTitle: 'ログイン情報が確認できませんでした。再度ログインしてください。',
          buttons:  [ 'OK' ]
        } );
        alert.present();
        loading.dismiss().catch(() => {});
      }

      this.store.collection( 'poker_spot', ( ref ) => {
        this.spot.rate[ user.uid ] = this.my_rate;
        ref.doc( this.spot_id ).update( 'rate', this.spot.rate ).then( () => {
          console.log( '成功' );
          loading.dismiss().catch(() => {});
        }).catch( error => {
          const alert = this.alertCtrl.create({
            title:    '処理に失敗しました。',
            buttons:  [ 'OK' ]
          });
          alert.present();
        });
        return ref;
      } )
    });
  };
}
