`use strict`

import bcrypt from 'bcryptjs'
import config from '../../config'
import jwt from 'jsonwebtoken'
import Sequelize from 'sequelize'

module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('users', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		type: {
			type: Sequelize.ENUM,
			values: ['buyer', 'owner'],
			required: true
		},
		name: {
			type: Sequelize.STRING,
			required: true
		},
		email: {
			type: Sequelize.STRING,
			required: true,
			unique: true
		},
		password: {
			type: Sequelize.STRING,
			required: true
		},
		restaurantName: {
			type: Sequelize.STRING,
		},
		restaurantZipcode: {
			type: Sequelize.STRING,
		},
		profileImage: {
			type: Sequelize.STRING,
		},
		contactNumber: {
			type: Sequelize.INTEGER
		}
	}, {
		// set timestamp true to add attributes (updatedAt, createdAt) to the database
		timestamps: true,
		hooks: {
			beforeSave: (user, options) => {
				try {
					if (!user.changed('password')) {
						return Sequelize.Promise.reject('not modified')
					}
					let salt = bcrypt.genSaltSync(10)
					var hash = bcrypt.hashSync(user.password, salt)
					user.setDataValue('password', hash)
				} catch (error) {
					return Sequelize.Promise.reject(error)
				}
			},
			beforeUpdate: (user, options) => {
				try {
					if (user.changed('password')) {
						return Sequelize.Promise.reject('not modified')
					}
					let salt = bcrypt.genSaltSync(10)
					var hash = bcrypt.hashSync(user.password, salt)
					user.setDataValue('password', hash)
				} catch (error) {
					return Sequelize.Promise.reject(error)
				}
			}
		}
	})

	// force: true will drop the table if it already exists
	User.sync({
		force: false
	}).then(() => {
		// Table created
		return true
	})
	return User
}
