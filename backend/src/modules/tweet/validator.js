`use strict`

import Joi from 'joi'

module.exports = {
    createTweet: {
        body: {
            tweetID: Joi.string(),
            userID: Joi.string().required(),
            imageURL: Joi.string(),
            isRetweet: Joi.boolean(),
            originalTweetID: Joi.string(),
            originalUserID: Joi.string(),
            originalbody: Joi.string().max(280)
        },
        model: "createTweet",
        group: "Tweet",
        description: "Create tweet and save details in database"
    },
}