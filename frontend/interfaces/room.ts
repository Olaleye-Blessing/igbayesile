export interface IRoom {
  _id: string;
  name: string;
  description: string;
  location_description: string;
  images: string[];
  numberOfBeds: number;
  price: number;
  maxNumOfGuests: number;
  numOfBathrooms: number;
  hotel: string;
}
