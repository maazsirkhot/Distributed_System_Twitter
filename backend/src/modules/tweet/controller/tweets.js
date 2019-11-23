'use strict'

import Tweets from '../../../models/mongoDB/tweets'
import model from '../../../models/sqlDB/index'
import constants from '../../../utils/constants'
import mongoose from 'mongoose'

/**
 * Create tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createTweet = async (req, res) => {
  let newTweetObj, newTweet, createdTweet
  try {
    if (req.body.isRetweet) {
      const originalTweet = await Tweets.findById(req.body.tweetId)
      newTweetObj = {
        userId: req.body.userId,
        userName: req.body.userName,
        userImageURL: req.body.userImageURL,
        imageURL: originalTweet.imageURL,
        isRetweet: true,
        originalUserId: originalTweet.userId,
        originalBody: originalTweet.originalBody,
        retweetCount: originalTweet.retweetCount + 1,
        likeCount: 0,
        commentCount: originalTweet.commentCount,
        comments: originalTweet.comments,
        tweetDate: originalTweet.tweetDate
      }
      if (originalTweet.isRetweet) {
        newTweetObj.originalTweetId = originalTweet.originalTweetId
        newTweetObj.originalUserName = originalTweet.originalUserName
        newTweetObj.originalUserImageURL = originalTweet.originalUserImageURL
      } else {
        newTweetObj.originalTweetId = originalTweet._id
        newTweetObj.originalUserName = originalTweet.userName
        newTweetObj.originalUserImageURL = originalTweet.userImageURL
      }
      await Tweets.updateMany(
        {
          $or: [
            {
              _id: newTweetObj.originalTweetId
            },
            {
              originalTweetId: newTweetObj.originalTweetId
            }
          ],
          isDeleted: false
        },
        {
          $inc: {
            retweetCount: 1
          }
        }
      )
    } else {
      newTweetObj = {
        userId: req.body.userId,
        userName: req.body.userName,
        userImageURL: req.body.userImageURL,
        originalBody: req.body.originalBody,
        imageURL: req.body.imageURL ? req.body.imageURL : ' '
      }
    }
    newTweet = new Tweets(newTweetObj)
    createdTweet = await newTweet.save()
    createdTweet = createdTweet.toJSON()
    return res
      .status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
      .send(createdTweet)
  } catch (error) {
    console.log(`Error while creating user ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}

/**
 * Comment on a tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addComment = async (req, res) => {
  try {
    let comment = { 
      userId: req.body.userId,
      userName: req.body.userName,
      imageURL:req.body.imageURL,
      body: req.body.body 
    }

    await Tweets.updateMany(
      {
        $or: [
          {
            _id: req.body.tweetId
          },
          {
            originalTweetId: req.body.tweetId
          }
        ],
        isDeleted: false
      },
      {
        $push: {
          comments: comment
        },
        $inc: {
          commentCount: 1
        }
      }
    )

    return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).json()
  } catch (error) {
    console.log(`Error while creating user ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}

/**
 * Mark a tweet as deleted and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteTweet = async (req, res) => {
  try {
    await Tweets.updateMany(
      {
        $or: [
          {
            _id: req.params.tweetId
          },
          {
            originalTweetId: req.params.tweetId
          }
        ],
        isDeleted: false
      },
      {
        $set: {
          isDeleted: true
        }
      }
    )

    return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).json()
  } catch (error) {
    console.log(`Error while creating user ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}
/**
 * Fetch tweet from Database based on tweet ID.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.fetchTweetById = async (req, res) => {
  try {
    let tweet = await Tweets.findById(
      mongoose.Types.ObjectId(req.params.tweetId)
    )
    if (tweet) {
      return res.status(200).send(tweet)
    } else {
      return res.status(204).json()
    }
  } catch (error) {
    console.log(`Error while fetching the tweet ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}
/**
 * Fetch top 10 tweets based on today's date
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.topTweetsByLike = async (req, res) => {
  try {
    let today = new Date()
    var todaysdate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
    todaysdate.setUTCHours(0, 0, 0, 0)
    let toptweetsbylike = await Tweets.find({ tweetDate: { $gte: todaysdate } })
      .sort({ likeCount: -1 })
      .limit(10)

    if (toptweetsbylike) {
      return res.status(200).send(toptweetsbylike)
    } else {
      return res.status(204).send('No tweets posted today')
    }
  } catch (error) {
    console.log(`Error while fetching the top tweets ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}
exports.topTweetsByRetweets = async (req, res) => {
  try {
    let today = new Date()
    var todaysdate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    )
    todaysdate.setUTCHours(0, 0, 0, 0)
    let toptweets = await Tweets.find({
      tweetDate: {
        $gte: todaysdate
      }
    })
      .sort({ retweetCount: -1 })
      .limit(5)

    if (toptweets) {
      return res.status(200).send(toptweets)
    } else {
      return res.status(204).send('No tweets retweeted today')
    }
  } catch (error) {
    console.log(`Error while fetching the top tweets ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}
exports.likeTweet = async (req, res) => {
  try {
    let result = await Tweets.findByIdAndUpdate(
      { _id: req.body.tweetId },
      { $inc: { likeCount: 1 } }
    )
    if (result) {
      let likeObj = {
        userId: req.body.userId,
        tweetId: req.body.tweetId
      }

      let result = await model.likes.findAndCountAll({
        where: likeObj
      })

      if (result.count) {
        await Tweets.findByIdAndUpdate(
          {
            _id: req.body.tweetId
          },
          {
            $inc: { likeCount: -1 }
          }
        )

        return res
          .status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
          .send('User already liked this tweet')
      } else {
        await model.likes.create(likeObj)

        return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send()
      }
    } else {
      return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS).json()
    }
  } catch (error) {
    console.log(`Error while liking the tweet ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}

exports.searchByHashTag = async (req, res) => {
  try {
    let result = await Tweets.find({
      originalBody: { $regex: req.body.keyword, $options: 'i' }
    })

    let resultObject = {
      count: result.length,
      data: result
    }

    return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(resultObject)
  } catch (error) {
    console.log(`error while searching by Hashtag ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}
