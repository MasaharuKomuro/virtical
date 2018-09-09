import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireStorage } from 'angularfire2/storage';
import { Player } from '../../model/Player';

@Injectable()
export class ImageHandle {

  constructor ( private storage: AngularFireStorage ) {

  }

  // 画像のダウンロードURLを返す
  public getPictureUrl = ( path ): Observable<string> => {
    return this.storage.ref( path ).getDownloadURL();
  };

  // プロフィール画像のダウンロードURLを返す
  public getProfilePictureUrl = ( player: Player, uid: string ): Observable<string> => {
    return new Observable<string>( ( observer ) => {
      if ( !player.thumbnail_path ) {
        observer.next( '' );
      } else if ( !!player.profile_image_download_url ) {
        observer.next( player.profile_image_download_url );
      } else {
        this.getPictureUrl( 'image/' + uid ).subscribe( ( url: string ) => {
          player.profile_image_download_url = url;
          observer.next( url );
        });
      }
    } );
  }
}
