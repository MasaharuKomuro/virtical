import { Injectable } from '@angular/core';

declare const google;

@Injectable()
export class MapProvider {

  public geocoder = new google.maps.Geocoder();

  constructor() {
    console.log( 'Hello MapProvider Provider' );
  }

}
