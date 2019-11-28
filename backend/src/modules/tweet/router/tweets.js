`use strict`;

import express from 'express'
import tweetController from '../controller/tweets'
import validator from '../validator'
import validation from 'express-validation'
import passport from 'passport'
import fetchController from '../controller/fetchTweet'
import upload from '../../../middlewares/imageUpload'

let router = express.Router()
require('../../../middlewares/passport')

router.post(
  '/createTweet',
  upload.single('image'),
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
  '/fetchTweetByUserID/:userId/:taskName',
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
  '/fetchTweetForList/:listId',
  validation(validator['getTweetsForList']),
  fetchController.getTweetsForList
)
router.post(
  '/searchByHashTag',
  validation(validator['searchByHashTag']),
  passport.authenticate('jwt', { session: false }),
  tweetController.searchByHashTag
)
module.exports = router
