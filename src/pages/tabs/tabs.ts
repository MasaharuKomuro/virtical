import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

@IonicPage({ segment: 'main' })
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public tabRoots = [
    { root: 'HomePage', title: 'Poker', icon: 'home' },
    { root: 'AboutPage', title: 'About', icon: 'information-circle' },
    { root: 'ContactPage', title: 'Contact', icon: 'contacts' }
  ];

  constructor(
    public modalCtrl: ModalController
    ) {
    console.log( location.href );
  }
}
