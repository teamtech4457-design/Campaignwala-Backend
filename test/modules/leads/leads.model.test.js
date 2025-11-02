const mongoose = require('mongoose');
const Lead = require('../../../src/modules/leads/leads.model');

describe('Lead Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Lead.deleteMany({});
  });

  it('should create a new lead successfully', async () => {
    const leadData = {
      offerId: new mongoose.Types.ObjectId(),
      offerName: 'Test Offer',
      category: 'Test Category',
      hrUserId: new mongoose.Types.ObjectId(),
      hrName: 'Test HR',
      hrContact: '1234567890',
      customerName: 'Test Customer',
      customerContact: '0987654321',
    };
    const lead = new Lead(leadData);
    const savedLead = await lead.save();

    expect(savedLead._id).toBeDefined();
    expect(savedLead.leadId).toMatch(/^LD-[A-Z0-9]{8}$/);
    expect(savedLead.status).toBe('pending');
    expect(savedLead.commission1).toBe(0);
  });

  it('should fail if a required field is missing', async () => {
    const leadData = { offerName: 'Incomplete Lead' }; // Missing most required fields
    const lead = new Lead(leadData);
    let err;
    try {
      await lead.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.offerId).toBeDefined();
    expect(err.errors.hrUserId).toBeDefined();
  });

  it('should generate a unique leadId automatically', async () => {
    const leadData1 = {
      offerId: new mongoose.Types.ObjectId(), offerName: 'Offer 1', category: 'Cat 1',
      hrUserId: new mongoose.Types.ObjectId(), hrName: 'HR 1', hrContact: '1',
      customerName: 'Cust 1', customerContact: '1'
    };
    const leadData2 = {
        offerId: new mongoose.Types.ObjectId(), offerName: 'Offer 2', category: 'Cat 2',
        hrUserId: new mongoose.Types.ObjectId(), hrName: 'HR 2', hrContact: '2',
        customerName: 'Cust 2', customerContact: '2'
      };

    const lead1 = new Lead(leadData1);
    const lead2 = new Lead(leadData2);
    const savedLead1 = await lead1.save();
    const savedLead2 = await lead2.save();

    expect(savedLead1.leadId).toBeDefined();
    expect(savedLead2.leadId).toBeDefined();
    expect(savedLead1.leadId).not.toBe(savedLead2.leadId);
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const leadData = {
        offerId: new mongoose.Types.ObjectId(), offerName: 'Offer Time', category: 'Cat Time',
        hrUserId: new mongoose.Types.ObjectId(), hrName: 'HR Time', hrContact: 't',
        customerName: 'Cust Time', customerContact: 't'
      };
    const lead = new Lead(leadData);
    const savedLead = await lead.save();

    expect(savedLead.createdAt).toBeDefined();
    expect(savedLead.updatedAt).toBeDefined();
  });
});
