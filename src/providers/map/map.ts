import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

declare const google;

@Injectable()
export class MapProvider {

  public geocoder;

  constructor(
    private mapsAPILoader: MapsAPILoader
  ) {
    console.log( 'Hello MapProvider Provider' );
    this.mapsAPILoader.load().then( () => {
      this.geocoder = new google.maps.Geocoder();
    } );
  }

}
