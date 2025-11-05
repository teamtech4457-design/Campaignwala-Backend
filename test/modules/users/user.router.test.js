const request = require('supertest');
const express = require('express');
const router = require('../../../src/modules/users/user.router');

const app = express();
app.use(express.json());
app.use('/api/users', router);

describe('User API Endpoints', () => {
  describe('POST /api/users/send-otp', () => {
    it('should send an OTP to the user', async () => {
      const res = await request(app)
        .post('/api/users/send-otp')
        .send({
          phoneNumber: '1234567890'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('OTP sent successfully');
    });
  });
});