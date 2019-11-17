'use strict'

import Users from '../../../models/mongoDB/users'
import constants from '../../../utils/constants'
import mongoose from 'mongoose'
import uuidv1 from 'uuid/v1'
import model from '../../../models/sqlDB/index'

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
        req.body.name.slice(0, nameLength) + uuidv1().slice(0, 15 - nameLength)
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
        await Users.findByIdAndUpdate(user._id, {jwtToken: user.token});
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

    let details = await Users.findByIdAndUpdate(
      mongoose.Types.ObjectId(req.body.userId),
      {
        $set: userObj
      },
      null,
      null
    )
    if (details) {
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
    await Users.findByIdAndUpdate(req.body.userId, {
      $push: {
        bookmarks: req.body.tweetId
      }
    })
    return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).json()
  } catch (error) {
    console.log(`Error while creating user ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}

exports.followUser = async (req, res) => {
  try {
    let result = await model.follows.findAndCountAll({
      where: {
        userId: req.body.userId,
        followerId: req.body.followerId
      }
    })

    if (result.count != 0) {
      console.log('followerid is already following the userid')
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
      const numAffectedRows = await model.follows.destroy({
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
    return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(result)
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
    return res.status(constants.STATUS_CODE.SUCCESS_STATUS).json(result)
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
    },{
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
  } catch(error) {
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
    },{
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
  } catch(error) {
    console.log(`error while searching by User name ${error}`)
    return res
      .status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
      .send(error.message)
  }
}
