import db from '../database/db.js'
import autoBind from 'auto-bind'
import bcrypt from 'bcrypt'
import BaseModel from './BaseModel.js'

class UserModel extends BaseModel {

  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }


  async getConnection() {
    return await db.getConnection();
  }

  // auth
  static async registerUser(userData, authorData) {
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      try {
        const userResult = await connection.query('INSERT INTO users SET ?', [userData])
        const userId = userResult[0].insertId

        // console.log(userId)

        if (userData.role === 'author') {
          await connection.query('INSERT INTO authors (user_id, name, biography) VALUES (?, ?, ?)', [userId, authorData.name, authorData.biography]);
        }

        await connection.commit()
        return true
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('Error creating data:', error);
      throw error; // Re-throw for handling in the controller
    }
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