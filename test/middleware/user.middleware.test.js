const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdmin, requireVerified } = require('../../src/middleware/user.middleware');
const User = require('../../src/modules/users/user.model');

// Setup a dummy app to test middleware
const app = express();
app.get('/test/auth', authenticateToken, (req, res) => res.status(200).json({ user: req.user }));
app.get('/test/admin', authenticateToken, requireAdmin, (req, res) => res.status(200).json({ success: true }));
app.get('/test/verified', authenticateToken, requireVerified, (req, res) => res.status(200).json({ success: true }));

let user, admin, unverifiedUser, deactivatedUser;
let userToken, adminToken, unverifiedUserToken, deactivatedUserToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

  user = await User.create({ name: 'Test User', email: 'user@test.com', phoneNumber: '1111111111', password: 'password', isVerified: true });
  admin = await User.create({ name: 'Admin User', email: 'admin@test.com', phoneNumber: '2222222222', password: 'password', role: 'admin', isVerified: true });
  unverifiedUser = await User.create({ name: 'Unverified User', email: 'unverified@test.com', phoneNumber: '3333333333', password: 'password', isVerified: false });
  deactivatedUser = await User.create({ name: 'Deactivated User', email: 'deactivated@test.com', phoneNumber: '4444444444', password: 'password', isActive: false });

  userToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
  adminToken = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET || 'secret');
  unverifiedUserToken = jwt.sign({ userId: unverifiedUser._id }, process.env.JWT_SECRET || 'secret');
  deactivatedUserToken = jwt.sign({ userId: deactivatedUser._id }, process.env.JWT_SECRET || 'secret');
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('User Middleware', () => {
  describe('authenticateToken', () => {
    it('should allow access with a valid token', async () => {
      const res = await request(app)
        .get('/test/auth')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.user._id).toBe(user._id.toString());
    });

    it('should return 401 for no token', async () => {
      const res = await request(app).get('/test/auth');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 for an invalid token', async () => {
      const res = await request(app)
        .get('/test/auth')
        .set('Authorization', 'Bearer invalidtoken');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 for a deactivated user', async () => {
        const res = await request(app)
          .get('/test/auth')
          .set('Authorization', `Bearer ${deactivatedUserToken}`);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Account is deactivated');
      });
  });

  describe('requireAdmin', () => {
    it('should allow access for an admin user', async () => {
      const res = await request(app)
        .get('/test/admin')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it('should return 403 for a non-admin user', async () => {
      const res = await request(app)
        .get('/test/admin')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('requireVerified', () => {
    it('should allow access for a verified user', async () => {
      const res = await request(app)
        .get('/test/verified')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it('should return 403 for an unverified user', async () => {
      const res = await request(app)
        .get('/test/verified')
        .set('Authorization', `Bearer ${unverifiedUserToken}`);
      expect(res.statusCode).toEqual(403);
    });
  });
});
