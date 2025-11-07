module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  verbose: true,
  testTimeout: 30000,
  globalSetup: './test-setup.js',
  globalTeardown: './test-teardown.js',
};
