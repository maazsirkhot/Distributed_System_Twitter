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
import kafka from '../../../../kafka/client'

/**
 * Create user and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createUser = async (r, res) => {

	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('users', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

/**
 * Login user and send auth token and user details in response.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.loginUser = async (r, res) => {
	
	console.log('--------------', r.route.path, '-----------------');

	let req = {};
	req.body = r.body;
	req.path = r.route.path;

	kafka.make_request('users', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

/**
 * Get user profile details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getUserProfile = async (r, res) => {
	console.log('--------------', r.route.path, '-----------------');
	
	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('users', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

/**
 * Update user details based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.updateUserProfile = async (r, res) => {
	console.log('--------------', r.route.path, '-----------------');
	
	let req = {};
	req.body = r.body;
	req.file = r.file;
	req.path = r.route.path;

	kafka.make_request('users', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
}

/**
 * Deactive user based on userid.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.deactivateUserProfile = async (req, res) => {
	console.log('--------------', r.route.path, '-----------------');
	let req = {};
	req.params = r.params;
	req.path = r.route.path;

	kafka.make_request('users', req, function(err, results){
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            });
        }else{
            console.log("Inside else");
			return res
				.status(results.status)
				.send(results.message)
        }
    });
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
		let index,
			allUsers = [],
			followerId,
			userData
		for(index in result.rows) {
			followerId = result.rows[index].followerId
			userData = await Users.findOne(
				{
					_id: mongoose.Types.ObjectId(followerId),
					isActive: true
				},
				{
					_id: 1,
					name: 1,
					userName: 1,
					imageURL: 1
				})
			if(userData) {
				allUsers.push(userData)
			}
		}
		let response = {
			count: allUsers.length,
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
		let index,
			allUsers = [],
			followerId,
			userData
		for(index in result.rows) {
			followerId = result.rows[index].userId
			userData = await Users.findOne(
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
			if(userData) {
				allUsers.push(userData)
			}
		}
		let response = {
			count: allUsers.length,
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

exports.validate = async (req, res) => {
	return res.status(200).json()
}