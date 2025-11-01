const request = require('supertest');
const app = require('../../../index');
const mongoose = require('mongoose');

// Close the database connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
});

describe('Categories API - /api/categories', () => {

  // IMPORTANT: In a real test suite, these tokens would be acquired
  // programmatically in a `beforeAll` block.
  const adminToken = 'your-admin-jwt-token';
  const userToken = 'your-user-jwt-token';
  
  let categoryForLifecycleTest; // Used to store a category for POST -> PUT -> DELETE tests

  describe('GET / (Public Access)', () => {
    it('should return 200 OK and a list of categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.categories)).toBe(true);
    });
  });

  describe('POST, PUT, DELETE Lifecycle (Admin Only)', () => {
    const categoryName = `Lifecycle Test ${Date.now()}`;

    it('should forbid creating a category for a regular user', async () => {
        const res = await request(app)
          .post('/api/categories')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ name: 'User Test', description: 'Should not be created' });
        expect(res.statusCode).toEqual(403);
      });

    it('should create a new category for an admin user', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: categoryName, description: 'Initial Description' });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data.name).toEqual(categoryName);
      categoryForLifecycleTest = res.body.data; // Save the whole category object
    });

    it('should forbid updating a category for a regular user', async () => {
        const res = await request(app)
          .put(`/api/categories/${categoryForLifecycleTest._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ description: 'User Update Attempt' });
        expect(res.statusCode).toEqual(403);
      });

    it('should update the created category for an admin user', async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryForLifecycleTest._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Updated Description' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.description).toEqual('Updated Description');
      expect(res.body.data.name).toEqual(categoryName); // Ensure name is unchanged
    });

    it('should return 404 when trying to update a non-existent category', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
          .put(`/api/categories/${nonExistentId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ description: 'Does not matter' });
        expect(res.statusCode).toEqual(404);
      });

    it('should forbid deleting a category for a regular user', async () => {
        const res = await request(app)
          .delete(`/api/categories/${categoryForLifecycleTest._id}`)
          .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
      });

    it('should delete the category for an admin user', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryForLifecycleTest._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Category deleted successfully');
    });

    it('should return 404 when trying to get the deleted category', async () => {
      const res = await request(app).get(`/api/categories/${categoryForLifecycleTest._id}`);
      expect(res.statusCode).toEqual(404);
    });
  });
});