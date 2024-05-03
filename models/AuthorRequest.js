import autoBind from 'auto-bind'
import BaseModel from "./BaseModel.js";


class AuthorRequestModel extends BaseModel {
  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }

  async read(id) {
    const connection = await this.getConnection()

    try {
      const result = await connection.query('SELECT * from author_requests WHERE author_id = ?', [id])

      if (result[0].length === 0) {
        return null
      } else return result[0]
    } catch (error) {
      console.error('Error in fetching data:', error)
      throw error // Re-throw for handling in the controller
    } finally {
      connection.release()
    }
  }

  async approveAuthorRequest(id, data) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        await connection.query('UPDATE author_requests SET status = "approved" WHERE id = ?', [data.status, id])
        await connection.query('UPDATE books SET author_request_status = "none" WHERE id = ?', [data.book_id])

        await connection.commit()
        return { id, ...data }
      }
      catch (error) {
        await connection.rollback()
        console.error('Error approving author request:', error);
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('Error approving author request:', error);
      throw error
    }
  }
}

export default AuthorRequestModel