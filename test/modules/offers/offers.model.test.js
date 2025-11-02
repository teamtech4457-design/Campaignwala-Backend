const mongoose = require('mongoose');
const Offer = require('../../../src/modules/offers/offers.model');

describe('Offer Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Offer.deleteMany({});
  });

  it('should create a new offer successfully', async () => {
    const offerData = { name: 'Test Offer', category: 'Test Category' };
    const offer = new Offer(offerData);
    const savedOffer = await offer.save();

    expect(savedOffer._id).toBeDefined();
    expect(savedOffer.offersId).toMatch(/^OFF-[A-Z0-9]+-[A-Z0-9]{5}$/);
    expect(savedOffer.name).toBe('Test Offer');
    expect(savedOffer.latestStage).toBe('Pending');
    expect(savedOffer.isApproved).toBe(false);
  });

  it('should fail if required field (name) is missing', async () => {
    const offerData = { category: 'Test Category' };
    const offer = new Offer(offerData);
    let err;
    try {
      await offer.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('should generate a unique offersId automatically', async () => {
    const offer1 = new Offer({ name: 'Offer 1', category: 'Cat 1' });
    const offer2 = new Offer({ name: 'Offer 2', category: 'Cat 2' });
    const savedOffer1 = await offer1.save();
    const savedOffer2 = await offer2.save();

    expect(savedOffer1.offersId).toBeDefined();
    expect(savedOffer2.offersId).toBeDefined();
    expect(savedOffer1.offersId).not.toBe(savedOffer2.offersId);
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const offer = new Offer({ name: 'Timestamp Offer', category: 'Timestamps' });
    const savedOffer = await offer.save();

    expect(savedOffer.createdAt).toBeDefined();
    expect(savedOffer.updatedAt).toBeDefined();
  });

  it('should have a formattedDate virtual property', async () => {
    const offer = new Offer({ name: 'Virtuals Offer', category: 'Virtuals' });
    const savedOffer = await offer.save();

    const expectedDate = savedOffer.createdAt.toLocaleDateString('en-IN');
    expect(savedOffer.formattedDate).toBe(expectedDate);
  });
});
