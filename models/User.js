import db from '../database/db.js'

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
}

export default UserModel;