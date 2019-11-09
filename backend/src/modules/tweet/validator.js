`use strict`

import Joi from 'joi'

module.exports = {
    createTweet: {
        body: {
            tweetId: Joi.string(),
            userId: Joi.string().required(),
            userName: Joi.string().required(),
            userImageURL: Joi.string().required(),
            imageURL: Joi.string(),
            isRetweet: Joi.boolean(),
            originalTweetId: Joi.string(),
            originalUserId: Joi.string(),
            originalbody: Joi.string().max(280),
        },
        model: "createTweet",
        group: "Tweet",
        description: "Create tweet and save details in database"
    },
    addComment: {
        body: {
            tweetId : Joi.string().required(),
            userId : Joi.string().required(),
            userName : Joi.string().required(),
            imageURL : Joi.string().required(),
            body : Joi.string().max(280).required(),
        },
        model: "addComment",
        group: "Tweet",
        description: "Add a comment on tweet and its retweet and save details in database"
    },
    deleteTweet: {
        body: {
            tweetId : Joi.string().required(),
        },
        model: "deleteTweet",
        group: "Tweet",
        description: "Mark tweet as deleted"
    },
}