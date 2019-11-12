`use strict`

import express from 'express'
import tweetController from '../controller/tweets'
import validator from '../validator'
import validation from 'express-validation'
import passport from 'passport'
import fetchController from '../controller/fetchTweet'

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
  '/fetchTweetById/:tweetId',
  validation(validator['fetchTweetById']),
  passport.authenticate('jwt', { session: false }),
  tweetController.fetchTweetById
)

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
  '/fetchTweetByUserID/',
  validation(validator['getTweets']),
  fetchController.getTweets
)
router.get(
  '/topTweets/',
  validation(validator['topTweets']),
  passport.authenticate('jwt', { session: false }),
  tweetController.topTweets
)
module.exports = router
