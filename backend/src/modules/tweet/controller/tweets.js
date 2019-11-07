'use strict'

import Tweets from '../../../models/mongoDB/tweets'
import constants from '../../../utils/constants'

/**
 * Create tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createTweet = async (req, res) => {
    let newTweetObj,
        newTweet,
        createdTweet
    try {
        if (req.body.isRetweet) {
            const Tweet = await Tweets.findById(req.body.tweetID)
            const originalTweet = Tweet.isRetweet ? await Tweets.findById(Tweet.originalTweetID) : Tweet
            newTweetObj = {
                userID: req.body.userID,
                imageURL: originalTweet.imageURL,
                isRetweet: true,
                originalTweetID: originalTweet._id,
                originalUserID: originalTweet.userID,
                originalBody: originalTweet.originalBody,
                likeCount: originalTweet.likeCount,
                commentCount: originalTweet.commentCount
            }
        } else {
            newTweetObj = {
                userID: req.body.userID,
                originalBody: req.body.originalBody
            }
        }
        newTweet = new Tweets(newTweetObj)
        createdTweet = await newTweet.save()
        createdTweet = createdTweet.toJSON()
        return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).send(createdTweet)
    } catch (error) {
        console.log(`Error while creating user ${error}`)
        return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
    }
}