import { Injectable } from '@angular/core';
import { Player } from '../../model/Player';
import { User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlayerProvider {

  public user: User;

  public player: Player;

  constructor(
    private auth: AngularFireAuth,
    private store: AngularFirestore
  ) {
    console.log('Hello UserProvider Provider');

    this.auth.user.subscribe( ( user: User ) => {
      this.user = user;
      this.store.collection( 'players', ( ref ) => {
        ref.doc( this.user.uid ).get().then( ( player: Player ) => {
          this.player = new Player( player );
        });
      });
    })
  }

}
