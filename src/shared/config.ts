export default {
  environment: process.env.ENVIRONMENT,
  dbConnection: process.env.DB_CONNECTION,
  passwordSalt: +process.env.SALT_LENGTH
}