import { Injectable } from '@angular/core';
import { Player } from '../../model/Player';
import { User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlayerProvider {

  public user: User;

  public player: Observable<Player>;

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore
  ) {
    console.log('Hello UserProvider Provider');

    this.auth.user.subscribe( ( user: User ) => {
      this.user = user;
      this.player = this.store.doc( 'players/' + this.user.uid ).valueChanges() as Observable<Player>;
    })
  }

}
