import mongoose from 'mongoose';
import config from '../../../config';

'use strict';

mongoose.connect(config.database.mongoDbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5,
  })
  .then(() => { /* console.log('MongoDB Connected') */ });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
