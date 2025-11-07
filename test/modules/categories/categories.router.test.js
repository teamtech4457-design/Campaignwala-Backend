const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');
const Category = require('../../../src/modules/categories/categories.model');

let adminToken;

beforeAll(async () => {
  // Create an admin user for testing
  const admin = await User.create({
    name: 'Admin User',
    email: 'admincats@example.com',
    phoneNumber: '9876543212',
    password: 'password123',
    role: 'admin',
  });

  // Login as admin to get token
  const adminLoginRes = await request(app)
    .post('/api/users/login')
    .send({ phoneNumber: '9876543212', password: 'password123' });
  adminToken = adminLoginRes.body.data.token;

  await Category.create([
    { name: 'Test Category 1', description: 'Description 1', status: 'active' },
    { name: 'Test Category 2', description: 'Description 2', status: 'inactive' },
  ]);
});

afterAll(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await mongoose.disconnect();
});

describe('Categories API', () => {
  let categoryId;

  describe('POST /api/categories', () => {
    it('should create a new category and return 201', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Category',
          description: 'A new category for testing',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name', 'New Category');
      categoryId = res.body.data._id;
    });
  });

  describe('GET /api/categories', () => {
    it('should get all categories and return 200', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.categories)).toBe(true);
    });
  });

  describe('GET /api/categories/stats', () => {
    it('should get category stats and return 200', async () => {
      const res = await request(app)
        .get('/api/categories/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get a category by ID and return 200', async () => {
      const res = await request(app)
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id', categoryId);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category and return 200', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Category Name' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name', 'Updated Category Name');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category and return 200', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });
});
