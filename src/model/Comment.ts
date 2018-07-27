import * as moment from 'moment-mini';
import { Player } from '../model/Player';

export class Comment {
  title: string;

  comment: string;

  uid: string;

  created_at: number = moment().unix();

  // only local variables
  player?: Player;

  comment_id?: string;

  constructor( comment?: Partial<Comment> ) {
    Object.assign( this, comment );
  }
}