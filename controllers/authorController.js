import autoBind from "auto-bind";
import AuthorModel from "../models/Author.js";
import BaseController from "./baseController.js";

class AuthorController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }


  async deleteAuthor(req, res) {
    
  }
}
const authorModel = new AuthorModel('authors')

export default new AuthorController(authorModel)