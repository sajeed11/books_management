import db from '../database/db.js'

class BookModel {


  static async index() {
    return new Promise((res, rej) => {
      db.query('SELECT * FROM books', (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      })
    })
  }

  static async getAllBooks() {
    return new Promise((res, rej) => {
      db.query('SELECT * FROM users WHERE author_request_status = "none" ', (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      })
    })
  }

  static async getBookById(id) {
    return new Promise((res, rej) => {
      db.query('SELECT * FROM books WHERE id = ?', [id], (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      })
    })
  }

  static async createBook(data) {
    return new Promise((res, rej) => {
      db.query('INSERT INTO books SET ?', [data], (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      })
    })
  }

  static async approveBook(id) {
    return new Promise((res, rej) => {
      db.query('UPDATE books SET author_request_status = "none" WHERE id = ?', [id], (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      })
    })
  }
}

export default BookModel;