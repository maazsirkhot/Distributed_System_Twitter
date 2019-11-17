`use strict`

import Sequelize from 'sequelize'

module.exports = function (sequelize, DataTypes) {
	const Bookmark = sequelize.define('bookmarks', {
		tweetId: {
			type: Sequelize.STRING,
            required: true,
		},userId: {
			type: Sequelize.STRING,
            required: true,
		}
	})

	// force: true will drop the table if it already exists
	Bookmark.sync({
		force: false
	}).then(() => {
        // Table created
		return true
    })
	return Bookmark
} 