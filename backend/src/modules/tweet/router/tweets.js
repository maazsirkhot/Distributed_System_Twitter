`use strict`

import express from 'express'
let router = express.Router()
import userController from '../controller/tweets'
import validator from '../validator'
import validation from 'express-validation'
require('../../../middlewares/passport')
import passport from 'passport'

router.post('/createTweet', validation(validator['createTweet']), passport.authenticate('jwt', { session: false }), userController.createTweet)
router.post('/addComment', validation(validator['addComment']), passport.authenticate('jwt', { session: false }), userController.addComment)
router.delete('/:tweetId', validation(validator['deleteTweet']), passport.authenticate('jwt', { session: false }), userController.deleteTweet)

module.exports = router
