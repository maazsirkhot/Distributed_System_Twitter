'use strict'

import constants from '../../../utils/constants'
import model from '../../../models/sqlDB/index'
import Users from '../../../models/mongoDB/users'
import Tweets from '../../../models/mongoDB/tweets'
import mongoose from 'mongoose'

/**
 * Fetch Tweets based on userId for various scenarios
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getTweets = async (req, res) => {
  try {
    var userId = req.body.userId
    var userName = req.body.userName
    var taskName = req.body.taskName

    if (taskName === constants.TASKS.USERFEED) {
      let followingUserIds = await model.follows.findAndCountAll({
        where: {
          followerid: userId
        }
      })
      var id
      var userids = []
      for (id of followingUserIds.rows) {
        userids.push(mongoose.Types.ObjectId(id.userId))
      }
      let fetchTweets = await Tweets.find({ userID: { $in: userids } })
      return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
    }
    if (taskName === constants.TASKS.MYTWEETS) {
      let fetchTweets = await Tweets.find({
        userID: mongoose.Types.ObjectId(userId)
      })
      return res.status(SUCCESS_STATUS).send(fetchTweets)
    }
    if (taskName === constants.TASKS.MYRETWEETS) {
      let fetchTweets = await Tweets.find({
        $and: [
          { userID: mongoose.Types.ObjectId(userId) },
          { isRetweet: true }
        ]
      })
      return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
    }
    if (taskName === constants.TASKS.LIKEDTWEETS) {
      let likedtweets = await model.likes.findAndCountAll({
        where: {
          userid: userId
        }
      })
      var tweetids = []
      var tweet
      for (tweet of likedtweets.rows) {
        tweetids.push(mongoose.Types.ObjectId(tweet.tweetId))
      }
      let fetchTweets = await Tweets.find({ _id: { $in: tweetids } })
      return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
    }
    if (taskName === constants.TASKS.BOOKMARKEDTWEETS) {
      let bookmarkedtweets = await model.bookmarks.findAndCountAll({
        where: {
          userid: userId
        }
      })
      var bookmarkids = []
      var bookmark
      for (bookmark of bookmarkedtweets.rows) {
        bookmarkids.push(mongoose.Types.ObjectId(bookmark.tweetId))
      }
      let fetchTweets = await Tweets.find({ _id: { $in: bookmarkids } })
      return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
    }
    if (taskName === constants.TASKS.SUBSCRIBERFEED) {
      // Need more clarification
    }
  } catch (error) {
    console.log(`Error while fetching tweets ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}
