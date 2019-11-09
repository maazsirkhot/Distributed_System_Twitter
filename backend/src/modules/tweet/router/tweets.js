`use strict`

import express from 'express'
let router = express.Router()
import tweetController from '../controller/tweets'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport')
import passport from 'passport'

router.post('/createTweet', validation(validator['createTweet']), passport.authenticate('jwt', { session: false }), tweetController.createTweet)
router.post('/addComment', validation(validator['addComment']), passport.authenticate('jwt', { session: false }), tweetController.addComment)
router.delete('/:tweetId', validation(validator['deleteTweet']), passport.authenticate('jwt', { session: false }), tweetController.deleteTweet)

module.exports = router
