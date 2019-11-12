import express from 'express'
import tweetController from '../controller/tweets'
import validator from '../validator'
import validation from 'express-validation'
import passport from 'passport'

  ;`use strict`
let router = express.Router()
require('../../../middlewares/passport')

router.post(
  '/createTweet',
  validation(validator['createTweet']),
  passport.authenticate('jwt', { session: false }),
  tweetController.createTweet
)
router.post(
  '/addComment',
  validation(validator['addComment']),
  passport.authenticate('jwt', { session: false }),
  tweetController.addComment
)
router.delete(
  '/:tweetId',
  validation(validator['deleteTweet']),
  passport.authenticate('jwt', { session: false }),
  tweetController.deleteTweet
)
router.get(
  '/:tweetId',
  validation(validator['fetchTweetbyID']),
  passport.authenticate('jwt', { session: false }),
  tweetController.fetchTweetbyID
)

module.exports = router
