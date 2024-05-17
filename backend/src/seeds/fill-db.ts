import { connectMongoDB } from '@/databases/mongo';
import Amenity from '@/models/amenity';
import { hotelAmenities, roomAmenities } from './amenities';

connectMongoDB();

const importData = async () => {
  try {
    await Amenity.create([...hotelAmenities, ...roomAmenities]);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log('__ THERE WAS AN ERROR LOADING DATA___');
    console.log(err);
  }
  process.exit();
};

importData();
