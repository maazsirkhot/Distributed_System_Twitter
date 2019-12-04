
import mongoose from 'mongoose';
import Tweets from '../../../models/mongoDB/tweets';
import model from '../../../models/sqlDB/index';
import constants from '../../../utils/constants';

const responseFormer = (status, message) => ({ status, message });
/**
 * Create tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createTweet = async (req, res) => {
  let newTweetObj; let newTweet; let
    createdTweet;
  try {
    if (req.body.isRetweet) {
      const originalTweet = await Tweets.findById(req.body.tweetId);
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
        commentCount: 0,
        comments: [],
        // tweetDate: originalTweet.tweetDate,
      };
      if (originalTweet.isRetweet) {
        newTweetObj.originalTweetId = originalTweet.originalTweetId;
        newTweetObj.originalUserName = originalTweet.originalUserName;
        newTweetObj.originalUserImageURL = originalTweet.originalUserImageURL;
      } else {
        newTweetObj.originalTweetId = originalTweet._id;
        newTweetObj.originalUserName = originalTweet.userName;
        newTweetObj.originalUserImageURL = originalTweet.userImageURL;
        if (req.file) {
          newTweetObj.imageURL = req.file.location;
          console.log('Image received:', newTweetObj.imageURL);
        }
      }

      await Tweets.updateMany(
        {
          $or: [
            {
              _id: newTweetObj.originalTweetId,
            },
            {
              originalTweetId: newTweetObj.originalTweetId,
            },
          ],
          isDeleted: false,
        },
        {
          $inc: {
            retweetCount: 1,
          },
        },
      );
    } else {
      newTweetObj = {
        userId: req.body.userId,
        userName: req.body.userName,
        userImageURL: req.body.userImageURL,
        originalBody: req.body.originalBody,
        imageURL: req.body.imageURL ? req.body.imageURL : ' ',
      };
      if (req.file) {
        newTweetObj.imageURL = req.file.location;
        console.log('Image received:', newTweetObj.imageURL);
      }
    }
    newTweet = new Tweets(newTweetObj);
    createdTweet = await newTweet.save();
    createdTweet = createdTweet.toJSON();
    return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, createdTweet);
  } catch (error) {
    console.log(`Error while creating user ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

/**
 * Comment on a tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addComment = async (req, res) => {
  try {
    const comment = {
      userId: req.body.userId,
      userName: req.body.userName,
      imageURL: req.body.imageURL,
      body: req.body.body,
    };

    // await Tweets.updateMany(
    // 	{
    // 		$or: [
    // 			{
    // 				_id: req.body.tweetId,
    // 			},
    // 			{
    // 				originalTweetId: req.body.tweetId,
    // 			},
    // 		],
    // 		isDeleted: false,
    // 	},
    // 	{
    // 		$push: {
    // 			comments: comment,
    // 		},
    // 		$inc: {
    // 			commentCount: 1,
    // 		},
    // 	}
    // )

    await Tweets.findByIdAndUpdate(
      req.body.tweetId,
      {
        $push: {
          comments: comment,
        },
        $inc: {
          commentCount: 1,
        },
      },
    );

    return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, null);
  } catch (error) {
    console.log(`Error while creating user ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

/**
 * Mark a tweet as deleted and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteTweet = async (req, res) => {
  try {
    const tweetData = await Tweets.findById(req.params.tweetId);
    if (tweetData.isRetweet) {
      await Tweets.updateMany(
        {
          $or: [
            {
              _id: tweetData.originalTweetId,
            },
            {
              originalTweetId: tweetData.originalTweetId,
            },
          ],
        }, {
          $inc: {
            retweetCount: -1,
          },
        },
      );
      await Tweets.findByIdAndDelete(req.params.tweetId);
      await model.likes.destroy({ where: { tweetId: req.params.tweetId } });
    } else {
      let index;
      const tweetsToDelete = await Tweets.find({
        $or: [
          {
            _id: req.params.tweetId,
          },
          {
            originalTweetId: req.params.tweetId,
          },
        ],
      });
      for (index in tweetsToDelete) {
        await model.likes.destroy({ where: { tweetId: tweetsToDelete[index]._id.toString() } });
      }
      await Tweets.deleteMany(
        {
          $or: [
            {
              _id: req.params.tweetId,
            },
            {
              originalTweetId: req.params.tweetId,
            },
          ],
        },
      );
    }

    return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, null);
  } catch (error) {
    console.log(`Error while creating user ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};
/**
 * Fetch tweet from Database based on tweet ID.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.fetchTweetById = async (req, res) => {
  try {
    const tweet = await Tweets.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.tweetId),
        isActive: true,
      },
      {
        $push: {
          viewsCount: [{
            date: new Date(),
            count: 1,
          }],
        },
      },
    );
    if (tweet) {
      return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, tweet);
    }
    return responseFormer(204, null);
  } catch (error) {
    console.log(`Error while fetching the tweet ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};
/**
 * Fetch top 10 tweets based on today's date
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.topTweetsByLike = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    const todaysdate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    todaysdate.setUTCHours(0, 0, 0, 0);
    const toptweetsbylike = await Tweets.find(
      { userId },
      {
        likeCount: 1,
      },
    )
      .sort({ likeCount: -1 });
    // .limit(10)

    if (toptweetsbylike) {
      return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, toptweetsbylike);
    }
    return responseFormer(204, 'No tweets posted today');
  } catch (error) {
    console.log(`Error while fetching the top tweets ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};
exports.topTweetsByRetweets = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    const todaysdate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
    );
    todaysdate.setUTCHours(0, 0, 0, 0);
    const toptweets = await Tweets.find({
      userId,
      isRetweet: false,
    })
      .sort({ retweetCount: -1 })
      .limit(5);

    if (toptweets) {
      return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, toptweets);
    }
    return responseFormer(204, 'No tweets retweeted today');
  } catch (error) {
    console.log(`Error while fetching the top tweets ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

exports.topTweetsByViews = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    const todaysdate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    console.log(`hours${todaysdate.getUTCHours()}`);
    const h = new Date().getHours() - 1;
    todaysdate.setUTCHours(h, 0, 0, 0);
    console.log(todaysdate);
    /* let toptweets = await Tweets.find({
		  tweetDate: {
			$gte: date
		  }
		 })
		  .sort({ retweetCount: -1 })
		  .limit(5)

		let toptweets = await Tweets.aggregate({
		  $group: {
			total: { $sum: '$viewsCount(count)' }
		  }
		}) */
    const toptweets = await Tweets.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            tweetId: '$_id',
          },
          total: { $sum: { $sum: '$viewsCount.count' } },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);
    console.log(toptweets[0]);
    if (toptweets) {
      return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, toptweets);
    }
    return responseFormer(204, 'No retweeted today');
  } catch (error) {
    console.log(`Error while fetching the top tweets ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

exports.likeTweet = async (req, res) => {
  try {
    const result = await Tweets.findByIdAndUpdate(
      { _id: req.body.tweetId },
      { $inc: { likeCount: 1 } },
    );
    if (result) {
      const likeObj = {
        userId: req.body.userId,
        tweetId: req.body.tweetId,
      };

      const result = await model.likes.findAndCountAll({
        where: likeObj,
      });

      if (result.count) {
        await Tweets.findByIdAndUpdate(
          {
            _id: req.body.tweetId,
          },
          {
            $inc: { likeCount: -1 },
          },
        );

        return responseFormer(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS, 'User already liked this tweet');
      }
      await model.likes.create(likeObj);

      return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, null);
    }
    return responseFormer(constants.STATUS_CODE.NO_CONTENT_STATUS, null);
  } catch (error) {
    console.log(`Error while liking the tweet ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

exports.searchByHashTag = async (req, res) => {
  try {
    const result = await Tweets.find({
      originalBody: { $regex: req.body.keyword, $options: 'i' },
      isActive: true,
    });

    const resultObject = {
      count: result.length,
      data: result,
    };

    return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, resultObject);
  } catch (error) {
    console.log(`error while searching by Hashtag ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};


exports.tweetsByMonth = async (req, res) => {
  try {
    console.log(req.params.userId);
    const result = await Tweets.aggregate(
      [
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.params.userId),
          },
        },
        {
          $group: {
            _id: {
              $month: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
      ],
    )
      .sort({ _id: 1 });

    return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, result);
  } catch (error) {
    console.log(`error while searching by Hashtag ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

exports.tweetsByDay = async (req, res) => {
  try {
    // console.log(req.params)
    let index;
    const allDays = {};
    for (index = 1; index <= 31; index++) {
      allDays[index] = 0;
    }
    const result = await Tweets.aggregate(
      [
        {
          $project: {
            month: {
              $month: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            year: {
              $year: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            userId: '$userId',
            tweetDate: '$tweetDate',
          },
        },
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.params.userId),
            month: parseInt(req.params.month),
            year: parseInt(req.params.year),
          },
        },
        {
          $group: {
            _id: {
              $dayOfMonth: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
      ],
    );

    for (index in result) {
      allDays[result[index]._id] = result[index].count;
    }

    return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, allDays);
  } catch (error) {
    console.log(`error while searching by Hashtag ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};

exports.tweetsByHour = async (req, res) => {
  try {
    // console.log(req.params)
    let index;
    const allHours = {};
    for (index = 0; index <= 23; index++) {
      allHours[index] = 0;
    }
    const result = await Tweets.aggregate(
      [
        {
          $project: {
            day: {
              $dayOfMonth: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            month: {
              $month: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            year: {
              $year: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            userId: '$userId',
            tweetDate: '$tweetDate',
          },
        },
        {
          $match: {
            userId: mongoose.Types.ObjectId(req.params.userId),
            day: parseInt(req.params.day),
            month: parseInt(req.params.month),
            year: parseInt(req.params.year),
          },
        },
        {
          $group: {
            _id: {
              $hour: {
                date: '$tweetDate',
                timezone: 'America/Los_Angeles',
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
      ],
    );

    for (index in result) {
      allHours[result[index]._id] = result[index].count;
    }

    return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, allHours);
  } catch (error) {
    console.log(`error while searching by Hashtag ${error}`);
    return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message);
  }
};
