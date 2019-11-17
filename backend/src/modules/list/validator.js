`use strict`

import Joi from 'joi'

module.exports = {
	createList: {
		body: {
			ownerId: Joi.string().required(),
			listName: Joi.string().required(),
			membersId: Joi.array().required()
		},
		model: "createList",
		group: "List",
		description: "Create list for a user with list name and members in it"
	},
	getOwnedList: {
		params: {
			userId: Joi.string().required()
		},
		model: "getOwnedList",
		group: "List",
		description: "Get all the list created by user"
	},
	getAllList: {
		params: {
			userId: Joi.string().required()
		},
		model: "getAllList",
		group: "List",
		description: "Get all the list created by other users"
	},
	subscribeList: {
		body: {
			listId: Joi.string().required(),
			listName: Joi.string().required(),
			subscriberId: Joi.string().required(),
			subscriberName: Joi.string().required()		},
		model: "subscribeList",
		group: "List",
		description: "Subscribe a user to a list of another user's list"
	},
	getSubscribedList: {
		params: {
			userId: Joi.string().required()
		},
		model: "getAllList",
		group: "List",
		description: "Get all the list subscribed by user"
	}
}