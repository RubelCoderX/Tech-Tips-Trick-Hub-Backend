import dotenv from 'dotenv'
dotenv.config()
export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  node_dev: process.env.NODE_ENV,
  bcrypt_salt_number: process.env.BCRYPT_SALT_NUMBER,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  client_url: process.env.CLIENT_URL,
}
