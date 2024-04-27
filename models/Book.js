import db from '../database/db.js'

class BookModel {


  static async getAllBooks() {
    return new Promise((res, rej) => {
      db.query('SELECT * FROM books', (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      })
    })
  }
}

export default BookModel;