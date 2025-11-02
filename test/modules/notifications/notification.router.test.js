const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');
const Notification = require('../../../src/modules/notifications/notification.model');

let adminToken, userToken, userId;

beforeAll(async () => {
  // Create users
  const admin = await User.create({ name: 'Admin User', email: 'adminnotifs@example.com', phoneNumber: '9876543214', password: 'password123', role: 'admin' });
  const user = await User.create({ name: 'Test User', email: 'usernotifs@example.com', phoneNumber: '1234567892', password: 'password123', role: 'user' });
  userId = user._id;

  // Log in users
  const adminLoginRes = await request(app).post('/api/users/login').send({ phoneNumber: '9876543214', password: 'password123' });
  adminToken = adminLoginRes.body.data.token;
  const userLoginRes = await request(app).post('/api/users/login').send({ phoneNumber: '1234567892', password: 'password123' });
  userToken = userLoginRes.body.data.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Notification.deleteMany({});
  await mongoose.disconnect();
});

describe('Notifications API', () => {
  let notificationId;

  describe('POST /api/notifications/send', () => {
    it('should send a notification to all users and return 201', async () => {
      const res = await request(app)
        .post('/api/notifications/send')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          type: 'announcement',
          title: 'Test Announcement',
          message: 'This is a test notification for all users.',
          recipients: ['all'],
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', 'Test Announcement');
      notificationId = res.body.data._id;
    });
  });

  describe('GET /api/notifications', () => {
    it('should get all notifications for admin and return 200', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
    });
  });

  describe('GET /api/notifications/stats', () => {
    it('should get notification stats and return 200', async () => {
      const res = await request(app)
        .get('/api/notifications/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
    });
  });

  describe('GET /api/notifications/user', () => {
    it('should get notifications for the current user and return 200', async () => {
      const res = await request(app)
        .get('/api/notifications/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
    });
  });

  describe('GET /api/notifications/:id', () => {
    it('should get a notification by ID and return 200', async () => {
      const res = await request(app)
        .get(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id', notificationId);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete a notification and return 200', async () => {
      const res = await request(app)
        .delete(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/notifications/bulk-delete', () => {
    let notif1, notif2;
    beforeEach(async () => {
      notif1 = await Notification.create({ type: 'system', title: 'Delete 1', message: '...' });
      notif2 = await Notification.create({ type: 'system', title: 'Delete 2', message: '...' });
    });

    it('should bulk delete notifications and return 200', async () => {
      const res = await request(app)
        .post('/api/notifications/bulk-delete')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ids: [notif1._id, notif2._id] });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});