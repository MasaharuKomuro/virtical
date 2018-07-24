export class PokerSpot {
  public name: string;
  public address1: string;
  public address2?: string;
  public address_description?: string;
  public tel?: string;
  public updated_at: string;

  constructor ( spot: Partial<PokerSpot>) {
    Object.assign( this, spot );
  }

}