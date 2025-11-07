const mongoose = require('mongoose');
const Wallet = require('../../../src/modules/wallet/wallet.model');

describe('Wallet Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Wallet.deleteMany({});
  });

  it('should create a new wallet successfully', async () => {
    const walletData = { userId: new mongoose.Types.ObjectId() };
    const wallet = new Wallet(walletData);
    const savedWallet = await wallet.save();

    expect(savedWallet._id).toBeDefined();
    expect(savedWallet.userId).toBe(walletData.userId);
    expect(savedWallet.balance).toBe(0);
    expect(savedWallet.totalEarned).toBe(0);
    expect(savedWallet.totalWithdrawn).toBe(0);
    expect(savedWallet.transactions).toEqual([]);
  });

  it('should fail if userId is missing', async () => {
    const wallet = new Wallet({});
    let err;
    try {
      await wallet.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.userId).toBeDefined();
  });

  it('should fail if userId is not unique', async () => {
    const userId = new mongoose.Types.ObjectId();
    await new Wallet({ userId }).save();

    const duplicateWallet = new Wallet({ userId });
    let err;
    try {
      await duplicateWallet.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });

  it('should add a transaction to the wallet', async () => {
    const wallet = new Wallet({ userId: new mongoose.Types.ObjectId() });
    const transaction = {
      type: 'credit',
      amount: 100,
      description: 'Test credit',
    };
    wallet.transactions.push(transaction);
    const savedWallet = await wallet.save();

    expect(savedWallet.transactions.length).toBe(1);
    expect(savedWallet.transactions[0].type).toBe('credit');
    expect(savedWallet.transactions[0].amount).toBe(100);
  });

  it('should fail if transaction type is invalid', async () => {
    const wallet = new Wallet({ userId: new mongoose.Types.ObjectId() });
    wallet.transactions.push({ type: 'invalid', amount: 100 });
    let err;
    try {
      await wallet.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors['transactions.0.type']).toBeDefined();
  });
});
