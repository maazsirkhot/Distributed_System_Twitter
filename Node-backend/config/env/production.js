
module.exports = {
  session: process.env.SESSION,
  token: process.env.TOKEN,
  database: {
    mongoDbUrl: process.env.MONGODB_URL,
    name: process.env.DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_DBPORT,
    dialect: process.env.DB_DIALECT,
  },
};
