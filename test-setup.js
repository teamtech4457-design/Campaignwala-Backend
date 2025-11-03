const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
};
