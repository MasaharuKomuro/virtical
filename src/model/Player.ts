export class Player {
  public name: string;
  public uid: string;
  public first_name?: string;
  public last_name?: string;
  public displayName: string;
  public email?: string;
  public tel?: string;
  public type: 'email'|'google'|'facebook';
  public thumbnail_path?: string;

  // 追加したパラメーター
  public profile_image_download_url: string = '';

  constructor ( player?: Partial<Player> ) {
    Object.assign( this, player );
  }
}