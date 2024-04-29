import autoBind from 'auto-bind'
import db from '../database/db.js'
import BaseModel from './BaseModel.js'

class BookModel extends BaseModel {
  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }


  // async function getAllBooks() {
  //   const [books] = await db.query('SELECT * FROM books WHERE author_request_status = "none"')

  //   return books
  // }


  // async function createBook(data) {
  //   const [book] = db.query('INSERT INTO books SET ?', [data])

  //   return book
  // }

  async approveBook(id) {
    const [book] = await db.query('UPDATE books SET author_request_status = "approved" WHERE id = ?', [id])

    return book
  }
}

export default BookModel
