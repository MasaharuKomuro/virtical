import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PostCommentModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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
    public viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostCommentModalPage');
  }

  public dismiss = () => {
    this.viewCtrl.dismiss();
  }

}
