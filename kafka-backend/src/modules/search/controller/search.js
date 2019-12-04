'use strict'

import Tweets from '../../../models/mongoDB/tweets'
import Users from '../../../models/mongoDB/users'
import mongoose from 'mongoose'
import constants from '../../../utils/constants'
import _ from 'lodash'

const responseFormer = (status, message) => {
	return {status: status, message: message}
}

/**
 * Search for tweets with given hashtag.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.hashtagSearch = async (req, res) => {
    try {
        const tweetsByHashtag = await Tweets.find({
            originalBody: {
                $regex: new RegExp('^(.* )?#' + req.params.hashtag + '( .*)?$', "i")
            } , isActive : true
        })
            .sort({ _id: -1 })
            .skip(parseInt(req.query.start))
            .limit(parseInt(req.query.count))
        return responseFormer(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS, tweetsByHashtag)
    } catch (error) {
        console.log(`Error while creating user ${error}`)
        return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message)
    }
}

/**
 * Fetch user profile details based on userid and increase the view count of it.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.fetchProfile = async (req, res) => {
    try {
        let details = await Users.findOne({ _id: mongoose.Types.ObjectId(req.params.userId), isActive: true })
        if (details) {
            let views = details.views,
                today = new Date(),
                dd = String(today.getDate()).padStart(2, '0'),
                mm = String(today.getMonth() + 1).padStart(2, '0'),
                yyyy = today.getFullYear()
            today = mm + '/' + dd + '/' + yyyy;
            let viewCountObj = {},
                newDate = false,
                newCount

            if (views.length === 0) {
                viewCountObj.date = today
                viewCountObj.count = 1
                newDate = true
            } else {
                let found = _.find(details.views, ['date', today])
                if (found) {
                    newCount = found.count + 1
                } else {
                    viewCountObj.date = today
                    viewCountObj.count = 1
                    newDate = true
                }
            }

            if (newDate) {
                await Users.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.userId), {
                    $push: {
                        views: viewCountObj
                    }
                })
            } else {
                await Users.updateOne({ _id: mongoose.Types.ObjectId(req.params.userId), 'views.date': today }, {
                    '$set': {
                        'views.$.count': newCount
                    }
                })
            }

            details = await Users.findById(mongoose.Types.ObjectId(req.params.userId))
            details = details.toJSON()
            delete details.password
            return responseFormer(200, details)
        } else {
            return responseFormer(204, null)
        }
    } catch (error) {
        console.log(`Error while fetching user profile details and increasing view count ${error}`)
        return responseFormer(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS, error.message)
    }
}