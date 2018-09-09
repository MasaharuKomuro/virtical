import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class ImageHandle {

  constructor ( private storage: AngularFireStorage ) {

  }

  public getPictureUrl = ( path ): Observable<string> => {
    return this.storage.ref( path ).getDownloadURL();
  }
}
