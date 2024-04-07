import * as amenityController from '@/controllers/amenity';
import express from 'express';

const router = express.Router();

router.get('/', amenityController.getAmenities);

export default router;
