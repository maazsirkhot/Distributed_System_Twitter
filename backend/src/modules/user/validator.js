`use strict`

import Joi from 'joi'

module.exports = {
	signup: {
		body: {
			name: Joi.string().required(),
			email: Joi.string().email(),
			phone: Joi.number(),
			dateOfBirth: Joi.string().required(),
			password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
		},
		model: "createUser",
		group: "User",
		description: "Create user and save details in database"
	},
	login: {
		body: {
			loginId: Joi.string().required(),
			password: Joi.string().required()
		},
		model: "loginUser",
		group: "User",
		description: "Login user and send auth token and user details in response"
	},
	getProfile: {
		path: {
			userId: Joi.string().required()
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'getUserDetails',
		group: "User",
		description: "Get user profile details based on userid"
	},
	updateProfile: {
		body: {
			userId: Joi.string(),
			name: Joi.string(),
			userName: Joi.string().max(15),
			city: Joi.string(),
			state: Joi.string(),
			zipcode: Joi.string().regex(/^(?!0{5})(\d{5})(?!-?0{4})(|-\d{4})?$/),
			imageURL: Joi.string(),
			description: Joi.string().max(160),
			password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
			phone: Joi.number(),
			email: Joi.string().email(),
		},
		payload: {
			maxBytes: 209715200,
			output: 'file',
			parse: true
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'updateUserDetails',
		group: "User",
		description: "Update user deatils based on userid"
	},
	deactivateProfile: {
		path: {
			userId: Joi.string().required()
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'deactivateUserDetails',
		group: "User",
		description: "Deactivate user based on userid"
	},
	bookmarkTweet: {
		path: {
			userId: Joi.string().required(),
			tweetId: Joi.string().required()
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'bookmarkTweet',
		group: "User",
		description: "Bookmark a tweet"
	},
	followUser : {
		body: {
			userId: Joi.string().required(),
			followerId: Joi.string().required().not(Joi.ref('userId')),
		},
		header: {
			authorization: Joi.string().required()
		},
		model : 'followUser',
		group: 'User',
		description: 'follow a user'
	},
	unFollowUser : {
		body: {
			userId: Joi.string().required(),
			followerId: Joi.string().required().not(Joi.ref('userId'))
		},
		header: {
			authorization: Joi.string().required()
		},
		model : 'unFollowUser',
		group: 'User',
		description: 'un-follow a user'
	},
	followersOfUserId : {
		params: {
			userId: Joi.string().required()
		},
		model: 'followersUserId',
		group: 'User',
		description: 'get followers based on userid'
	},
	followedByUserId: {
		params: {
			userId: Joi.string().required()
		},
		model: 'followerfollowedByUserIdsUserId',
		group: 'User',
		description: 'get the users followed by userid'
	},
	searchByName: {
		body: {
			keyword: Joi.string().required()
		},
		model: 'SearchByName',
		group: 'User',
		description: 'search by profile name'
	},
	searchByUserName: {
		body: {
			keyword: Joi.string().required().regex(/^@[a-zA-Z]+/)
		},
		model: 'SearchByUserName',
		group: 'User',
		description: 'search by user name'
	},
	findUser: {
		path: {
			userName: Joi.string().required()
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'getUserDetails',
		group: "User",
		description: "Get user profile details based on userid"
	},
	viewCount: {
		path: {
			userId: Joi.string().required()
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'getUserDetails',
		group: "User",
		description: "Get user profile details based on userid"
	},
	logout: {
		header: {
			authorization: Joi.string().required()
		},
		model: 'logout',
		group: "User",
		description: "Logout user and delete the token from database"
	},
	deleteUser: {
		path: {
			userId: Joi.string().required(),
			userName: Joi.string().required()
		},
		header: {
			authorization: Joi.string().required()
		},
		model: 'deleteUserDetails',
		group: "User",
		description: "Delete all user details"
	},
}