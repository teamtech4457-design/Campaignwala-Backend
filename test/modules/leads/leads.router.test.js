const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');
const Lead = require('../../../src/modules/leads/leads.model');
const Offer = require('../../../src/modules/offers/offers.model');

let adminToken, hrUserToken, hrUserId, offerId;

beforeAll(async () => {
  // Create users
  const admin = await User.create({ name: 'Admin User', email: 'adminleads@example.com', phoneNumber: '9876543213', password: 'password123', role: 'admin' });
  const hrUser = await User.create({ name: 'HR User', email: 'hrleads@example.com', phoneNumber: '1234567891', password: 'password123', role: 'user' });
  hrUserId = hrUser._id;

  // Log in users
  const adminLoginRes = await request(app).post('/api/users/login').send({ phoneNumber: '9876543213', password: 'password123' });
  adminToken = adminLoginRes.body.data.token;
  const hrUserLoginRes = await request(app).post('/api/users/login').send({ phoneNumber: '1234567891', password: 'password123' });
  hrUserToken = hrUserLoginRes.body.data.token;

  // Create an offer
  const offer = await Offer.create({ name: 'Test Offer', description: 'Test Offer Description', amount: 100 });
  offerId = offer._id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Lead.deleteMany({});
  await Offer.deleteMany({});
  await mongoose.disconnect();
});

describe('Leads API', () => {
  let leadId;

  describe('POST /api/leads', () => {
    it('should create a new lead and return 201', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          offerId,
          hrUserId,
          hrName: 'HR User',
          hrContact: '1234567891',
          customerName: 'Test Customer',
          customerContact: '5555555555',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'pending');
      leadId = res.body.data._id;
    });
  });

  describe('GET /api/leads', () => {
    it('should get all leads for admin and return 200', async () => {
      const res = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.leads)).toBe(true);
    });
  });

  describe('GET /api/leads/stats', () => {
    it('should get lead stats and return 200', async () => {
      const res = await request(app)
        .get('/api/leads/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
    });
  });

  describe('GET /api/leads/:id', () => {
    it('should get a lead by ID and return 200', async () => {
      const res = await request(app)
        .get(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id', leadId);
    });
  });

  describe('POST /api/leads/:id/approve', () => {
    it('should approve a lead and return 200', async () => {
      const res = await request(app)
        .post(`/api/leads/${leadId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'approved');
    });
  });

  describe('POST /api/leads/:id/reject', () => {
    let pendingLeadId;
    beforeEach(async () => {
      const lead = await Lead.create({ offerId, hrUserId, customerName: 'For Rejection', customerContact: '555' });
      pendingLeadId = lead._id;
    });

    it('should reject a lead and return 200', async () => {
      const res = await request(app)
        .post(`/api/leads/${pendingLeadId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ rejectionReason: 'Test rejection' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'rejected');
    });
  });

  describe('DELETE /api/leads/:id', () => {
    it('should delete a lead and return 200', async () => {
      const res = await request(app)
        .delete(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});
