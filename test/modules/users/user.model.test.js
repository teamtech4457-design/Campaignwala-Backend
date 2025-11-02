const mongoose = require('mongoose');
const User = require('../../../src/modules/users/user.model');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user successfully', async () => {
    const userData = { phoneNumber: '1234567890', password: 'password123' };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.phoneNumber).toBe('1234567890');
    expect(savedUser.role).toBe('user');
    expect(savedUser.isVerified).toBe(false);
  });

  it('should hash the password before saving', async () => {
    const password = 'myplainpassword';
    const user = new User({ phoneNumber: '2345678901', password: password });
    const savedUser = await user.save();

    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).not.toBe(password);
  });

  it('should correctly compare passwords', async () => {
    const password = 'myplainpassword';
    const user = new User({ phoneNumber: '3456789012', password: password });
    await user.save();

    const isMatch = await user.comparePassword(password);
    const isNotMatch = await user.comparePassword('wrongpassword');

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should fail if phoneNumber is not unique', async () => {
    await new User({ phoneNumber: '4567890123', password: 'pass1' }).save();
    const duplicateUser = new User({ phoneNumber: '4567890123', password: 'pass2' });
    let err;
    try {
      await duplicateUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });

  it('should remove sensitive fields from toJSON output', async () => {
    const user = new User({ phoneNumber: '5678901234', password: 'password' });
    const savedUser = await user.save();
    const jsonUser = savedUser.toJSON();

    expect(jsonUser.password).toBeUndefined();
    expect(jsonUser.otpAttempts).toBeUndefined();
    expect(jsonUser.lastOtpSent).toBeUndefined();
  });

  describe('OTP methods', () => {
    it('should allow sending OTP initially', () => {
      const user = new User();
      expect(user.canSendOtp()).toBe(true);
    });

    it('should increment OTP attempts', () => {
      const user = new User();
      user.incrementOtpAttempts();
      expect(user.otpAttempts).toBe(1);
      expect(user.lastOtpSent).toBeDefined();
    });

    it('should block sending OTP after 5 attempts', () => {
      const user = new User();
      for (let i = 0; i < 5; i++) {
        user.incrementOtpAttempts();
      }
      expect(user.canSendOtp()).toBe(false);
    });
  });
});
