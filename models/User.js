import db from '../database/db.js'
import bcrypt from 'bcrypt'
import BaseModel from './BaseModel.js'

class UserModel extends BaseModel {

  constructor() {
    super('users')
  }

  // auth
  static async registerUser(data) {
    const user = await db.query('INSERT INTO users SET ?', [data])

    return user
  }

  static async loginUser(data) {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [data.email])

    if (user.length > 0) {
      const auth = await bcrypt.compare(data.password, user[0].password)
      if (auth) {
        return user
      } else {
        throw new Error('Incorrect password')
      }
    }
    throw new Error('Email does not exist')
  }
}

export default UserModel