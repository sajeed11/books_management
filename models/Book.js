import autoBind from 'auto-bind'
import db from '../database/db.js'
import BaseModel from './BaseModel.js'

class BookModel extends BaseModel {
  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }


  // async getAll() {
  //   const connection = db.getConnection()

  //   try {
  //     const result = await db.query('SELECT * FROM ?? WHERE author_request_status = "none"', [this.tableName])

  //     return result[0]
  //   } catch (error) {
  //     console.log('Error redaing data:', error)
  //   }
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
