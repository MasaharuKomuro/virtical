import GeocoderResult = google.maps.GeocoderResult;

export class PokerSpot {
  public name: string;
  public address1: string;
  public address2?: string;
  public address_description?: string;
  public tel?: string;
  public updated_at: string;
  public geo?: GeocoderResult; // google map api の geo cording 結果を格納

  constructor ( spot: Partial<PokerSpot>) {
    Object.assign( this, spot );
  }

}