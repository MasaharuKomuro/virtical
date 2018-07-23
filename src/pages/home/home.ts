import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController
  ) {
    console.log( location.href );
    console.log( this.navCtrl.getViews() );
    console.log( this.navCtrl.getViews().length );
    if ( this.navCtrl.getViews().length == 1 ) {
      // this.navCtrl.insert(0, 'HomePage', null,{ animate:false }).then(
      //   ()=>this.navCtrl.push('DetailPage',null, { animate:false }).then(
      //     ()=>{
      //       this.navCtrl.remove(1)
      //     }
      //   )
      // );
    }
  }

  public panels = [
    {
      image: 'assets/imgs/from_888_1.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes: 12,
      comments: 4,
      ago: '12 h'
    },
    {
      image: 'assets/imgs/from_888_2.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes: 27,
      comments: 6,
      ago: '16 h'
    },
    {
      image: 'assets/imgs/from_888_3.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes:142,
      comments: 221,
      ago: '2 d'
    },
    {
      image: 'assets/imgs/from_888_4.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes: 1,
      comments: 0,
      ago: '1w h'
    },
    {
      image: 'assets/imgs/from_888_1.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes: 12,
      comments: 4,
      ago: '12 h'
    },
    {
      image: 'assets/imgs/from_888_2.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes: 27,
      comments: 6,
      ago: '16 h'
    },
    {
      image: 'assets/imgs/from_888_3.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes:142,
      comments: 221,
      ago: '2 d'
    },
    {
      image: 'assets/imgs/from_888_4.jpg',
      body: 'This is a test article! This is a test article! This is a test article! This is a test article! ...',
      likes: 1,
      comments: 0,
      ago: '1w h'
    },
  ]

}
