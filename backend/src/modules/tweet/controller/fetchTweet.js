'use strict'

import constants from '../../../utils/constants'
import model from '../../../models/sqlDB/index'
import Users from '../../../models/mongoDB/users'
import Tweets from '../../../models/mongoDB/tweets'
import Lists from '../../../models/mongoDB/lists'
import mongoose from 'mongoose'

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
			var userids = []
			for (id of followingUserIds.rows) {
				userids.push(mongoose.Types.ObjectId(id.userId))
			}
			let fetchTweets = await Tweets.find({ userID: { $in: userids } })
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
		}
		if (taskName === constants.TASKS.MYTWEETS) {
			let fetchTweets = await Tweets.find({
				userId: mongoose.Types.ObjectId(userId)
			})
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
		}
		if (taskName === constants.TASKS.MYRETWEETS) {
			let fetchTweets = await Tweets.find({
				$and: [
					{ userID: mongoose.Types.ObjectId(userId) },
					{ isRetweet: true }
				]
			})
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
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
			let fetchTweets = await Tweets.find({ _id: { $in: tweetids } })
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets)
		}
		if (taskName === constants.TASKS.BOOKMARKEDTWEETS) {
			let bookmarkedTweetIds,
				bookmarkedTweets = [],
				bookmark,
				tweet
			bookmarkedTweetIds= await Users.findById(
				mongoose.Types.ObjectId(userId)
			,{
				bookmarks : 1
			})

			for (bookmark in bookmarkedTweetIds.bookmarks) {
				tweet = await Tweets.findById(bookmarkedTweetIds.bookmarks[bookmark])
				bookmarkedTweets.push(tweet)
			}
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(bookmarkedTweets)
		}
		if (taskName === constants.TASKS.SUBSCRIBERFEED) {
			// Need more clarification
		}
	} catch (error) {
		console.log(`Error while fetching tweets ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
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
		let fetchTweets = await Tweets.find({ userID: { $in: userids } })

		//console.log(fetchTweets);
		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(fetchTweets);

	} catch (error) {
		console.log(`Error while fetching tweets ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
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
		fetchTweets = await Tweets.find({ userId: { $in: listMemberIds } })
		if (fetchTweets.length > 0) {
			return res.status(200).send(fetchTweets)
		} else {
			return res.status(204).send([])
		}
	} catch (error) {
		console.log(`Error while getting susbcribed lists of user ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	}
}