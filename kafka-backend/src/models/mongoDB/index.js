`use strict`

import config from '../../../config'
import mongoose from 'mongoose'

mongoose.connect(config.database.mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 5 })
.then(() => console.log('MongoDB Connected'))
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

module.exports = db