
export interface IBeer {
  id: number; // Primary key, generated on creation
  name: string; // e.g. "Hopadillo"
  brewery: string; // e.g. "St. Arnold's"
  style: string; // e.g. "India Pale Ale"
  abv: number; // Alcohol by Volume
  ibu: number; // International Bitterness Units (0-100)
  quantity: number; // Amount of this beer available for purchase (in stock)
  orderQuantity?: number; // How much of this beer the store user wants to purchase
}
