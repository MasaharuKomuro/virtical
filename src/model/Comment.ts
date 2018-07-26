export class Comment {
  title: string;

  comment: string;

  uid: string;

  created_at: string;

  constructor( comment?: Partial<Comment> ) {
    Object.assign( this, comment );
  }
}