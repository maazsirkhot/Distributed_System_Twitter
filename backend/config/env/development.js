`use strict`

module.exports = {
	session: process.env.SESSION || 'secret-token',
	token: process.env.TOKEN || 'secret-jwt-token',
	database: {
		mongoDbUrl: process.env.MONGODB_URL || 'mongodb+srv://admin:admin@cluster0-fgxv7.mongodb.net/twitter?retryWrites=true&w=majority',
		name: process.env.DATABASE || 'twitter',
		user: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || 'twitter273',
		host: process.env.DB_HOST || 'twitter.cwotr7vrym6h.us-west-1.rds.amazonaws.com',
		port: process.env.DB_DBPORT || '3306',
		dialect: process.env.DB_DIALECT || 'mysql'
	}
}
