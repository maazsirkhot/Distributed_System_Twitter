'use strict'

import constants from '../../../utils/constants';
import model from '../../../models/sqlDB/index';
import Users from '../../../models/mongoDB/users'
import Tweets from '../../../models/mongoDB/tweets'
import mongoose from 'mongoose'


/**
 * Fetch Tweets based on userId for various scenarios
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getTweets = async (req, res) => {
    try {
		var userId = req.body.userId;
		var userName = req.body.userName;
		var taskName = req.body.taskName;

		if(taskName === "USERFEED"){
			let followingUserIds = await model.follows.findAndCountAll({
				where : {
					followerid : userId
				}
			})
			var id;
			var userids = [];
			for(id of followingUserIds.rows){
				userids.push(mongoose.Types.ObjectId(id.userId));
			}

			let fetchTweets = await Tweets.find({ userID : { $in : userids}});
			//console.log(fetchTweets);

			return res.status(200).send(fetchTweets);
		}
		if(taskName === "MYTWEETS"){
			let fetchTweets = await Tweets.find({ userID : mongoose.Types.ObjectId(userId)});
			console.log(fetchTweets);

			return res.status(200).send(fetchTweets);
		}
		if(taskName === "MYRETWEETS"){
			let fetchTweets = await Tweets.find( { $and : [{ userID : mongoose.Types.ObjectId(userId)}, { isRetweet : true} ] })
			console.log(fetchTweets);

			return res.status(200).send(fetchTweets);
		}
		if(taskName === "LIKEDTWEETS"){

		}
		if(taskName === "BOOKMARKEDTWEETS"){

		}
		if(taskName === "SUBSCRIBERFEED"){

		}
    } catch (error) {
		console.log(`Error while fetching tweets ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	} 
}