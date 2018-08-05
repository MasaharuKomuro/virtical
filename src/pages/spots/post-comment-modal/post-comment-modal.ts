import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'firebase';
import { Comment } from '../../../model/Comment';

/**
 * Generated class for the PostCommentModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'post-message'
})
@Component({
  selector: 'page-post-comment-modal',
  templateUrl: 'post-comment-modal.html',
})
export class PostCommentModalPage {

  public title: string = '';

  public comment: string = '';

  public max_comment_length = 500;

  public action: string;

  public comment_snapshot?: Comment;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private auth: AngularFireAuth,
    private store: AngularFirestore,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostCommentModalPage');
    this.action = this.navParams.get( 'action' ) || 'create';
    if ( this.action === 'edit' ) {
      this.comment_snapshot = this.navParams.get( 'comment' );
      this.title = this.comment_snapshot.title;
      this.comment = this.comment_snapshot.comment;
    }
  }

  public dismiss = () => {
    this.viewCtrl.dismiss();
  };

  // コメントを投稿する
  public postMessage = () => {
    console.log( 'コメントの投稿を開始します。 ');
    const loading = this.loadingCtrl.create( { content: '読込中...' } );
    loading.present();

    // validate (簡単に)
    if ( !this.validate() ) {
      loading.dismiss();
      return;
    }

    // まずはログインセッションが有効か確認
    this.auth.authState.subscribe( ( user: User ) => {
      if ( !user ) {
        loading.dismiss();
        this.alertCtrl.create( {
          title: 'ログインし直してください。',
          buttons: ['OK']
        } );
        return;
      }

      // コメントを投稿する

      const comment = new Comment( {
        title: this.title,
        comment: this.comment,
        uid: user.uid
      } );

      console.log( '投稿処理実行' );
      this.store.collection( 'spot_comments', ( ref ) => {
        console.log(1);
        const spot_id = this.navParams.get( 'spot_id' );
        console.log(2);
        ref.doc( spot_id ).collection( 'comments' ).add(
          Object.assign( {}, comment )
        ).then( _ => {
          console.log(3);
          loading.dismiss();
          this.viewCtrl.dismiss();
          console.log( 'コメント投稿完了' );
        }).catch( error => {
          console.warn( error );
          loading.dismiss();
          this.alertCtrl.create( {
            title: '投稿に失敗しました。',
            buttons: ['OK']
          } );
        });
        return ref;
      } );
    });
  };

  // コメントを更新する
  public editMessage = () => {
    const loading = this.loadingCtrl.create( { content: '更新中 ...' } );
    loading.present();

    // validate (簡単に)
    if ( !this.validate() ) {
      loading.dismiss();
      return;
    }

    // まずはログインセッションが有効か確認
    this.auth.authState.subscribe( ( user: User ) => {
      if ( !user ) {
        loading.dismiss();
        this.alertCtrl.create( {
          title:   'ログインし直してください。',
          buttons: [ 'OK' ]
        } );
        return;
      }

      // コメントを更新
      this.store.collection( 'spot_comments', ( ref ) => {
        ref.doc( this.navParams.get( 'spot_id' ) ).collection( 'comments' ).doc( this.comment_snapshot.comment_id ).set({
          title: this.title,
          comment: this.comment
        }, { merge: true } ).then( _ => {
          loading.dismiss();
          this.viewCtrl.dismiss();
        }).catch( _ => {
          loading.dismiss();
          this.alertCtrl.create( {
            title:   '更新に失敗しました。',
            buttons: [ 'OK' ]
          } );
        });
        return ref;
      } )
    });
  };

  // 簡単に validate
  public validate = () => {
    if ( !this.title || !this.comment || this.comment.length > this.max_comment_length ) {
      this.alertCtrl.create( {
        title: '入力してください。',
        buttons: ['OK']
      } );
      return false;
    }
    return true;
  };

}
