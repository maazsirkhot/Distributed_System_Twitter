import Joi from 'joi'
  ;`use strict`

module.exports = {
  createTweet: {
    body: {
      userId: Joi.string().required(),
      userName: Joi.string().required(),
      userImageURL: Joi.string().required(),
      originalBody: Joi.string().max(280),
      imageURL: Joi.string(),
      tweetId: Joi.string(),
      isRetweet: Joi.boolean()
    },
    payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true
    },
    model: 'createTweet',
    group: 'Tweet',
    description: 'Create tweet and save details in database'
  },
  addComment: {
    body: {
      tweetId: Joi.string().required(),
      userId: Joi.string().required(),
      userName: Joi.string().required(),
      imageURL: Joi.string().required(),
      body: Joi.string()
        .max(280)
        .required()
    },
    model: 'addComment',
    group: 'Tweet',
    description:
      'Add a comment on tweet and its retweet and save details in database'
  },
  deleteTweet: {
    params: {
      tweetId: Joi.string().required()
    },
    model: 'deleteTweet',
    group: 'Tweet',
    description: 'Mark tweet as deleted'
  },
  fetchTweetById: {
    path: {
      tweetId: Joi.string().required()
    },
    header: {
      authorization: Joi.string().required()
    },
    model: 'fetchTweetById',
    group: 'Search',
    description: 'Tweet ID is supplied and the tweet is returned'
  },
  getTweets: {
    path: {
      userId: Joi.string().required(),
      taskName: Joi.string().required()
    },
    model: 'fetchTweets',
    group: 'Tweet',
    description: 'Fetch tweets for various scenarios'
  },
  topTweetsByLike: {
    header: {
      authorization: Joi.string().required()
    },
    model: 'topTweets',
    group: 'Search',
    description: 'Get top 10 tweets for the day'
  },
  topTweetsByRetweets: {
    header: {
      authorization: Joi.string().required()
    },
    model: 'topTweets',
    group: 'Search',
    description: 'Get top 5 retweeted tweets for the day'
  },
  topTweetsByViews: {
    header: {
      authorization: Joi.string().required()
    },
    model: 'topTweets',
    group: 'Search',
    description: 'Get top 10 tweets based on views'
  },
  likeTweet: {
    body: {
      userId: Joi.string().required(),
      tweetId: Joi.string().required()
    },
    model: 'likeTweet',
    group: 'Like',
    description: 'Like tweet'
  },
  getTweetsForList: {
    path: {
      listId: Joi.string().required()
    },
    model: 'fetchTweets',
    group: 'Tweet',
    description: 'Get tweets for a list'
  },
  searchByHashTag: {
    body: {
      keyword: Joi.string()
        .required()
        .regex(/^#[a-zA-Z]+/)
    },
    model: 'searchByHashTag',
    group: 'Tweet',
    description: 'Search tweets by hashtag'
  }
}
