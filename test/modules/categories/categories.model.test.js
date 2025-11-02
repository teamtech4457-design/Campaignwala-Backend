const mongoose = require('mongoose');
const Category = require('../../../src/modules/categories/categories.model');

describe('Category Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  it('should create a new category successfully', async () => {
    const categoryData = { name: 'Test Category', description: 'A category for testing' };
    const category = new Category(categoryData);
    const savedCategory = await category.save();

    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe('Test Category');
    expect(savedCategory.status).toBe('active');
    expect(savedCategory.count).toBe(0);
  });

  it('should fail if required field (name) is missing', async () => {
    const categoryData = { description: 'A category for testing' };
    const category = new Category(categoryData);
    let err;
    try {
      await category.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('should fail if name is not unique', async () => {
    const categoryData = { name: 'Duplicate Category', description: 'First one' };
    await new Category(categoryData).save();

    const duplicateCategory = new Category({ name: 'Duplicate Category', description: 'Second one' });
    let err;
    try {
      await duplicateCategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error code
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const category = new Category({ name: 'Timestamp Category', description: 'Testing timestamps' });
    const savedCategory = await category.save();

    expect(savedCategory.createdAt).toBeDefined();
    expect(savedCategory.updatedAt).toBeDefined();
  });

  it('should have a formattedDate virtual property', async () => {
    const category = new Category({ name: 'Virtuals Category', description: 'Testing virtuals' });
    const savedCategory = await category.save();

    // The exact format depends on the locale of the server running the test
    // 'en-IN' format is DD/MM/YYYY
    const expectedDate = savedCategory.createdAt.toLocaleDateString('en-IN');
    expect(savedCategory.formattedDate).toBe(expectedDate);
  });
});
