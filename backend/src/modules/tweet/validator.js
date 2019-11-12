`use strict`

import Joi from 'joi'

module.exports = {
    createTweet: {
        body: {
            userId: Joi.string().required(),
            userName: Joi.string().required(),
            userImageURL: Joi.string().required(),
            originalBody: Joi.string().max(280),
            imageURL: Joi.string(),
            tweetId: Joi.string(),
            isRetweet: Joi.boolean(),
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
    getTweets: {
        body: {
            userId : Joi.string().required(),
            userName : Joi.string().required(),
            taskName : Joi.string().required(),
        },
        model: "deleteTweet",
        group: "Tweet",
        description: "Mark tweet as deleted"
    }
}