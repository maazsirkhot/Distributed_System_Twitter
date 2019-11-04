`use strict`

import Joi from 'joi'
import constants from '../../utils/constants'

module.exports = {
	signup: {
		body: {
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
		},
		model: "createUser",
		group: "User",
		description: "Create user and save details in database"
	},
	login: {
		body: {
			email: Joi.string().email().required(),
			password: Joi.string().required()
		},
		model: "loginUser",
		group: "User",
		description: "Login user and send auth token and user details in response"
	},
	getProfile: {
		path: {
			userId: Joi.number().required()
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'getUserDetails',
		group: "User",
		description: "Get user profile details based on userid"
	}
}