const mongoose = require('mongoose');
const Query = require('../../../src/modules/queries/query.model');

describe('Query Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Query.deleteMany({});
  });

  it('should create a new query successfully', async () => {
    const queryData = {
      user: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test query.',
    };
    const query = new Query(queryData);
    const savedQuery = await query.save();

    expect(savedQuery._id).toBeDefined();
    expect(savedQuery.queryId).toMatch(/^QRY-[A-Z0-9]+-[A-Z0-9]{3}$/);
    expect(savedQuery.status).toBe('Open');
    expect(savedQuery.priority).toBe('Medium');
  });

  it('should fail if a required field is missing', async () => {
    const queryData = { user: 'Test User', email: 'test@example.com' }; // Missing subject and message
    const query = new Query(queryData);
    let err;
    try {
      await query.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.subject).toBeDefined();
    expect(err.errors.message).toBeDefined();
  });

  it('should generate a unique queryId automatically', async () => {
    const query1 = new Query({ user: 'U1', email: 'e1@a.c', subject: 'S1', message: 'M1' });
    const query2 = new Query({ user: 'U2', email: 'e2@a.c', subject: 'S2', message: 'M2' });
    const savedQuery1 = await query1.save();
    const savedQuery2 = await query2.save();

    expect(savedQuery1.queryId).toBeDefined();
    expect(savedQuery2.queryId).toBeDefined();
    expect(savedQuery1.queryId).not.toBe(savedQuery2.queryId);
  });

  it('should update status and hasReplied on adding a reply', async () => {
    const query = new Query({ user: 'U', email: 'e@a.c', subject: 'S', message: 'M' });
    const savedQuery = await query.save();

    expect(savedQuery.hasReplied).toBe(false);
    expect(savedQuery.status).toBe('Open');

    savedQuery.replies.push({ message: 'This is a reply.' });
    const repliedQuery = await savedQuery.save();

    expect(repliedQuery.hasReplied).toBe(true);
    expect(repliedQuery.status).toBe('Replied');
    expect(repliedQuery.replies.length).toBe(1);
    expect(repliedQuery.replyCount).toBe(1);
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const query = new Query({ user: 'U', email: 'e@a.c', subject: 'S', message: 'M' });
    const savedQuery = await query.save();

    expect(savedQuery.createdAt).toBeDefined();
    expect(savedQuery.updatedAt).toBeDefined();
  });
});
