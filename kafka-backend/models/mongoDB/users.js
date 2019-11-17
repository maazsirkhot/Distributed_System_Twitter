`use strict`

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
require('mongoose-type-email');

const Users = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
		required: true,
	},
	userName: {
		type: String,
		maxlength: 15,
		required: true,
	},
	city: {
		type: String,
		maxlength: 30,
	},
	state: String,
	zipcode: {
		type: Number,
	},
	imageURL: String,
	description: {
		type: String,
		maxlength: 160,
	},
	password: {
		type: String,
		minlength: 8,
		required: true,
	},
	isActive: {
		type : Boolean,
		default : true,
	},
	bookmarks: [mongoose.Schema.Types.ObjectId],
	views: [{
		date: {
			type: String,
		},
		count: {
			type: Number,
			default: 0,
		}
	}],
	JWTtoken: String,
	phone: {
		type: Number,
		min: 1000000000,
		max: 9999999999,
	},
	email: mongoose.SchemaTypes.Email,
	dateOfBirth: {
		type: String,
		required: true,
	}
}, { versionKey: false })

Users.pre('save', function preSave(next) {
	try {
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
