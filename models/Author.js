import db from '../database/db.js'

class AuthorModel {

  static async index() {
    return new Promise((res, rej) => {
      db.query('SELECT * FROM authors', (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      })
    })
  }
}
export default AuthorModel;