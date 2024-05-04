import supertest from 'supertest';

import app from '../../src/app';

describe('hotel', () => {
  describe('GET', () => {
    it('returns 404', async () => {
      const hotelId = 'hotel-1234';

      await supertest(app).get(`/api/v1/hotels/${hotelId}`).expect(404);
    });
  });
});
