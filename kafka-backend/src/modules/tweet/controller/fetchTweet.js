'use strict'

import constants from '../../../utils/constants'
import model from '../../../models/sqlDB/index'
import Users from '../../../models/mongoDB/users'
import Tweets from '../../../models/mongoDB/tweets'
import Lists from '../../../models/mongoDB/lists'
import mongoose from 'mongoose'
const responseFormer = (status, message) => {
	return {status: status, message: message}
}

/**
 * Fetch Tweets based on userId for various scenarios
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getTweets = async (req, res) => {
	try {
		var userId = req.params.userId
		var taskName = req.params.taskName

		if (taskName === constants.TASKS.USERFEED) {
			let followingUserIds = await model.follows.findAndCountAll({
				where: {
					followerid: userId
				}
			})
			var id
			var userids = [userId]
			for (id of followingUserIds.rows) {
				userids.push(mongoose.Types.ObjectId(id.userId))
			}
			let fetchTweets = await Tweets.find({ userId: { $in: userids }, isActive: true })
				.sort({tweetDate: -1})
				.skip(parseInt(req.query.start))
				.limit(parseInt(req.query.count))
			return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, fetchTweets)
		}
		if (taskName === constants.TASKS.MYTWEETS) {
			let fetchTweets = await Tweets.find({
				userId: mongoose.Types.ObjectId(userId),
				isActive: true,
			})
				.sort({tweetDate: -1})
				.skip(parseInt(req.query.start))
				.limit(parseInt(req.query.count))
			return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, fetchTweets)
		}
		if (taskName === constants.TASKS.MYRETWEETS) {
			let fetchTweets = await Tweets.find({
				userId: mongoose.Types.ObjectId(userId),
				isRetweet: true,
				isActive: true,
			})
			.sort({tweetDate: -1})
			.skip(parseInt(req.query.start))
			.limit(parseInt(req.query.count))
			return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, fetchTweets)
		}
		if (taskName === constants.TASKS.LIKEDTWEETS) {
			let likedtweets = await model.likes.findAndCountAll({
				where: {
					userid: userId
				}
			})
			var tweetids = []
			var tweet
			for (tweet of likedtweets.rows) {
				tweetids.push(mongoose.Types.ObjectId(tweet.tweetId))
			}
			// let fetchTweets = await Tweets.find({ _id: { $in: tweetids } })
			let index,
				allLikedTweets = []
			for(index = parseInt(req.query.start); index < parseInt(req.query.start) + parseInt(req.query.count) && index < tweetids.length; index++) {
				tweet = await Tweets.findOne({
					_id: tweetids[index], 
					isActive: true
				})
				if (tweet) {
					allLikedTweets.push(tweet)
				}
			}
			return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, allLikedTweets)
		}
		if (taskName === constants.TASKS.BOOKMARKEDTWEETS) {
			let bookmarkedTweetIds,
				bookmarkedTweets = [],
				tweet,
				index
			bookmarkedTweetIds = await Users.findOne(
				{
					_id: mongoose.Types.ObjectId(userId),
					isActive: true
				}, {
					bookmarks: 1
				})
			bookmarkedTweetIds = bookmarkedTweetIds.bookmarks.reverse()
			console.log("bookmarkedTweetIds", bookmarkedTweetIds)
			for(index = parseInt(req.query.start); index < parseInt(req.query.start) + parseInt(req.query.count) && index < bookmarkedTweetIds.length; index++) {
				tweet = await Tweets.findOne({
					_id: bookmarkedTweetIds[index],
					isActive: true
				})
				if(tweet) {
					bookmarkedTweets.push(tweet)
				}
			}
			return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, bookmarkedTweetIds)
		}
		if (taskName === constants.TASKS.SUBSCRIBERFEED) {
			// Need more clarification
		}
	} catch (error) {
		console.log(`Error while fetching tweets ${error}`)
		return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message)
	}
}

/**
 * Fetch Tweets based on Subscriber Feed for various scenarios
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getSubscriberTweets = async (req, res) => {
	try {
		//var userId = req.body.userId
		//var userName = req.body.userName
		var listName = req.params.listName

		let listUserIds = await model.listSubscribers.findAndCountAll({
			where: {
				listName: listName
			}
		})

		var userids = []
		var user;
		for (user of listUserIds.rows) {
			userids.push(mongoose.Types.ObjectId(user.subscriberId))
		}
		let fetchTweets = await Tweets.find({ userId: { $in: userids }, isActive: true })

		//console.log(fetchTweets);
		return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, fetchTweets)

	} catch (error) {
		console.log(`Error while fetching tweets ${error}`)
		return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message)
	}
}


/**
 * Get all tweets posted by all members present in a list.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getTweetsForList = async (req, res) => {
	try {
		let index,
			listDetails = [],
			listMemberIds = [],
			fetchTweets
		listDetails = await Lists.findById(mongoose.Types.ObjectId(req.params.listId))
		for (index in listDetails.membersId) {
			listMemberIds.push(listDetails.membersId[index].memberId)
		}
		fetchTweets = await Tweets.find({ userId: { $in: listMemberIds }, isActive: true })
			.sort({tweetDate: -1})
			.skip(parseInt(req.query.start))
			.limit(parseInt(req.query.count))
		if (fetchTweets.length > 0) {
			return responseFormer(constants.STATUS_CODE.SUCCESS_STATUS, fetchTweets)
		} else {
			return responseFormer(204, [])
		}
	} catch (error) {
		console.log(`Error while getting susbcribed lists of user ${error}`)
		return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message)
	}
}