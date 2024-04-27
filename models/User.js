import db from '../database/db.js'
import bcrypt from 'bcrypt'

class UserModel {
  // User structure
  constructor(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.role = user.role;
  }

  // Get all users
  static async index() {
    return new Promise((res, rej) => {
      db.query('SELECT * FROM users', (err, result) => {
        if (!err) {
          res(result)
        }
      })
    })
  }

  // auth
  static async registerUser(data) {
    return new Promise((res, rej) => {
      db.query('INSERT INTO users SET ?', data, (err, result) => {
        if (!err) {
          res(result)
        }
      })
    })
  }

  static async loginUser(data) {
    const user = await new Promise((res, rej) =>
      db.query('SELECT * from users WHERE email = ?', [data.email], (err, result) => {
        if (!err) {
          res(result)
        }
      }))

    if (user.length > 0) {
      const auth = await bcrypt.compare(data.password, user[0].password)
      if (auth) {
        return user
      }
    }
  }
}

export default UserModel;