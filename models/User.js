import autoBind from 'auto-bind'
import bcrypt from 'bcrypt'
import BaseModel from './BaseModel.js'

class UserModel extends BaseModel {

  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }

  // auth
  async registerUser(userData, authorData) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        const userResult = await connection.query('INSERT INTO ?? SET ?', [this.tableName, userData])
        const userId = userResult[0].insertId

        // console.log(userId)

        if (userData.role === 'author') {
          await connection.query('INSERT INTO authors (user_id, name, biography) VALUES (?, ?, ?)', [userId, authorData.name, authorData.biography]);
        }

        await connection.commit()
        return { userId, username: userData.username, email: userData.email, role: userData.role }
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

  async loginUser(data) {
    const connection = await this.getConnection()

    try {
      const [user] = await connection.query('SELECT * FROM ?? WHERE email = ?', [this.tableName, data.email])

      if (user.length > 0) {
        const auth = await bcrypt.compare(data.password, user[0].password)
        if (auth) {
          const res_data = {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role
          }

          console.log(res_data)
          return res_data
        } else {
          throw new Error('Incorrect password')
        }
      }
    } catch (error) {
      throw error
    } finally {
      connection.release()
    }
  }
}

export default UserModel