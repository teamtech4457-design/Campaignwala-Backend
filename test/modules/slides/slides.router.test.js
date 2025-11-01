const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const Slide = require('../../../src/modules/slides/slides.models');
const Category = require('../../../src/modules/categories/categories.model');

afterAll(async () => {
  // Clean up mock data
  await Slide.deleteMany({ offerTitle: /Test Slide/ });
  await Category.deleteMany({ name: 'Test Category for Slides' });
  await mongoose.disconnect();
});

describe('Slides API - /api/slides', () => {

  const adminToken = 'your-admin-jwt-token';
  const userToken = 'your-user-jwt-token';
  let testCategory, testSlide; // To hold objects created during tests

  beforeAll(async () => {
    testCategory = await Category.create({ name: 'Test Category for Slides', description: '...' });
  });

  const slideData = {
    offerTitle: 'Test Slide',
    OffersId: `OFFER_${Date.now()}`,
    backgroundImage: 'base64-encoded-image-string',
    status: 'active'
  };

  describe('Public and Admin Lifecycle', () => {

    it('should forbid creating a slide for a regular user', async () => {
        const res = await request(app)
          .post('/api/slides')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ ...slideData, category: testCategory._id });
        expect(res.statusCode).toEqual(403);
      });

    it('should create a new slide for an admin', async () => {
      const res = await request(app)
        .post('/api/slides')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...slideData, category: testCategory._id });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.offerTitle).toEqual(slideData.offerTitle);
      testSlide = res.body.data; // Save for subsequent tests
    });

    it('should get all active slides, sorted by order', async () => {
        const res = await request(app).get('/api/slides?status=active');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data.slides)).toBe(true);
        // Add assertion to check if slides are sorted by the 'order' field
    });

    it('should increment the view count of a slide', async () => {
        const initialViews = testSlide.views;
        const res = await request(app).patch(`/api/slides/${testSlide._id}/view`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.views).toEqual(initialViews + 1);
    });

    it('should update the slide status to inactive', async () => {
        const res = await request(app)
            .put(`/api/slides/${testSlide._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'inactive' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('inactive');
    });

    it('should delete the slide', async () => {
        const res = await request(app)
            .delete(`/api/slides/${testSlide._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });
  });

  describe('Admin: Slide Order', () => {
    it('should update the order of multiple slides', async () => {
        // 1. Create two slides
        const slide1Res = await request(app).post('/api/slides').set('Authorization', `Bearer ${adminToken}`).send({ ...slideData, offerTitle: 'Test Slide 1', OffersId: 'ORDER_1', order: 1, category: testCategory._id });
        const slide2Res = await request(app).post('/api/slides').set('Authorization', `Bearer ${adminToken}`).send({ ...slideData, offerTitle: 'Test Slide 2', OffersId: 'ORDER_2', order: 2, category: testCategory._id });
        
        const slide1 = slide1Res.body.data;
        const slide2 = slide2Res.body.data;

        // 2. Send request to swap their order
        const newOrder = [
            { id: slide1._id, order: 2 },
            { id: slide2._id, order: 1 },
        ];

        const updateRes = await request(app)
            .patch('/api/slides/order/update')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ slides: newOrder });
        
        expect(updateRes.statusCode).toEqual(200);

        // 3. Fetch all slides and verify the new order
        const getRes = await request(app).get('/api/slides?status=active');
        const slides = getRes.body.data.slides;
        
        const newSlide1 = slides.find(s => s._id === slide1._id);
        const newSlide2 = slides.find(s => s._id === slide2._id);

        expect(newSlide1.order).toEqual(2);
        expect(newSlide2.order).toEqual(1);
    });
  });
});
