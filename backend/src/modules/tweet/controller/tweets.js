"use strict"

import Tweets from "../../../models/mongoDB/tweets"
import Users from "../../../models/mongoDB/users"
import model from "../../../models/sqlDB/index"
import constants from "../../../utils/constants"
import mongoose, { Mongoose } from "mongoose"

/**
 * Create tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createTweet = async (req, res) => {
	let newTweetObj, newTweet, createdTweet
	try {
		if (req.body.isRetweet) {
			const originalTweet = await Tweets.findById(req.body.tweetId)
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
				tweetDate: originalTweet.tweetDate,
			}
			if (originalTweet.isRetweet) {
				newTweetObj.originalTweetId = originalTweet.originalTweetId
				newTweetObj.originalUserName = originalTweet.originalUserName
				newTweetObj.originalUserImageURL = originalTweet.originalUserImageURL
			} else {
				newTweetObj.originalTweetId = originalTweet._id
				newTweetObj.originalUserName = originalTweet.userName
				newTweetObj.originalUserImageURL = originalTweet.userImageURL
				if (req.file) {
					newTweetObj.imageURL = req.file.location
					console.log("Image received:", newTweetObj.imageURL)
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
				}
			)
		} else {
			newTweetObj = {
				userId: req.body.userId,
				userName: req.body.userName,
				userImageURL: req.body.userImageURL,
				originalBody: req.body.originalBody,
				imageURL: req.body.imageURL ? req.body.imageURL : " ",
			}
			if (req.file) {
				newTweetObj.imageURL = req.file.location
				console.log("Image received:", newTweetObj.imageURL)
			}
		}
		newTweet = new Tweets(newTweetObj)
		createdTweet = await newTweet.save()
		createdTweet = createdTweet.toJSON()
		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(createdTweet)
	} catch (error) {
		console.log(`Error while creating user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Comment on a tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addComment = async (req, res) => {
	try {
		let comment = {
			userId: req.body.userId,
			userName: req.body.userName,
			imageURL: req.body.imageURL,
			body: req.body.body,
		}

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
			}
		)

		return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).json()
	} catch (error) {
		console.log(`Error while creating user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Mark a tweet as deleted and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deleteTweet = async (req, res) => {
	try {
		let tweetData = await Tweets.findById(req.params.tweetId)
		if(tweetData.isRetweet) {
			await Tweets.updateMany(
				{
					$or: [
						{
							_id: tweetData.originalTweetId,
						},
						{
							originalTweetId: tweetData.originalTweetId,
						},
					]
				},{
					$inc: {
						retweetCount: -1
					}
				}
			)
			await Tweets.findByIdAndDelete(req.params.tweetId)
		} else {			
			await Tweets.deleteMany(
				{
					$or: [
						{
							_id: req.params.tweetId,
						},
						{
							originalTweetId: req.params.tweetId,
						},
					]
				}
			)
		}

		return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).json()
	} catch (error) {
		console.log(`Error while creating user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}
/**
 * Fetch tweet from Database based on tweet ID.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.fetchTweetById = async (req, res) => {
	try {
		let tweet = await Tweets.findByIdAndUpdate(
			mongoose.Types.ObjectId(req.params.tweetId),
			{
				$push: {
					viewsCount: [{
						date: new Date(),
						count: 1
					}]
				}
			}
		)
		if (tweet) {
			return res.status(200).send(tweet)
		} else {
			return res.status(204).json()
		}
	} catch (error) {
		console.log(`Error while fetching the tweet ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}
/**
 * Fetch top 10 tweets based on today's date
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.topTweetsByLike = async (req, res) => {
	try {
		let userId = req.params.userId
		let today = new Date()
		var todaysdate = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		)
		todaysdate.setUTCHours(0, 0, 0, 0)
		let toptweetsbylike = await Tweets.find(
			{ userId: userId },
			{
				likeCount: 1,
			}
		)
			.sort({ likeCount: -1 })
		// .limit(10)

		if (toptweetsbylike) {
			return res.status(200).json(toptweetsbylike)
		} else {
			return res.status(204).send("No tweets posted today")
		}
	} catch (error) {
		console.log(`Error while fetching the top tweets ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}
exports.topTweetsByRetweets = async (req, res) => {
	try {
		let userId = req.params.userId
		let today = new Date()
		var todaysdate = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() - 1
		)
		todaysdate.setUTCHours(0, 0, 0, 0)
		let toptweets = await Tweets.find({
			userId: userId,
			isRetweet: false
		})
			.sort({ retweetCount: -1 })
			.limit(5)

		if (toptweets) {
			return res.status(200).send(toptweets)
		} else {
			return res.status(204).send("No tweets retweeted today")
		}
	} catch (error) {
		console.log(`Error while fetching the top tweets ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.topTweetsByViews = async (req, res) => {
	try {
		let userId = req.params.userId
		let today = new Date()
		var todaysdate = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		)
		console.log("hours" + todaysdate.getUTCHours())
		let h = new Date().getHours() - 1
		todaysdate.setUTCHours(h, 0, 0, 0)
		console.log(todaysdate)
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
		let toptweets = await Tweets.aggregate([
			{
				$match: {
					userId: mongoose.Types.ObjectId(userId),
				},
			},
			{
				$group: {
					_id: {
						tweetId: "$_id",
					},
					total: { $sum: { $sum: "$viewsCount.count" } },
				},
			},
			{ $sort: { total: -1 } },
			{ $limit: 10 },
		])
		console.log(toptweets[0])
		if (toptweets) {
			return res.status(200).send(toptweets)
		} else {
			return res.status(204).send("No tweets retweeted today")
		}
	} catch (error) {
		console.log(`Error while fetching the top tweets ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.likeTweet = async (req, res) => {
	try {
		let result = await Tweets.findByIdAndUpdate(
			{ _id: req.body.tweetId },
			{ $inc: { likeCount: 1 } }
		)
	if (result) {
		let likeObj = {
			userId: req.body.userId,
			tweetId: req.body.tweetId
		}

		let result = await model.likes.findAndCountAll({
			where: likeObj
		})

		if (result.count) {
			await Tweets.findByIdAndUpdate(
				{
					_id: req.body.tweetId
				},
				{
					$inc: { likeCount: -1 }
				}
			)

			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('User already liked this tweet')
		} else {
			await model.likes.create(likeObj)

				return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send()
		}
	} else {
		return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS).json()
	}
	} catch (error) {
		console.log(`Error while liking the tweet ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.searchByHashTag = async (req, res) => {
	try {
		let result = await Tweets.find({
			originalBody: { $regex: req.body.keyword, $options: "i" },
		})

		let resultObject = {
			count: result.length,
			data: result,
		}

		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(resultObject)
	} catch (error) {
		console.log(`error while searching by Hashtag ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


exports.tweetsByMonth = async (req, res) => {
	try {
		console.log(req.params.userId)
		let result = await Tweets.aggregate(
			[
				{
					$match: {
						userId: mongoose.Types.ObjectId(req.params.userId)
					}
				},
				{
					$group : {
						_id: {
							$month :  {
								date: "$tweetDate",
								timezone: "America/Los_Angeles",
							}
						},
						count : {
							$sum : 1
						}
					}
				}
			]
		)

		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(result)
	} catch (error) {
		console.log(`error while searching by Hashtag ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.tweetsByDay = async (req, res) => {
	try {
		// console.log(req.params)
		let index,
			allDays = {}
		for(index = 1; index <= 31; index++) {
			allDays[index] = 0
		}
		let result = await Tweets.aggregate(
			[
				{
					$project: {
						month: {
							$month: "$tweetDate"
						},
						year: {
							$year: "$tweetDate"	
						},
						userId: "$userId",
						tweetDate: "$tweetDate"
					}
				},
				{
					$match: {
						userId: mongoose.Types.ObjectId(req.params.userId),
						month: parseInt(req.params.month),
						year: parseInt(req.params.year),
					}
				},
				{
					$group : {
						_id: {
							$dayOfMonth :  {
								date: "$tweetDate",
								timezone: "America/Los_Angeles",
							}
						},
						count : {
							$sum : 1
						}
					}
				}
			]
		)

		for(index in result) {
			allDays[result[index]._id] = result[index].count
		}

		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(allDays)
	} catch (error) {
		console.log(`error while searching by Hashtag ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.tweetsByHour = async (req, res) => {
	try {
		// console.log(req.params)
		let index,
			allHours = {}
		for(index = 0; index <= 23; index++) {
			allHours[index] = 0
		}
		let result = await Tweets.aggregate(
			[
				{
					$project: {
						day: {
							$dayOfMonth: "$tweetDate"
						},
						month: {
							$month: "$tweetDate"
						},
						year: {
							$year: "$tweetDate"	
						},
						userId: "$userId",
						tweetDate: "$tweetDate"
					}
				},
				{
					$match: {
						userId: mongoose.Types.ObjectId(req.params.userId),
						day: parseInt(req.params.day),
						month: parseInt(req.params.month),
						year: parseInt(req.params.year),
					}
				},
				{
					$group : {
						_id: {
							$hour : {
								date: "$tweetDate",
								timezone: "America/Los_Angeles",
							}
						},
						count : {
							$sum : 1
						}
					}
				}
			]
		)

		for(index in result) {
			allHours[result[index]._id] = result[index].count
		}

		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(allHours)
	} catch (error) {
		console.log(`error while searching by Hashtag ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}
