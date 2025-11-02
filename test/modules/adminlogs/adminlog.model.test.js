const mongoose = require('mongoose');
const AdminLog = require('../../../src/modules/adminlogs/adminlog.model');

describe('AdminLog Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await AdminLog.deleteMany({});
  });

  it('should create a new admin log successfully', async () => {
    const logData = { adminName: 'Test Admin', action: 'Logged in' };
    const adminLog = new AdminLog(logData);
    const savedLog = await adminLog.save();

    expect(savedLog._id).toBeDefined();
    expect(savedLog.logId).toMatch(/^LOG-\d+-\d+$/);
    expect(savedLog.adminName).toBe('Test Admin');
    expect(savedLog.action).toBe('Logged in');
    // Test default values
    expect(savedLog.severity).toBe('info');
    expect(savedLog.status).toBe('success');
  });

  it('should fail if required field (adminName) is missing', async () => {
    const logData = { action: 'Some action' };
    const adminLog = new AdminLog(logData);
    let err;
    try {
      await adminLog.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.adminName).toBeDefined();
  });

  it('should fail if required field (action) is missing', async () => {
    const logData = { adminName: 'Test Admin' };
    const adminLog = new AdminLog(logData);
    let err;
    try {
      await adminLog.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.action).toBeDefined();
  });

  it('should generate a unique logId automatically', async () => {
    const log1 = new AdminLog({ adminName: 'Admin 1', action: 'Action 1' });
    const log2 = new AdminLog({ adminName: 'Admin 2', action: 'Action 2' });
    const savedLog1 = await log1.save();
    const savedLog2 = await log2.save();

    expect(savedLog1.logId).toBeDefined();
    expect(savedLog2.logId).toBeDefined();
    expect(savedLog1.logId).not.toBe(savedLog2.logId);
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const adminLog = new AdminLog({ adminName: 'Timestamp Admin', action: 'Testing timestamps' });
    const savedLog = await adminLog.save();

    expect(savedLog.createdAt).toBeDefined();
    expect(savedLog.updatedAt).toBeDefined();

    savedLog.action = 'Updated action';
    const updatedLog = await savedLog.save();
    expect(updatedLog.updatedAt).toBeGreaterThan(updatedLog.createdAt);
  });
});
