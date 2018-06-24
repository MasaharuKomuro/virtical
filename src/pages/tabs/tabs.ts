import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public tabRoots = [
    { root: 'HomePage', title: 'Poker', icon: 'home' },
    { root: 'AboutPage', title: 'About', icon: 'information-circle' },
    { root: 'ContactPage', title: 'Contact', icon: 'contacts' },
    { root: 'ContactPage', title: 'Contact', icon: 'contacts' }
  ];

  constructor() {

  }
}
