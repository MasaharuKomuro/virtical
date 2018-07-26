import { Injectable } from '@angular/core';
import { User } from 'firebase';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  public user: User;
  constructor() {
    console.log('Hello UserProvider Provider');
  }

}
