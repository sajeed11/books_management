import autoBind from 'auto-bind'
import db from '../database/db.js'
import BaseModel from './BaseModel.js'

class AuthorModel extends BaseModel {

  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }

  async search(searchBody) {
    const connection = await this.getConnection()

    const { name, biography } = searchBody
    let query = `SELECT * FROM authors WHERE 1 = 1`;

    let conditions = []

    if (name) {
      conditions.push(`name LIKE '%${name}%'`);
    }
    if (biography) {
      conditions.push(`biography LIKE '%${biography}%'`);
    }

    // Add WHERE clause with AND logic if multiple conditions exist
    if (conditions.length > 0) {
      query += ` AND (` + conditions.join(' AND ') + ')';
    }

    try {
      const [authors] = await connection.query(query)

      if (!authors.length) {
        return []
      } else return authors[0]
    } catch (error) {
      console.log('Error searching authors:', error)
      throw error
    } finally {
      connection.release()
    }
  }

  async deleteAuthor(id) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        await connection.query('DELETE FROM authors WHERE id = ?', [id])

        await connection.query('DELETE FROM author_requests WHERE author_id = ?', [id])

        const user = await connection.query('SELECT user_id FROM authors WHERE id = ?', [id])
        await connection.query('DELETE FROM users WHERE id = ?', [user[0][0].user_id])

        await connection.query('DELETE FROM books WHERE author_id = ?', [id])

        // He will dispear literally XD
        await connection.commit()

        return true
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('Error deleting author:', error)
      throw error
    }
  }
}

export default AuthorModel
