import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'article/:id',
  defaultHistory: [ 'HomePage' ]
})
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public id: number;

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArticlePage');
    this.id = parseInt( this.navParams.get( 'id' ), 10 );
  }

}
