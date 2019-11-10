'use strict'

import Lists from '../../../models/mongoDB/lists'
import constants from '../../../utils/constants'
import mongoose from 'mongoose'

/**
 * Create list and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.createList = async (req, res) => {
	let createdList,
		filter = {
			ownerId: req.body.ownerId,
			listName: req.body.listName
		}
	try {
		const list = await Lists.findOne(filter)
		if (list) {
			return res.status(constants.STATUS_CODE.CONFLICT_ERROR_STATUS).send(constants.MESSAGES.LIST_ALREADY_EXISTS)
		}
		for (let i = 0; i < req.body.membersId.length; i++) {
			if (req.body.membersId[i].memberId === filter.ownerId) {
				return res.status(constants.STATUS_CODE.UNPROCESSABLE_ENTITY_STATUS).send(constants.MESSAGES.USER_CANNOT_BE_A_MEMBER_IN_LIST)
			}
		}
		let listObj = req.body
		listObj['noOfMembers'] = req.body.membersId.length
		let newList = new Lists(listObj)
		createdList = await newList.save()
		createdList = createdList.toJSON()
		return res.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS).send(createdList)
	} catch (error) {
		console.log(`Error while creating list ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	}
}

/**
 * Get all the lists created by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getOwnedList = async (req, res) => {
	try {
		let listArr = await Lists.find({ ownerId: mongoose.Types.ObjectId(req.params.userId) })
		if (listArr) {
			return res.status(200).send(listArr)
		} else {
			return res.status(204).send([])
		}
	} catch (error) {
		console.log(`Error while getting user owned lists ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	}
}

/**
 * Get all the lists created by the logged in user.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.getAllList = async (req, res) => {
	try {
		let listArr = await Lists.find({ ownerId: { $ne: mongoose.Types.ObjectId(req.params.userId) } })
		if (listArr) {
			return res.status(200).send(listArr)
		} else {
			return res.status(204).send([])
		}
	} catch (error) {
		console.log(`Error while getting other users' lists ${error}`)
		return res.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS).send(error.message)
	}
}