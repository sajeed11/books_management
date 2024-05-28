import autoBind from "auto-bind";
import httpStatus from "http-status";
import BaseController from "./baseController.js";
import AuthorRequestModel from "../models/AuthorRequest.js";
import { ApprovingRequestID, ApprovingRequestData, ByIdRequest } from "../requests/requests.js";
import { clientErrorResponse, notFoundResponse, serverErrorResponse } from "../helpers/handleErrorResponse.js";
import { okResponse } from "../helpers/handleOkResponse.js";

class AuthorRequestController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }

  async read(req, res) {
    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    const id = req.params.id

    try {
      const result = await authorRequestModel.read(id)

      if (result.length === 0) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

      return res.status(httpStatus.OK).json(okResponse(result))
    } catch (error) {
      console.error('Error fetching your requests', error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  async intractWithAuthorRequest(req, res) {
    // Validate request
    const testedData = { ...req.body, ...req.params }
    const { error } = ApprovingRequestData().validate(testedData)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    const id = req.params.id
    const data = req.body

    try {
      const authorRequest = await this.model.readById(id)

      if (!authorRequest) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())


      try {
        // const result = await this.model.approveAuthorRequest(id, data)
        let result = {}

        const requestType = authorRequest[0].request_type

        result = await this.model.interactAuthorRequest(id, data, requestType)

        return res.status(httpStatus.OK).json(okResponse(result))
      } catch (error) {
        console.error('Error approving author request:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
      }
    } catch (error) {
      // console.error('Error approving author request:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }
}

const authorRequestModel = new AuthorRequestModel('author_requests')

export default new AuthorRequestController(authorRequestModel)