import autoBind from 'auto-bind'
import BaseModel from './BaseModel.js'

class BookModel extends BaseModel {
  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }

  async createBook(data, role) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        const book = await connection.query('INSERT INTO books SET ?', data)
        const bookId = book[0].insertId

        if (role != 'admin') {
          const request_data = {
            book_id: bookId,
            author_id: data.author_id,
            request_type: 'create',
            status: 'pending'
          }

          await connection.query('INSERT INTO author_requests SET ?', request_data)
        }

        await connection.commit()

        const res_data = {
          id: bookId,
          ...data,
          author_request_status: 'pending'
        }

        return res_data
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.log('Error creating book:', error)
      throw error
    }
  }

  async updateBook(id, data) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        let query = 'UPDATE books SET'
        let params = []
        let set = []

        for (const key in data) {
          set.push(`${key} = ?`)
          params.push(data[key])
        }

        query += ` ${set.join(', ')} WHERE id = ?`

        params.push(id)

        await connection.query(query, params)

        const request_data = {
          book_id: id,
          author_id: data.author_id,
          request_type: 'update',
          status: 'pending'
        }

        await connection.query('INSERT INTO author_requests SET ?', request_data)

        await connection.commit()

        const res_data = {
          id: id,
          ...data,
          author_request_status: 'pending'
        }

        return res_data
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.log('Error updating book:', error)
      throw error
    }
  }

  async approveBook(id) {
    const connection = await this.getConnection()

    try {
      const [book] = await connection.query('UPDATE books SET author_request_status = "approved" WHERE id = ?', [id])

      return book
    } catch (error) {
      console.log('Error approving book:', error)
      throw error
    } finally {
      connection.release()
    }
  }

  async deleteBook(id, author_id) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        await connection.query('UPDATE books SET author_request_status = "pending" WHERE id = ?', id)

        const request_data = {
          book_id: id,
          author_id: author_id,
          request_type: 'delete',
          status: 'pending'
        }

        await connection.query('INSERT INTO author_requests SET ?', request_data)

        await connection.commit()

        const res_data = {
          id: id,
          author_request_status: 'pending'
        }

        return res_data
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.log('Error deleting book:', error)
      throw error
    }
  }

  async search(searchBody) {
    const connection = await this.getConnection()

    const { title, author_name, genre_name, publication_date, price, isbn } = searchBody
    let query = `SELECT b.*, a.name AS author_name, g.name AS genre_name
                  FROM books b
                  LEFT JOIN authors a ON b.author_id = a.id
                  LEFT JOIN genres g ON b.genre_id = g.id
                  WHERE 1 = 1`;

    let conditions = ['b.author_request_status = "none"']

    if (title) {
      conditions.push(`b.title LIKE '%${title}%'`);
    }
    if (isbn) {
      conditions.push(`b.isbn = '${isbn}'`);
    }
    if (author_name) {
      conditions.push(`a.name LIKE '%${author_name}%'`);
    }
    if (genre_name) {
      conditions.push(`g.name LIKE '%${genre_name}%'`);
    }
    if (publication_date) {
      conditions.push(`b.publication_date = ?`);
    }
    if (price) {
      conditions.push(`b.price = ${price}`);
    }

    // Add WHERE clause with AND logic if multiple conditions exist
    if (conditions.length > 0) {
      query += ` AND (` + conditions.join(' AND ') + ')';
    }

    try {
      const results = await connection.query(query, publication_date ? [publication_date] : []);

      if (!results[0].length) {
        return null
      } else return results[0]
    } catch (error) {
      console.error('Error searching books:', error);
      throw error; // Re-throw for controller to handle
    }
  }

}

export default BookModel
