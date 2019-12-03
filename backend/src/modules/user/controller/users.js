'use strict'

import Users from '../../../models/mongoDB/users'
import Tweet from '../../../models/mongoDB/tweets'
import List from '../../../models/mongoDB/lists'
import Messages from '../../../models/mongoDB/messages'
import constants from '../../../utils/constants'
import mongoose from 'mongoose'
import uuidv1 from 'uuid/v1'
import model from '../../../models/sqlDB/index'
import client from '../../../models/redisClient/redis'
import { updatePassword } from '../../../utils/updateHashPassword'

/**
 * Create user and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createUser = async (req, res) => {
	let createdUser

	let filter = {}
	try {
		if (req.body.email) {
			filter.email = req.body.email
		} else {
			filter.phone = req.body.phone
		}
		const user = await Users.findOne(filter)
		if (user) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(constants.MESSAGES.USER_ALREADY_EXISTS)
		}

		let userObj = req.body

		let nameLength = req.body.name.length > 5 ? 5 : req.body.name.length

		let userName

		let userData = true

		filter = {}
		while (userData) {
			userName =
				req.body.name.replace(" ","").slice(0, nameLength) + uuidv1().slice(0, 15 - nameLength)
			filter.userName = userName
			userData = await Users.findOne(filter)
		}
		userObj['userName'] = userName
		let newUser = new Users(userObj)
		createdUser = await newUser.save()
		createdUser = createdUser.toJSON()
		delete createdUser.password
		return res
			.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
			.send(createdUser)
	} catch (error) {
		console.log(`Error while creating user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Login user and send auth token and user details in response.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.loginUser = async (req, res) => {
	try {
		var user

		var isAuth = false
		if (isNaN(req.body.loginId)) {
			user = await Users.findOne({
				$or: [
					{
						email: req.body.loginId
					},
					{
						userName: req.body.loginId
					}
				]
			})
		} else {
			user = await Users.findOne({
				$or: [
					{
						phone: req.body.loginId
					}
				]
			})
		}

		if (user) {
			const validate = await user.validatePassword(req.body.password)
			if (validate) {
				const token = user.generateToken()
				user = user.toJSON()
				delete user.password
				user.token = token
				let tokenObj = {
					token : token,
					date: Date.now()
				}
				if (user.jwtToken.length === 4) {
					await Users.findByIdAndUpdate(user._id, { $pop: { jwtToken: -1 } });
				}
				await Users.findByIdAndUpdate(user._id, {
					$push: {
						jwtToken: tokenObj
					}, isActive: true
				});
				await Tweet.updateMany({
					$or: [
						{
							userId: req.params.userId
						},
						{
							originalUserId: req.params.userId
						}
					]
				},{
					isActive: true
				})
				await List.updateMany({
					ownerId: req.params.userId
				},{
					isActive: true
				})
				isAuth = true
				return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(user)
			}
		}
		if (!isAuth) {
			return res
				.status(constants.STATUS_CODE.UNAUTHORIZED_ERROR_STATUS)
				.send(constants.MESSAGES.AUTHORIZATION_FAILED)
		}
	} catch (error) {
		console.log(`Error while logging in user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Get user profile details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getUserProfile = async (req, res) => {
	try {
		var profileDetails;

		profileDetails = await client.hgetall("profiledata_" + req.params.userId, function (err, success) {
			if (err || !success) {
				console.log(err, !success)
				return null;
			}
			else {
				console.log("Success is ", success);
				console.log("From Redis");
				delete success.password
				return success;
			}
		})


		if (profileDetails.length > 0) {
			return res.status(200).send(profileDetails);
		}
		// let fromRedis = await client.hgetall("profiledata_" + req.params.userId)
		// console.log("From Redis ", fromRedis);

		let details = await Users.findById(
			mongoose.Types.ObjectId(req.params.userId)
		)
		if (details) {
			details = details.toJSON()
			delete details.password
			return res.status(200).send(details)
		} else {
			return res.status(204).json()
		}
	} catch (error) {
		console.log(`Error while getting user profile details ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Update user details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateUserProfile = async (req, res) => {
	console.log(req.body)
	try {
		if (req.body.email == undefined && req.body.phone == undefined) {
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send(constants.MESSAGES.USER_VALUES_MISSING)
		}

		let filter = [{ userName: req.body.userName }]
		if (req.body.email) {
			filter.push({ email: req.body.email })
		}
		if (req.body.phone) {
			filter.push({ phone: req.body.phone })
		}
		const user = await Users.findOne({
			_id: {
				$ne: mongoose.Types.ObjectId(req.body.userId)
			},
			$or: filter
		})
		if (user) {
			return res
				.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS)
				.send(constants.MESSAGES.USER_DETAILS_ALREADY_EXISTS)
		}

		let userObj = req.body

		if(req.file){
            userObj.imageURL = req.file.location
            console.log("Image received:", userObj.imageURL)
		}

		// updating password
		if(req.body.password) {
			userObj.password = updatePassword(req.body.password)
		}

		let details = await Users.findByIdAndUpdate(
			mongoose.Types.ObjectId(req.body.userId),
			{
				$set: userObj
			},
			null,
			null
		)
		if (details) {

			client.hmset("profiledata_" + userObj.userId, userObj, function (err, success) {
				if (err) {
					console.log(err)
				}
				else {
					console.log(success);
					return res.status(200).send(userObj)
				}

			})

			if(!req.file) {

				// Update userName in tweet
				await Tweet.updateMany({
					userId: req.body.userId
				},{
					userName: req.body.userName
				})

				// Update original userName in tweet
				await Tweet.updateMany({
					originalUserId: req.body.userId
				},{
					originalUserName: req.body.userName
				})

				// Update userName in comments
				await Tweet.updateMany({
					"comments.userId": mongoose.Types.ObjectId(req.body.userId),
				},{
					"comments.$.userName": req.body.userName,
				})

				// Update owner name in list
				await List.updateMany({
					ownerId: req.body.userId
				},{
					ownerName: req.body.name,
					ownerUserName: req.body.userName
				})

				// Update member name in list
				await List.updateMany({
					'membersId.memberId': req.body.userId
				},{
					"membersId.$.memberName": req.body.userName
				})

				// Update participant name in messages
				await Messages.updateMany({
					'participants.userId': req.body.userId
				},{
					"participants.$.userName": req.body.userName
				})

				// Update sender name in messages
				await Messages.updateMany({
					'body.senderUserName': details.userName
				},{
					"body.$.senderUserName": req.body.userName,
				})
			} else {

				// Update userName in tweet
				await Tweet.updateMany({
					userId: req.body.userId,
				},{
					userName: req.body.userName,
					userImageURL: req.file.location,
				})

				// Update original userName in tweet
				await Tweet.updateMany({
					originalUserId: req.body.userId
				},{
					originalUserName: req.body.userName,
					originalUserImageURL: req.file.location,
				})

				// Update userName in comments
				await Tweet.updateMany({
					"comments.userId": mongoose.Types.ObjectId(req.body.userId),
				},{
					"comments.$.userName": req.body.userName,
					"comments.$.ImageURL": req.file.location,
				})

				// Update owner name in list
				await List.updateMany({
					ownerId: req.body.userId
				},{
					ownerName: req.body.name,
					ownerUserName: req.body.userName,
					ownerImage: req.file.location,
				})

				// Update member name in list
				await List.updateMany({
					'membersId.memberId': req.body.userId
				},{
					"membersId.$.memberName": req.body.userName,
					"membersId.$.memberImageURL": req.file.location,
				})

				// Update participant name in messages
				await Messages.updateMany({
					'participants.userId': req.body.userId
				},{
					"participants.$.userName": req.body.userName,
					"participants.$.imageURL": req.file.location,
				})

				// Update sender name in messages
				await Messages.updateMany({
					'body.senderUserName': details.userName
				},{
					"body.$.senderUserName": req.body.userName,
				})

			}

			return res.status(200).json()
		} else {
			return res.status(204).send('No tweets were posted on this day')
		}
	} catch (error) {
		console.log(`Error while getting user profile details ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Deactive user based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deactivateUserProfile = async (req, res) => {
	try {
		let details = await Users.findByIdAndUpdate(
			mongoose.Types.ObjectId(req.params.userId),
			{
				$set: {
					isActive: false
				}
			},
			null,
			null
		)
		await Tweet.updateMany({
			$or: [
				{
					userId: req.params.userId
				},
				{
					originalUserId: req.params.userId
				}
			]
		},{
			isActive: false
		})
		await List.updateMany({
			ownerId: req.params.userId
		},{
			isActive: false
		})
		if (details) {
			return res.status(200).json()
		} else {
			return res.status(204).json()
		}
	} catch (error) {
		console.log(`Error while getting user profile details ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

/**
 * Bookmark a tweet or retweet and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.bookmarkTweet = async (req, res) => {
	try {
		let bookmarkedTweet = await Users.findById(req.body.userId, {
			bookmarks: 1
		})
		if (bookmarkedTweet.bookmarks.includes(req.body.tweetId)) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS).json()
		} else {
			await Users.findByIdAndUpdate(req.body.userId, {
				$push: {
					bookmarks: req.body.tweetId
				}
			})
			return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).json()
		}
	} catch (error) {
		console.log(`Error while creating user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.followUser = async (req, res) => {
	try {

		await Users.findByIdAndUpdate({
			_id: req.body.userId
		}, {
			$inc: { followersCount: 1 }
		})

		await Users.findByIdAndUpdate({
			_id: req.body.followerId
		}, {
			$inc: { followingCount: 1 }
		})

		let result = await model.follows.findAndCountAll({
			where: {
				userId: req.body.userId,
				followerId: req.body.followerId
			}
		})

		if (result.count != 0) {
			console.log('followerid is already following the userid')

			await Users.findByIdAndUpdate({
				_id: req.body.userId
			}, {
				$inc: { followerCount: -1 }
			})
	
			await Users.findByIdAndUpdate({
				_id: req.body.followerId
			}, {
				$inc: { followingCount: -1 }
			})

			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('followerid is already following the userid')
		} else {
			let followObj = {
				userId: req.body.userId,
				followerId: req.body.followerId
			}
			await model.follows.create(followObj)
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json()
		}
	} catch (error) {
		console.log(`error while adding follower ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.unFollowUser = async (req, res) => {
	try {
		let result = await model.follows.findAndCountAll({
			where: {
				userId: req.body.userId,
				followerId: req.body.followerId
			}
		})

		if (result.count == 0) {
			console.log('followerid is not following the userid')
			return res
				.status(constants.STATUS_CODE.BAD_REQUEST_ERROR_STATUS)
				.send('followerid is not following the userid')
		} else {
			await model.follows.destroy({
				where: {
					userId: req.body.userId,
					followerId: req.body.followerId
				}
			})
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json()
		}
	} catch (error) {
		console.log(`error while removing follower ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.followersOfUserId = async (req, res) => {
	try {
		let result = await model.follows.findAndCountAll({
			where: {
				userId: req.params.userId
			}
		})
		let count = result.count,
			index,
			allUsers = [],
			followerId
		for(index in result.rows) {
			followerId = result.rows[index].followerId
			allUsers.push(await Users.findOne(
				{
					_id: followerId,
					isActive: true
				},
				{
					_id: 1,
					name: 1,
					userName: 1,
					imageURL: 1
				})
			)
		}
		let response = {
			count: count,
			allUsers: allUsers
		}
		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(response)
	} catch (error) {
		console.log(`error while getting  followers of given UserId ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.followedByUserId = async (req, res) => {
	try {
		let result = await model.follows.findAndCountAll({
			where: {
				followerId: req.params.userId
			}
		})
		let count = result.count,
			index,
			allUsers = [],
			followerId
		for(index in result.rows) {
			followerId = result.rows[index].userId
			allUsers.push(await Users.findOne(
				{
					_id: followerId,
					isActive: true
				},
				{
					_id: 1,
					name: 1,
					userName: 1,
					imageURL: 1
				})
			)
		}
		let response = {
			count: count,
			allUsers: allUsers
		}
		return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(response)
	} catch (error) {
		console.log(`error while getting followed by given UserId ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.searchByName = async (req, res) => {
	try {
		let result = await Users.find({
			name: { $regex: req.body.keyword, $options: "i" },
			isActive: true,
		}, {
			_id: 1,
			name: 1,
			userName: 1
		})

		let resultObject = {
			count: result.length,
			data: result
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.json(resultObject)
	} catch (error) {
		console.log(`error while searching by Profile name ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.searchByUserName = async (req, res) => {
	try {
		let result = await Users.find({
			userName: { $regex: req.body.keyword.substring(1), $options: "i" },
			isActive: true,
		}, {
			_id: 1,
			name: 1,
			userName: 1
		})

		let resultObject = {
			count: result.length,
			data: result
		}

		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.json(resultObject)
	} catch (error) {
		console.log(`error while searching by User name ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.findUser = async (req, res) => {
	try {
		let result = await Users.findOne({
			userName: req.params.userName,
			isActive: true,
		}, {
			_id: 1,
			name: 1,
			userName: 1
		})
		if (result) {
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(result)
		} else {
			return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS).json()
		}
	} catch (error) {
		console.log(`error while searching by User name ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.viewCount = async (req, res) => {
	try {
		let index,
			result = await Users.findById(
			req.params.userId
		, {
			views: 1
		})
		let dates = {},
			dd,
			mm,
			yyyy,
			tempDate,
			before,
			today = new Date()
			
		for(index = 29; index >= 0; index--) {
			before = new Date(new Date().setDate(today.getDate() - index))
			dd = String(before.getDate()).padStart(2, '0')
			mm = String(before.getMonth() + 1).padStart(2, '0')
			yyyy = before.getFullYear()
			tempDate = mm + '/' + dd + '/' + yyyy
			dates[tempDate] = 0
		}
		console.log(dates)
		for(index in result.views) {
			let viewDate = result.views[index].date
			if(viewDate in dates) {
				dates[viewDate] = result.views[index].count
			}
		}
		if (result) {
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(dates)
		} else {
			return res.status(constants.STATUS_CODE.NO_CONTENT_STATUS).json()
		}
	} catch (error) {
		console.log(`error while searching by User name ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.logout = async (req, res) => {
	try {
		let user = await Users.findById(
			mongoose.Types.ObjectId(req.userId)
		)
		if (user) {
			await Users.findByIdAndUpdate(req.userId, {
				$pull: {
					jwtToken: { token : req.tokenToDelete}
				}
			});
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json()
		} else {
			return res.status(401).json()
		}
	} catch (error) {
		console.log(`Error while logging out user ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}
