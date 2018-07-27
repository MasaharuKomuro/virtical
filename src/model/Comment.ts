import * as moment from 'moment-mini';

export class Comment {
  title: string;

  comment: string;

  uid: string;

  created_at: number = moment().unix();

  constructor( comment?: Partial<Comment> ) {
    Object.assign( this, comment );
  }
}