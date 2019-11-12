`use strict`

import Sequelize from 'sequelize'

module.exports = function (sequelize, DataTypes) {
	const Like = sequelize.define('likes', {
		tweetId: {
			type: Sequelize.STRING,
            required: true,
		},userId: {
			type: Sequelize.STRING,
            required: true,
		}
	})

	// force: true will drop the table if it already exists
	Like.sync({
		force: false
	}).then(() => {
        // Table created
		return true
    })
	return Like
} 