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
import * as moment from 'moment-mini';

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
  }

  public dismiss = () => {
    this.viewCtrl.dismiss();
  };

  // コメントを投稿する
  public postMessage = () => {
    const loading = this.loadingCtrl.create( { content: '読込中...' } );
    loading.present();

    // validate (簡単に)
    if ( !this.title || !this.comment || this.comment.length > this.max_comment_length ) {
      loading.dismiss();
      this.alertCtrl.create( {
        title: '入力してください。',
        buttons: ['OK']
      } );
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
        uid: user.uid,
        created_at: moment().format( 'YYYY-MM-DD H:mm:ss' )
      } );
      this.store.collection( 'spot_comments', ( ref ) => {
        const spot_id = this.navParams.get( 'spot_id' );
        ref.doc( spot_id ).collection( 'comments' ).add(
          Object.assign( {}, comment )
        ).then( _ => {
          loading.dismiss();
          this.viewCtrl.dismiss();
        }).catch( _ => {
          loading.dismiss();
          this.alertCtrl.create( {
            title: '投稿に失敗しました。',
            buttons: ['OK']
          } );
        });
      } );
    });
  };

}
