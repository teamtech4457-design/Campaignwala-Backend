const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /api/users/send-otp', () => {
  it('should send an OTP to a valid phone number and return 200', async () => {
    const res = await request(app)
      .post('/api/users/send-otp')
      .send({
        phoneNumber: '9876543210'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('OTP sent successfully');
  });

  it('should return a 400 error if the phone number is missing', async () => {
    const res = await request(app)
      .post('/api/users/send-otp')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
