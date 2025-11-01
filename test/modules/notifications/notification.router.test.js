const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');
const Notification = require('../../../src/modules/notifications/notification.model');

afterAll(async () => {
  // Clean up mock data
  await User.deleteMany({ email: /@test-notification.com/ });
  await Notification.deleteMany({ title: /Test Notification/ });
  await mongoose.disconnect();
});

describe('Notifications API - /api/notifications', () => {

  const adminToken = 'your-admin-jwt-token';
  let userToken, testUser1, testUser2;
  let notificationForUser1;

  beforeAll(async () => {
    // Create mock users
    testUser1 = await User.create({
        name: 'Test User One',
        email: `user1_${Date.now()}@test-notification.com`,
        phoneNumber: `11111${Date.now()}`.slice(0, 10),
        password: 'password123'
    });
    testUser2 = await User.create({
        name: 'Test User Two',
        email: `user2_${Date.now()}@test-notification.com`,
        phoneNumber: `22222${Date.now()}`.slice(0, 10),
        password: 'password123'
    });
    // In a real app, you'd generate a token by logging the user in.
    // For this test, we'll assume a token is available.
    userToken = 'your-user-jwt-token'; 
  });

  describe('User-facing Endpoints', () => {
    it('should return 401 for unauthenticated users trying to get notifications', async () => {
      const res = await request(app).get('/api/notifications/user');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 and an empty array for a new user with no notifications', async () => {
      const res = await request(app)
        .get('/api/notifications/user')
        .set('Authorization', `Bearer ${userToken}`); // Assuming this token is for testUser1
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.notifications).toEqual([]);
    });
  });

  describe('Admin: Send and Manage Notifications', () => {
    it('should forbid a regular user from sending a notification', async () => {
      const res = await request(app)
        .post('/api/notifications/send')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ type: 'announcement', title: 'User Test', message: 'This should fail' });
      expect(res.statusCode).toEqual(403);
    });

    it('should allow an admin to send a notification to a specific user', async () => {
      const res = await request(app)
        .post('/api/notifications/send')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          type: 'profile',
          title: 'Test Notification for User 1',
          message: 'Please update your profile.',
          selectedUserIds: [testUser1._id.toString()]
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.recipientCount).toEqual(1);
      notificationForUser1 = res.body.data; // Save for later tests
    });

    it('should allow user 1 to see the new notification', async () => {
        const res = await request(app)
          .get('/api/notifications/user')
          .set('Authorization', `Bearer ${userToken}`); // for testUser1
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.notifications.length).toBe(1);
        expect(res.body.data.notifications[0].title).toEqual('Test Notification for User 1');
      });

    it('should not show the notification to user 2', async () => {
        // This requires a separate token for testUser2
        const user2Token = 'your-user2-jwt-token';
        const res = await request(app)
          .get('/api/notifications/user')
          .set('Authorization', `Bearer ${user2Token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.notifications.length).toBe(0);
      });

    it('should allow an admin to delete the notification', async () => {
        const res = await request(app)
            .delete(`/api/notifications/${notificationForUser1._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should confirm the notification is no longer visible to user 1', async () => {
        const res = await request(app)
          .get('/api/notifications/user')
          .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.notifications.length).toBe(0);
    });
  });
});
