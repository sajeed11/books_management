import autoBind from 'auto-bind'
import BaseModel from './BaseModel.js'

class BookModel extends BaseModel {
  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
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
