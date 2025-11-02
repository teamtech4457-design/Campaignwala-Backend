const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');
const Wallet = require('../../../src/modules/wallet/wallet.model');
const Withdrawal = require('../../../src/modules/withdrawal/withdrawal.model');

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

  // Create a wallet for the user and add some balance
  const wallet = new Wallet({ userId, balance: 200, totalEarned: 200 });
  await wallet.save();
});

afterAll(async () => {
  await User.deleteMany({});
  await Wallet.deleteMany({});
  await Withdrawal.deleteMany({});
  await mongoose.disconnect();
});

describe('Withdrawal API', () => {
  let withdrawalRequestId;

  describe('POST /api/withdrawals', () => {
    it('should create a withdrawal request and return 201', async () => {
      const res = await request(app)
        .post('/api/withdrawals')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId,
          amount: 50,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'pending');
      withdrawalRequestId = res.body.data._id;
    });

    it('should return 400 for insufficient balance', async () => {
      const res = await request(app)
        .post('/api/withdrawals')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId,
          amount: 500, // More than available balance
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Insufficient balance');
    });
  });

  describe('GET /api/withdrawals/admin/all', () => {
    it('should get all withdrawal requests for admin and return 200', async () => {
      const res = await request(app)
        .get('/api/withdrawals/admin/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.withdrawals)).toBe(true);
    });
  });

  describe('PUT /api/withdrawals/:id/approve', () => {
    it('should approve a withdrawal request and return 200', async () => {
      const res = await request(app)
        .put(`/api/withdrawals/${withdrawalRequestId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          adminId: mongoose.Types.ObjectId(),
          transactionId: 'txn_12345',
          remarks: 'Approved for testing',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'approved');
    });
  });

  describe('PUT /api/withdrawals/:id/reject', () => {
    let pendingWithdrawalId;
    beforeAll(async () => {
        const withdrawal = await Withdrawal.create({ userId, amount: 20, status: 'pending' });
        pendingWithdrawalId = withdrawal._id;
    });

    it('should reject a withdrawal request and return 200', async () => {
      const res = await request(app)
        .put(`/api/withdrawals/${pendingWithdrawalId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          adminId: mongoose.Types.ObjectId(),
          rejectionReason: 'Testing rejection',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'rejected');
    });
  });
});
