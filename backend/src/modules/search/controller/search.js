
import mongoose from 'mongoose';
import _ from 'lodash';
import Tweets from '../../../models/mongoDB/tweets';
import Users from '../../../models/mongoDB/users';
import constants from '../../../utils/constants';

/**
 * Search for tweets with given hashtag.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.hashtagSearch = async (req, res) => {
  try {
    const tweetsByHashtag = await Tweets.find({
      originalBody: {
        $regex: new RegExp(`^(.* )?#${req.params.hashtag}( .*)?$`, 'i'),
      },
      isActive: true,
    })
      .sort({ _id: -1 })
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.count));
    return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).send(tweetsByHashtag);
  } catch (error) {
    console.log(`Error while creating user ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};

/**
 * Fetch user profile details based on userid and increase the view count of it.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.fetchProfile = async (req, res) => {
  try {
    let details = await Users.findOne({
      _id: mongoose.Types.ObjectId(req.params.userId),
      isActive: true,
    });
    if (details) {
      const { views } = details;
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      today = `${mm}/${dd}/${yyyy}`;
      const viewCountObj = {};
      let newDate = false;
      let newCount;

      if (views.length === 0) {
        viewCountObj.date = today;
        viewCountObj.count = 1;
        newDate = true;
      } else {
        const found = _.find(details.views, ['date', today]);
        if (found) {
          newCount = found.count + 1;
        } else {
          viewCountObj.date = today;
          viewCountObj.count = 1;
          newDate = true;
        }
      }

      if (newDate) {
        await Users.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.userId), {
          $push: {
            views: viewCountObj,
          },
        });
      } else {
        await Users.updateOne({ _id: mongoose.Types.ObjectId(req.params.userId), 'views.date': today }, {
          $set: {
            'views.$.count': newCount,
          },
        });
      }

      details = await Users.findById(mongoose.Types.ObjectId(req.params.userId));
      details = details.toJSON();
      delete details.password;
      return res.status(200).send(details);
    }
    return res.status(204).json();
  } catch (error) {
    console.log(`Error while fetching user profile details and increasing view count ${error}`);
    return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message);
  }
};
