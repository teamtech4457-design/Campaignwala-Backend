const mongoose = require('mongoose');
const Withdrawal = require('../../../src/modules/withdrawal/withdrawal.model');

describe('Withdrawal Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Withdrawal.deleteMany({});
  });

  it('should create a new withdrawal request successfully', async () => {
    const withdrawalData = {
      userId: new mongoose.Types.ObjectId(),
      amount: 100,
    };
    const withdrawal = new Withdrawal(withdrawalData);
    const savedWithdrawal = await withdrawal.save();

    expect(savedWithdrawal._id).toBeDefined();
    expect(savedWithdrawal.withdrawalId).toMatch(/^WDR-[A-Z0-9]+-[A-Z0-9]{3}$/);
    expect(savedWithdrawal.status).toBe('pending');
    expect(savedWithdrawal.amount).toBe(100);
    expect(savedWithdrawal.reason).toBe('Awaiting admin approval');
  });

  it('should fail if required fields are missing', async () => {
    const withdrawal = new Withdrawal({}); // Missing userId and amount
    let err;
    try {
      await withdrawal.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.amount).toBeDefined();
  });

  it('should fail if amount is less than 1', async () => {
    const withdrawalData = { userId: new mongoose.Types.ObjectId(), amount: 0 };
    const withdrawal = new Withdrawal(withdrawalData);
    let err;
    try {
      await withdrawal.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.amount).toBeDefined();
  });

  it('should generate a unique withdrawalId automatically', async () => {
    const w1 = new Withdrawal({ userId: new mongoose.Types.ObjectId(), amount: 10 });
    const w2 = new Withdrawal({ userId: new mongoose.Types.ObjectId(), amount: 20 });
    const savedW1 = await w1.save();
    const savedW2 = await w2.save();

    expect(savedW1.withdrawalId).toBeDefined();
    expect(savedW2.withdrawalId).toBeDefined();
    expect(savedW1.withdrawalId).not.toBe(savedW2.withdrawalId);
  });

  it('should have createdAt and updatedAt timestamps', async () => {
    const withdrawal = new Withdrawal({ userId: new mongoose.Types.ObjectId(), amount: 50 });
    const savedWithdrawal = await withdrawal.save();

    expect(savedWithdrawal.createdAt).toBeDefined();
    expect(savedWithdrawal.updatedAt).toBeDefined();
  });
});
