const mongoose = require('mongoose');
const connectDB = require('../../src/config/db');

describe('Database Connection', () => {
  let connectSpy, logSpy, errorSpy, exitSpy;

  beforeEach(() => {
    // Spy on mongoose.connect and console methods
    connectSpy = jest.spyOn(mongoose, 'connect');
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore all spies
    jest.restoreAllMocks();
  });

  it('should connect to the database successfully', async () => {
    // Mock a successful connection
    connectSpy.mockResolvedValue({ connection: { host: 'testhost' } });

    await connectDB();

    expect(connectSpy).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(logSpy).toHaveBeenCalledWith('MongoDB Connected: testhost');
    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should handle database connection error', async () => {
    // Mock a failed connection
    const errorMessage = 'Connection failed';
    connectSpy.mockRejectedValue(new Error(errorMessage));

    await connectDB();

    expect(connectSpy).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(errorSpy).toHaveBeenCalledWith('Database connection error:', errorMessage);
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(logSpy).not.toHaveBeenCalled();
  });
});
