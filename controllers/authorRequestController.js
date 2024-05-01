import autoBind from "auto-bind";
import BaseController from "./baseController.js";
import AuthorRequestModel from "../models/AuthorRequest.js";


class AuthorRequestController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }
}

const authorRequestModel = new AuthorRequestModel('author_requests')

export default new AuthorRequestController(authorRequestModel)