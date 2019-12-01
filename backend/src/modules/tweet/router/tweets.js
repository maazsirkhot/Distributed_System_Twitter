`use strict`

import express from "express"
import tweetController from "../controller/tweets"
import validator from "../validator"
import validation from "express-validation"
import passport from "passport"
import fetchController from "../controller/fetchTweet"
import upload from "../../../middlewares/imageUpload"
import { ensureUser } from "../../../middlewares/userTokenValidator"

let router = express.Router()
require("../../../middlewares/passport")

router.post(
  "/createTweet",
  upload.single("image"),
  validation(validator["createTweet"]),
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.createTweet
)
router.post(
  "/addComment",
  validation(validator["addComment"]),
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.addComment
)
router.delete(
  "/:tweetId",
  validation(validator["deleteTweet"]),
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.deleteTweet
)
router.get(
  "/fetchTweetById/:tweetId",
  validation(validator["fetchTweetById"]),
  ensureUser,
  tweetController.fetchTweetById
)
router.get(
  "/fetchTweetByUserID/:userId/:taskName",
  validation(validator["getTweets"]),
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  fetchController.getTweets
)
router.get(
  "/topTweetsByLike/:userId",
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.topTweetsByLike
)
router.get(
  "/topTweetsByRetweets/:userId",
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.topTweetsByRetweets
)
router.get(
  "/topTweetsByViews/:userId",
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.topTweetsByViews
)
router.get(
  "/tweetsByMonth/:userId",
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.tweetsByMonth
)
router.get(
  "/tweetsByDay/:userId/:month/:year",
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.tweetsByDay
)
router.get(
  "/tweetsByHour/:userId/:day/:month/:year",
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.tweetsByHour
)
router.post(
  "/likeTweet",
  validation(validator["likeTweet"]),
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.likeTweet
)
router.get(
  "/fetchTweetForList/:listId",
  validation(validator["getTweetsForList"]),
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  fetchController.getTweetsForList
)
router.post(
  "/searchByHashTag",
  validation(validator["searchByHashTag"]),
  passport.authenticate("jwt", { session: false }),
  ensureUser,
  tweetController.searchByHashTag
)
module.exports = router
