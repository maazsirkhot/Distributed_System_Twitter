`use strict`

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import config from '../../../config'
import jwt from 'jsonwebtoken'

const Users = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	username: {
		type: String,
		maxlength: 15
	},
	city: {
		type: String,
		maxlength: 30
	},
	state: String,
	zipcode: {
		type: Number,
	},
	imageURL: String,
	description: {
		type: String,
		maxlength: 160
	},
	password: {
		type: String,
		minlength: 8,
	},
	isActive: Boolean,
	bookmarks: [mongoose.Types.ObjectId],
	views: [{
		date: {
			type: Date
		},
		count: {
			type: Number,
			default: 0
		}
	}],
	JWTtoken: String,
	phone: {
		type: Number,
		minLength: 10,
		maxLength: 10
	},
	email: String,
	dateOfBirth: String
})

Users.pre('save', function preSave(next) {
	try {
		console.log('preee')
		const user = this
		if (!user.isModified('password')) {
			return next()
		}
		let salt = bcrypt.genSaltSync(10)
		var hash = bcrypt.hashSync(user.password, salt)
		user.password = hash
		next(null)
	} catch (error) {
		next(error)
	}
})

Users.methods.validatePassword = function validatePassword(password) {
	const user = this
	return new Promise((resolve, reject) => {
		try {
			let isMatch = bcrypt.compareSync(password, user.password)
			resolve(isMatch)
		} catch (error) {
			resolve(false)
		}
	})
}

Users.methods.generateToken = function generateToken() {
	const user = this

	return jwt.sign({
		id: user._id
	}, config.token)
}

export default mongoose.model('users', Users)
