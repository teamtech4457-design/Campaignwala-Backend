const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const Offer = require('../../../src/modules/offers/offers.model');

afterAll(async () => {
  // Clean up mock data
  await Offer.deleteMany({ name: /Test Offer/ });
  await mongoose.disconnect();
});

describe('Offers API - /api/offers', () => {

  const adminToken = 'your-admin-jwt-token';
  const userToken = 'your-user-jwt-token';
  let testOffer; // To hold the offer created during the lifecycle test

  describe('Public Endpoints', () => {
    it('should get a list of all offers', async () => {
      const res = await request(app).get('/api/offers');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.offers)).toBe(true);
    });
  });

  describe('Admin: Offer Creation and Management Lifecycle', () => {
    const offerData = {
        name: 'Test Offer Lifecycle',
        category: 'Test Category',
        description: 'A test offer.',
        commission1: '100',
        commission2: '50'
    };

    it('should forbid creating an offer for a regular user', async () => {
      const res = await request(app)
        .post('/api/offers')
        .set('Authorization', `Bearer ${userToken}`)
        .send(offerData);
      expect(res.statusCode).toEqual(403);
    });

    it('should create a new offer for an admin', async () => {
      const res = await request(app)
        .post('/api/offers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(offerData);
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.name).toEqual(offerData.name);
      expect(res.body.data.isApproved).toBe(false); // Should be unapproved by default
      testOffer = res.body.data; // Save for subsequent tests
    });

    it('should approve the pending offer', async () => {
        const res = await request(app)
            .post(`/api/offers/${testOffer._id}/approve`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.isApproved).toBe(true);
    });

    it('should update the offer', async () => {
        const res = await request(app)
            .put(`/api/offers/${testOffer._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ description: 'An updated description.' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.description).toEqual('An updated description.');
    });

    it('should delete the offer', async () => {
        const res = await request(app)
            .delete(`/api/offers/${testOffer._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404 for the deleted offer', async () => {
        const res = await request(app).get(`/api/offers/${testOffer._id}`);
        expect(res.statusCode).toEqual(404);
    });
  });

  describe('Admin: Bulk Upload', () => {
    it('should bulk upload multiple offers', async () => {
        const offersToUpload = [
            { name: 'Test Offer Bulk 1', category: 'Bulk', commission1: '10' },
            { name: 'Test Offer Bulk 2', category: 'Bulk', commission1: '20' },
        ];
        const res = await request(app)
            .post('/api/offers/bulk-upload')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ offers: offersToUpload });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.data.count).toEqual(2);
    });
  });
});
