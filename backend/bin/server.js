`use strict`

let createError = require('http-errors')
let express = require('express')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
import config from '../config'
import cors from 'cors'

let usersRouter = require('../src/modules/user/router/users')

require('../src/models/mongoDB/index')

let app = express()

let port = process.env.PORT || 9000

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/public/', express.static('./public/'));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: false }));

app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

app.listen(config.port, () => console.log(`Grubhub server listening on ${port}`))
module.exports = app
