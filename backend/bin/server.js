`use strict`

let createError = require('http-errors')
let express = require('express')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
import config from '../config'
import cors from 'cors'
import constants from '../src/utils/constants'

// router for modules
let usersRouter = require('../src/modules/user/router/users')
let tweetsRouter = require('../src/modules/tweet/router/tweets')
let messageRouter = require('../src/modules/messages/router/messages');
let listRouter = require('../src/modules/list/router/list');
let searchRouter = require('../src/modules/search/router/search');

// database connections
require('../src/models/mongoDB/index')
require('../src/models/sqlDB/index')

let app = express()

let port = process.env.PORT || 9000
let frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/public/', express.static('./public/'));

// use cors to allow cross origin resource sharing
app.use(cors({ origin: frontendUrl, credentials: false }));


// base routes for modules
app.use('/users', usersRouter)
app.use('/tweets', tweetsRouter)
app.use('/messages', messageRouter)
app.use('/lists', listRouter)
app.use('/search', searchRouter)

// Ping route to check health of instance for load balancer
app.get('/ping', (req, res) => {
	return res
      .status(constants.STATUS_CODE.SUCCESS_STATUS)
      .send()
})

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

app.listen(config.port, () => console.log(`Twitter server listening on ${port}`))
module.exports = app
