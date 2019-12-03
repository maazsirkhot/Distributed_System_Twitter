`use strict`

import Sequelize from 'sequelize'

module.exports = function (sequelize) {
	const Follow = sequelize.define('follows', {
		userId: {
			type: Sequelize.STRING,
            required: true,
		},followerId: {
			type: Sequelize.STRING,
            required: true,
		}
	})

	// force: true will drop the table if it already exists
	Follow.sync({
		force: false
	}).then(() => {
        // Table created
		return true
    })
	return Follow
} 