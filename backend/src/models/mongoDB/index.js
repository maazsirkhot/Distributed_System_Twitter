`use strict`

import mongoose from 'mongoose'

mongoose.connect("mongodb+srv://admin:admin@cluster0-fgxv7.mongodb.net/twitter?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

module.exports = db