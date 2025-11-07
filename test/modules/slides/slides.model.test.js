const mongoose = require('mongoose');
const Slide = require('../../../src/modules/slides/slides.models');

describe('Slide Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Slide.deleteMany({});
  });

  it('should create a new slide successfully', async () => {
    const slideData = {
      offerTitle: 'Test Slide',
      category: new mongoose.Types.ObjectId(),
      OffersId: 'test-offer-123',
      backgroundImage: '/path/to/image.jpg',
    };
    const slide = new Slide(slideData);
    const savedSlide = await slide.save();

    expect(savedSlide._id).toBeDefined();
    expect(savedSlide.offerTitle).toBe('Test Slide');
    expect(savedSlide.status).toBe('active');
    expect(savedSlide.order).toBe(0);
    expect(savedSlide.views).toBe(0);
  });

  it('should fail if a required field is missing', async () => {
    const slideData = { offerTitle: 'Incomplete Slide' }; // Missing category, OffersId, backgroundImage
    const slide = new Slide(slideData);
    let err;
    try {
      await slide.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.category).toBeDefined();
    expect(err.errors.OffersId).toBeDefined();
    expect(err.errors.backgroundImage).toBeDefined();
  });

  it('should fail if OffersId is not unique', async () => {
    const slideData1 = {
      offerTitle: 'Slide 1', category: new mongoose.Types.ObjectId(),
      OffersId: 'unique-offer-id', backgroundImage: 'bg1.jpg'
    };
    await new Slide(slideData1).save();

    const slideData2 = {
        offerTitle: 'Slide 2', category: new mongoose.Types.ObjectId(),
        OffersId: 'unique-offer-id', backgroundImage: 'bg2.jpg'
      };
    const duplicateSlide = new Slide(slideData2);
    let err;
    try {
      await duplicateSlide.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const slideData = {
        offerTitle: 'Timestamp Slide', category: new mongoose.Types.ObjectId(),
        OffersId: 'time-offer-id', backgroundImage: 'bg-time.jpg'
      };
    const slide = new Slide(slideData);
    const savedSlide = await slide.save();

    expect(savedSlide.createdAt).toBeDefined();
    expect(savedSlide.updatedAt).toBeDefined();
  });
});
