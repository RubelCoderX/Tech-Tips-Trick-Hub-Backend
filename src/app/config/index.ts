import dotenv from 'dotenv'
dotenv.config()
export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  node_dev: process.env.NODE_ENV,
  bcrypt_salt_number: process.env.BCRYPT_SALT_NUMBER,
}
