const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const Lead = require('../../../src/modules/leads/leads.model');
const Offer = require('../../../src/modules/offers/offers.model');
const User = require('../../../src/modules/users/user.model');

afterAll(async () => {
  // Clean up mock data
  await User.deleteMany({ email: /@test.com/ });
  await Offer.deleteMany({ name: /Test Offer/ });
  await Lead.deleteMany({ customerName: /Test Customer/ });
  await mongoose.disconnect();
});

describe('Leads API - /api/leads', () => {

  const adminToken = 'your-admin-jwt-token';
  let testOffer, testUser, testLead;

  // Create a mock user and offer before running tests
  beforeAll(async () => {
    testUser = await User.create({
        name: 'Test HR User',
        email: `testuser_${Date.now()}@test.com`,
        phoneNumber: `12345${Date.now()}`.slice(0, 10),
        password: 'password123',
        role: 'user'
    });

    testOffer = await Offer.create({
        name: 'Test Offer for Leads',
        description: 'An offer to test lead lifecycle',
        commission1: 100, // Commission for first approval
        commission2: 50,  // Commission for second approval
    });
  });

  describe('POST / (Public Lead Creation)', () => {
    it('should create a new lead with valid data and return 201', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          offerId: testOffer._id,
          hrUserId: testUser._id,
          customerName: 'Test Customer',
          customerContact: '9876543210'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toEqual('pending');
      testLead = res.body.data; // Save for the next tests
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({ offerId: testOffer._id, customerName: 'Test Customer' });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('Lead Approval and Rejection Lifecycle (Admin)', () => {
    
    it('should approve a PENDING lead, pay commission 1, and set status to APPROVED', async () => {
        const res = await request(app)
            .post(`/api/leads/${testLead._id}/approve`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.lead.status).toEqual('approved');
        expect(res.body.data.commission1Paid).toBe(true);
        expect(res.body.data.commissionPaid).toEqual(testOffer.commission1);

        // In a real test, you would now query the Wallet model
        // and assert that testUser's balance has increased by commission1.
    });

    it('should approve an APPROVED lead, pay commission 2, and set status to COMPLETED', async () => {
        const res = await request(app)
            .post(`/api/leads/${testLead._id}/approve`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.lead.status).toEqual('completed');
        expect(res.body.data.commission2Paid).toBe(true);
        expect(res.body.data.commissionPaid).toEqual(testOffer.commission2);

        // In a real test, you would query the Wallet model again and
        // assert that the balance has increased by commission2.
    });

    it('should fail to approve a lead that is already COMPLETED', async () => {
        const res = await request(app)
            .post(`/api/leads/${testLead._id}/approve`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('already fully approved');
    });

    it('should reject a different lead', async () => {
        // Create a new lead specifically for the rejection test
        const leadToRejectRes = await request(app).post('/api/leads').send({
            offerId: testOffer._id,
            hrUserId: testUser._id,
            customerName: 'Test Customer To Reject',
            customerContact: '9998887776'
          });
        const leadToRejectId = leadToRejectRes.body.data._id;

        const res = await request(app)
            .post(`/api/leads/${leadToRejectId}/reject`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ rejectionReason: 'Test rejection' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('rejected');
        expect(res.body.data.rejectionReason).toEqual('Test rejection');

        // In a real test, you would verify the user's wallet balance did NOT change.
    });
  });
});