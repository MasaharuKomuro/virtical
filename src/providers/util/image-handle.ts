import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireStorage } from 'angularfire2/storage';
import { Player } from '../../model/Player';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable()
export class ImageHandle {

  constructor (
    private storage: AngularFireStorage,
    private domSanitizer: DomSanitizer
  ) {

  }

  // 画像のダウンロードURLを返す
  public getPictureUrl = ( path ): Observable<string> => {
    return this.storage.ref( path ).getDownloadURL();
  };

  // プロフィール画像のダウンロードURLを返す
  public getProfilePictureUrl = ( player: Player ): Observable<SafeUrl> => {
    return new Observable<SafeUrl>( ( observer ) => {
      if ( !player.thumbnail_path ) {
        observer.next( '' );
      } else if ( !!player.profile_image_download_url ) {
        observer.next( player.profile_image_download_url );
      } else {
        this.getPictureUrl( 'image/' + player.uid ).subscribe( ( url: string ) => {
          player.profile_image_download_url = this.domSanitizer.bypassSecurityTrustUrl( url );
          observer.next( player.profile_image_download_url );
        });
      }
    } );
  }
}
