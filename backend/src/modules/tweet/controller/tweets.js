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
            const originalTweet = await Tweets.findById(req.body.tweetID)
            newTweetObj = {
                userID: req.body.userID,
                imageURL: originalTweet.imageURL,
                isRetweet: true,
                originalUserID: originalTweet.userID,
                originalBody: originalTweet.originalBody,
                retweetCount: originalTweet.retweetCount + 1,
                likeCount: originalTweet.likeCount,
                commentCount: originalTweet.commentCount,
            }
            if (originalTweet.isRetweet) {
                newTweetObj.originalTweetID = originalTweet.originalTweetID
            } else {
                newTweetObj.originalTweetID = originalTweet._id
            }
            await Tweets.updateMany({                
				$or : [{ 
					_id: newTweetObj.originalTweetID 
				},{
					originalTweetID: newTweetObj.originalTweetID
				}]
            }, {
                $inc : {
                    retweetCount : 1
                }
            })
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