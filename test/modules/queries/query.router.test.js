const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const Query = require('../../../src/modules/queries/query.model');

afterAll(async () => {
  // Clean up mock data
  await Query.deleteMany({ email: /test.query@example.com/ });
  await mongoose.disconnect();
});

describe('Queries API - /api/queries', () => {

  const adminToken = 'your-admin-jwt-token';
  const userToken = 'your-user-jwt-token';
  let testQuery; // To hold the query created during the test lifecycle

  const userQueryData = {
    user: 'Test User',
    email: `test.query_${Date.now()}@example.com`,
    subject: 'Help with my account',
    message: 'I am having trouble logging in.'
  };

  describe('User and Admin Query Lifecycle', () => {
    
    it('should allow a public user to create a new query', async () => {
      const res = await request(app)
        .post('/api/queries')
        .send(userQueryData);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subject).toEqual(userQueryData.subject);
      expect(res.body.data.status).toEqual('Open');
      testQuery = res.body.data; // Save for the next tests
    });

    it('should allow the user to retrieve their own queries by email', async () => {
        const res = await request(app).get(`/api/queries/email/${userQueryData.email}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.queries.length).toBe(1);
        expect(res.body.data.queries[0]._id).toEqual(testQuery._id);
    });

    it('should forbid a regular user from getting all queries', async () => {
        const res = await request(app)
            .get('/api/queries')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
    });

    it('should allow an admin to get all queries', async () => {
        const res = await request(app)
            .get('/api/queries')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data.queries)).toBe(true);
    });

    it('should allow an admin to reply to the query', async () => {
        const replyData = { message: 'We are looking into your issue.' };
        const res = await request(app)
            .post(`/api/queries/${testQuery._id}/reply`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(replyData);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.replies.length).toBe(1);
        expect(res.body.data.replies[0].message).toEqual(replyData.message);
        expect(res.body.data.status).toEqual('Replied');
    });

    it('should allow an admin to close the query', async () => {
        const res = await request(app)
            .patch(`/api/queries/${testQuery._id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'Closed' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual('Closed');
        expect(res.body.data.isResolved).toBe(true);
    });

    it('should allow an admin to delete the query', async () => {
        const res = await request(app)
            .delete(`/api/queries/${testQuery._id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should return no queries for the user after deletion', async () => {
        const res = await request(app).get(`/api/queries/email/${userQueryData.email}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.queries.length).toBe(0);
    });
  });
});
