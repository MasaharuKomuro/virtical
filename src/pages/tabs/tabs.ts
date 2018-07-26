import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, Tabs } from 'ionic-angular';

@IonicPage({ segment: 'main' })
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild( 'tab_group' ) tab_group: Tabs;
  @ViewChild( Tabs ) tab_group2: Tabs;

  public tabRoots = [
    { root: 'HomePage', title: 'News', icon: 'home', header_title: 'ニュース' },
    { root: 'AboutPage', title: 'Movie', icon: 'videocam', header_title: 'お勧め動画' },
    { root: 'SpotsPage', title: 'PokerSpots', icon: 'navigate', header_title: 'ポーカースポット' },
    { root: 'SettingPage', title: 'Settings', icon: 'settings', header_title: '設定' }
  ];

  constructor(
    public modalCtrl: ModalController
  ) {}
}
