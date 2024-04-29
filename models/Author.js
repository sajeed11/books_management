import db from '../database/db.js'
import BaseModel from './BaseModel.js'

class AuthorModel extends BaseModel {

  constructor() {
    super('authors')
  }
}

// async function addAuthor(data) {
//   const [author] = db.query('INSERT INTO authors SET ?', [data])

//   return author
// }

// async function deleteAuthor(id) {
//   const [author] = db.query('DELETE FROM authors WHERE id = ?', [id])

//   return author
// }

export default AuthorModel
