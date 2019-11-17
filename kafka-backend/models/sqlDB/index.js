`use strict`

let fs = require('fs')
let path = require('path')
let Sequelize = require('sequelize')

let config = {};
config.database = {
	mongoDbUrl: process.env.MONGODB_URL || 'mongodb+srv://admin:admin@cluster0-fgxv7.mongodb.net/twitter?retryWrites=true&w=majority',
	name: process.env.DATABASE || 'twitter',
	user: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || 'twitter273',
	host: process.env.DB_HOST || 'twitter.cwotr7vrym6h.us-west-1.rds.amazonaws.com',
	port: process.env.DB_DBPORT || '3306',
	dialect: process.env.DB_DIALECT || 'mysql'
}

var sequelize = new Sequelize(config.database.name, config.database.user, config.database.password, {
	host: config.database.host,
	port: config.database.port,
	dialect: config.database.dialect,

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
})

sequelize
	.authenticate()
	.then(() => {
		console.log('MySQL Connected')
	})
	.catch(err => {
		console.error('Unable to connect to the mysql database:', err)
	})

var db = {}

fs.readdirSync(__dirname)
	.filter(function (file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js')
	})
	.forEach(function (file) {
		var model = sequelize.import(path.join(__dirname, file))
		db[model.name] = model
	})

Object.keys(db).forEach(function (modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db)
	}
})

db.sequelize = sequelize

module.exports = db