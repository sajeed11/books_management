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

  async interactAuthorRequest(id, data, requestType) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        await connection.query('UPDATE author_requests SET status = ? WHERE id = ?', [data.status, id])

        // Make action based on the status and the request type
        if (data.status === 'approved') {
          if (requestType === 'delete') {
            await connection.query('DELETE from books WHERE id = ?', data.book_id)

            // Archiving the deleted book
            const [book] = await connection.query('SELECT * FROM books WHERE id = ?', data.book_id)
            await connection.query('INSERT INTO archived_books SET title = ?, author_id = ?, isbn = ?, picture = ?, stock_quantity = ?, price = ?, genre_id = ?, publication_date = ?', [book.title, book.author_id, book.isbn, book.picture, book.stock_quantity, book.price, book.genre_id, book.publication_date])
          } else {
            await connection.query('UPDATE books SET author_request_status = none WHERE id = ?', data.book_id)
          }
        }

        await connection.commit()
        return { id, ...data }
      }
      catch (error) {
        await connection.rollback()
        // console.error('Error approving author request:', error);
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      // console.error('Error approving author request:', error);
      throw error
    }
  }

  // async interactWithAuthorDelete(id, data) {
  //   const connection = await this.getConnection()

  //   try {
  //     await connection.beginTransaction()

  //     try {
  //       await connection.query('DELETE FROM author_requests WHERE id = ?', id)
  //       await connection.query('DELETE FROM books WHERE id = ?', data.book_id)

  //       await connection.commit()
  //       return { id, ...data }
  //     }
  //     catch (error) {
  //       await connection.rollback()
  //       console.error('Error approving author request:', error);
  //       throw error
  //     } finally {
  //       connection.release()
  //     }
  //   } catch (error) {
  //     console.error('Error approving author request:', error);
  //     throw error
  //   }
  // }
}

export default AuthorRequestModel