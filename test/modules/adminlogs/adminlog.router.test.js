const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');

// Close the database connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Admin Logs API - /api/adminlogs', () => {

  // IMPORTANT: In a real test suite, these tokens would be acquired
  // programmatically in a `beforeAll` block.
  const adminToken = 'your-admin-jwt-token'; 
  const userToken = 'your-user-jwt-token';
  
  let newLogId; // Used to store the ID of a log created during tests

  describe('GET /', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const res = await request(app).get('/api/adminlogs');
      // Assuming you have middleware that blocks unauthenticated requests
      expect(res.statusCode).toBeOneOf([401, 403]);
    });

    it('should return 403 Forbidden for a regular user', async () => {
      const res = await request(app)
        .get('/api/adminlogs')
        .set('Authorization', `Bearer ${userToken}`);
      // Assuming you have role-based middleware
      expect(res.statusCode).toEqual(403);
    });

    it('should return 200 OK and logs for an admin user', async () => {
      const res = await request(app)
        .get('/api/adminlogs')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.logs)).toBe(true);
    });
  });

  describe('GET /stats', () => {
    it('should return 200 OK and stats for an admin user', async () => {
        const res = await request(app)
          .get('/api/adminlogs/stats')
          .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('total');
        expect(res.body.data).toHaveProperty('bySeverity');
      });
  });

  describe('POST, GET, and DELETE Single Log Lifecycle', () => {
    it('should create a new log entry and return 201', async () => {
      const res = await request(app)
        .post('/api/adminlogs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          adminName: 'Test Admin',
          action: 'Performed a test action',
          actionType: 'system',
          module: 'testing',
          severity: 'info'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      newLogId = res.body.data._id; // Save for the next tests
    });

    it('should retrieve the newly created log by its ID', async () => {
        const res = await request(app)
          .get(`/api/adminlogs/${newLogId}`)
          .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data._id).toEqual(newLogId);
      });

    it('should delete the log and return 200', async () => {
      const res = await request(app)
        .delete(`/api/adminlogs/${newLogId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Admin log deleted successfully');
    });

    it('should return 404 when trying to retrieve the deleted log', async () => {
        const res = await request(app)
          .get(`/api/adminlogs/${newLogId}`)
          .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
      });
  });

  describe('POST /bulk-delete', () => {
    it('should bulk delete multiple logs', async () => {
        // 1. Create a few logs to delete
        const log1 = await request(app).post('/api/adminlogs').set('Authorization', `Bearer ${adminToken}`).send({ adminName: 'Bulk Test 1', action: 'Action 1' });
        const log2 = await request(app).post('/api/adminlogs').set('Authorization', `Bearer ${adminToken}`).send({ adminName: 'Bulk Test 2', action: 'Action 2' });
        const idsToDelete = [log1.body.data._id, log2.body.data._id];

        // 2. Perform bulk delete
        const res = await request(app)
            .post('/api/adminlogs/bulk-delete')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ ids: idsToDelete });

        expect(res.statusCode).toEqual(200);
        expect(res.body.deletedCount).toEqual(2);
    });
  });

  describe('POST /clear-old', () => {
    it('should run the clear old logs process and return 200', async () => {
        // This test just verifies the endpoint can be called successfully.
        // A more advanced test could involve creating logs with past dates.
        const res = await request(app)
            .post('/api/adminlogs/clear-old')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ days: 30 }); // Clear logs older than 30 days

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('deletedCount');
    });
  });

});