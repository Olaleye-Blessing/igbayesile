import Amenity from '@/models/amenity';
import { findAll } from './factory';

export const getAmenities = findAll(Amenity);
