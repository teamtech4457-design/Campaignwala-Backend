const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');
const AdminLog = require('../../../src/modules/adminlogs/adminlog.model');

let adminToken, adminId;

beforeAll(async () => {
  // Create an admin user for testing
  const admin = await User.create({
    name: 'Admin User',
    email: 'adminlogs@example.com',
    phoneNumber: '9876543211',
    password: 'password123',
    role: 'admin',
  });
  adminId = admin._id;

  // Login as admin to get token
  const adminLoginRes = await request(app)
    .post('/api/users/login')
    .send({ phoneNumber: '9876543211', password: 'password123' });
  adminToken = adminLoginRes.body.data.token;

  // Create some sample logs
  await AdminLog.create([
    {
      adminId,
      adminName: 'Admin User',
      action: 'Test Action 1',
      actionType: 'test',
      module: 'testing',
      severity: 'info',
    },
    {
      adminId,
      adminName: 'Admin User',
      action: 'Test Action 2',
      actionType: 'test',
      module: 'testing',
      severity: 'warning',
    },
  ]);
});

afterAll(async () => {
  await User.deleteMany({});
  await AdminLog.deleteMany({});
  await mongoose.disconnect();
});

describe('Admin Logs API', () => {
  describe('GET /api/adminlogs', () => {
    it('should get all admin logs for admin and return 200', async () => {
      const res = await request(app)
        .get('/api/adminlogs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.logs)).toBe(true);
    });
  });

  describe('GET /api/adminlogs/stats', () => {
    it('should get admin log stats and return 200', async () => {
      const res = await request(app)
        .get('/api/adminlogs/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
    });
  });

  describe('GET /api/adminlogs/admin/:adminId', () => {
    it('should get logs by admin ID and return 200', async () => {
      const res = await request(app)
        .get(`/api/adminlogs/admin/${adminId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.logs)).toBe(true);
    });
  });

  describe('POST /api/adminlogs', () => {
    it('should create a new admin log and return 201', async () => {
      const res = await request(app)
        .post('/api/adminlogs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          adminId,
          adminName: 'Admin User',
          action: 'New Test Action',
          actionType: 'create',
          module: 'testing',
          severity: 'info',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('action', 'New Test Action');
    });
  });

  describe('DELETE /api/adminlogs/:id', () => {
    let logId;
    beforeEach(async () => {
      const log = await AdminLog.create({ adminId, adminName: 'Admin User', action: 'To be deleted' });
      logId = log._id;
    });

    it('should delete an admin log and return 200', async () => {
      const res = await request(app)
        .delete(`/api/adminlogs/${logId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});
