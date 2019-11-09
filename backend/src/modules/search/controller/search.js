'use strict'

import Tweets from '../../../models/mongoDB/tweets'
import constants from '../../../utils/constants'

/**
 * Search for tweets with given hashtag.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.hashtagSearch = async (req, res) => {
    try {
        const tweetsByHashtag = await Tweets.find({
            originalBody: { 
                $regex: new RegExp('^.* #' + req.params.hashtag + '( .*)?$', "i") 
            } 
        })
        
        return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).send(tweetsByHashtag)
    } catch (error) {
        console.log(`Error while creating user ${error}`)
        return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
    }
}