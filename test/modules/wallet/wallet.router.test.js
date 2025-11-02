const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');
const Wallet = require('../../../src/modules/wallet/wallet.model');

let adminToken, userToken, userId;

beforeAll(async () => {
  // Create a user and an admin user for testing
  const user = await User.create({
    name: 'Test User',
    email: 'testuser@example.com',
    phoneNumber: '1234567890',
    password: 'password123',
    role: 'user',
  });
  userId = user._id;

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    phoneNumber: '9876543210',
    password: 'password123',
    role: 'admin',
  });

  // Login as admin to get token
  const adminLoginRes = await request(app)
    .post('/api/users/login')
    .send({ phoneNumber: '9876543210', password: 'password123' });
  adminToken = adminLoginRes.body.data.token;

  // Login as user to get token
  const userLoginRes = await request(app)
    .post('/api/users/login')
    .send({ phoneNumber: '1234567890', password: 'password123' });
  userToken = userLoginRes.body.data.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Wallet.deleteMany({});
  await mongoose.disconnect();
});

describe('Wallet API', () => {
  describe('GET /api/wallet/:userId', () => {
    it('should get a user wallet and return 200', async () => {
      const res = await request(app)
        .get(`/api/wallet/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('balance', 0);
    });

    it('should return 403 if a regular user tries to access another user wallet', async () => {
        const anotherUser = await User.create({
            name: 'Another Test User',
            email: 'anothertestuser@example.com',
            phoneNumber: '1234567891',
            password: 'password123',
            role: 'user',
          });

        const res = await request(app)
        .get(`/api/wallet/${anotherUser._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('POST /api/wallet/credit', () => {
    it('should add credit to a wallet and return 200', async () => {
      const res = await request(app)
        .post('/api/wallet/credit')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId,
          amount: 100,
          description: 'Test credit',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('balance', 100);
    });
  });

  describe('POST /api/wallet/debit', () => {
    it('should debit from a wallet and return 200', async () => {
      // First, add credit
      await request(app)
        .post('/api/wallet/credit')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId, amount: 100 });

      // Then, debit
      const res = await request(app)
        .post('/api/wallet/debit')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId,
          amount: 50,
          description: 'Test debit',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.balance).toBeGreaterThanOrEqual(50);
    });

    it('should return 400 for insufficient balance', async () => {
        const res = await request(app)
          .post('/api/wallet/debit')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            userId,
            amount: 1000, // More than available balance
            description: 'Test debit fail',
          });
  
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Insufficient balance');
      });
  });

  describe('GET /api/wallet/admin/all', () => {
    it('should get all wallets for admin and return 200', async () => {
        const res = await request(app)
          .get('/api/wallet/admin/all')
          .set('Authorization', `Bearer ${adminToken}`);
    
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it('should return 403 for a non-admin user', async () => {
        const res = await request(app)
          .get('/api/wallet/admin/all')
          .set('Authorization', `Bearer ${userToken}`);
    
        expect(res.statusCode).toEqual(403);
      });
  });
});
