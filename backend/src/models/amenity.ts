import { model, Schema } from 'mongoose';

const amenitySchema = new Schema({
  label: {
    type: String,
    required: [true, 'Provide the label of this amenity'],
  },
  tooltip: {
    type: String,
    default: 'No tooltip',
  },
  icon: {
    type: String,
    default: '🌟',
  },
  target: {
    type: String,
    default: 'hotel',
    enum: ['hotel', 'room', 'both'],
  },
});

const Amenity = model('Amenity', amenitySchema);

export default Amenity;
