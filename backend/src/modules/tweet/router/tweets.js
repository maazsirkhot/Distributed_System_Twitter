import express from 'express'
import tweetController from '../controller/tweets'
import validator from '../validator'
import validation from 'express-validation'
import passport from 'passport'
import fetchController from '../controller/fetchTweet'
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
  '/fetchTweetById/:tweetId',
  validation(validator['fetchTweetById']),
  passport.authenticate('jwt', { session: false }),
  tweetController.fetchTweetById
)
router.get(
  '/fetchTweetByUserID/',
  validation(validator['getTweets']),
  fetchController.getTweets
)
router.get(
  '/topTweetsByLike/',
  validation(validator['topTweetsByLike']),
  passport.authenticate('jwt', { session: false }),
  tweetController.topTweetsByLike
)
router.get(
  '/topTweetsByRetweets/',

  tweetController.topTweetsByRetweets
)
router.post(
  '/likeTweet',
  validation(validator['likeTweet']),
  passport.authenticate('jwt', { session: false }),
  tweetController.likeTweet
)
router.get(
  '/fetchTweetForList/',
  validation(validator['getTweetsForList']),
  fetchController.getSubscriberTweets
)
router.post(
  '/searchByHashTag',
  validation(validator['searchByHashTag']),
  passport.authenticate('jwt', { session: false }),
  tweetController.searchByHashTag
)
module.exports = router
