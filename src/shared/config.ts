export default {
  environment: process.env.ENVIRONMENT,
  dbConnection: process.env.DB_CONNECTION,
  passwordSalt: +process.env.SALT_LENGTH,
  secretKey: process.env.SECRET_KEY,
  tokenExpiry: +process.env.TOKEN_EXPIRY
}