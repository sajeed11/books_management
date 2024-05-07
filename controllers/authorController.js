import autoBind from "auto-bind";
import AuthorModel from "../models/Author.js";
import BaseController from "./baseController.js";
import { ByIdRequest } from "../requests/requests.js";
import httpStatus from "http-status";
import { clientErrorResponse, notFoundResponse, serverErrorResponse } from "../helpers/handleErrorResponse.js";
import { okResponse } from "../helpers/handleOkResponse.js";

class AuthorController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }


  async deleteAuthor(req, res) {
    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    try {
      const author = await this.model.readById(req.params.id)
      if (!author) {
        return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())
      }
      await this.model.deleteAuthor(req.params.id)
      return res.status(httpStatus.OK).json(okResponse('Author deleted successfully'))
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }
}
const authorModel = new AuthorModel('authors')

export default new AuthorController(authorModel)