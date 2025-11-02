const mongoose = require('mongoose');
const Notification = require('../../../src/modules/notifications/notification.model');

describe('Notification Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Notification.deleteMany({});
  });

  it('should create a new notification successfully', async () => {
    const notificationData = {
      type: 'announcement',
      title: 'Test Notification',
      message: 'This is a test.',
    };
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();

    expect(savedNotification._id).toBeDefined();
    expect(savedNotification.notificationId).toMatch(/^NOTIF-[A-Z0-9]+-[A-Z0-9]{3}$/);
    expect(savedNotification.status).toBe('sent');
    expect(savedNotification.sentDate).toBeDefined();
  });

  it('should fail if a required field is missing', async () => {
    const notificationData = { type: 'system', message: 'Incomplete notification' };
    const notification = new Notification(notificationData);
    let err;
    try {
      await notification.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.title).toBeDefined();
  });

  it('should generate a unique notificationId automatically', async () => {
    const notif1 = new Notification({ type: 'system', title: 'N1', message: 'M1' });
    const notif2 = new Notification({ type: 'system', title: 'N2', message: 'M2' });
    const savedNotif1 = await notif1.save();
    const savedNotif2 = await notif2.save();

    expect(savedNotif1.notificationId).toBeDefined();
    expect(savedNotif2.notificationId).toBeDefined();
    expect(savedNotif1.notificationId).not.toBe(savedNotif2.notificationId);
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const notification = new Notification({ type: 'system', title: 'Timestamp', message: 'Testing timestamps' });
    const savedNotification = await notification.save();

    expect(savedNotification.createdAt).toBeDefined();
    expect(savedNotification.updatedAt).toBeDefined();
  });
});
