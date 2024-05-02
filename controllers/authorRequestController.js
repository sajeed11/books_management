import autoBind from "auto-bind";
import httpStatus from "http-status";
import BaseController from "./baseController.js";
import AuthorRequestModel from "../models/AuthorRequest.js";
import { ApprovingRequestID, ApprovingRequestData } from "../requests/requestAuthorRequest.js";


class AuthorRequestController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }

  async apprveAuthorRequest(req, res) {
    // Validate request
    const testedData = { ...req.body, ...req.params }
    const { error } = ApprovingRequestData().validate(testedData)

    if (error) {
      return res.status(httpStatus.BAD_REQUEST)
        .json({
          success: false,
          error: {
            message: error.details[0].message,
            type: error.details[0].type,
            context: error.details[0].context
          }
        });
    }

    const id = req.params.id
    const data = req.body

    try {
      const authorRequest = await this.model.readById(id)
      console.log(authorRequest)
      if (!authorRequest) {
        return res.status(httpStatus.NOT_FOUND)
          .json({
            success: false,
            message: 'Author request not found'
          })
      }
    } catch (error) {
      console.error('Error approving author request:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }

    try {
      const result = await this.model.approveAuthorRequest(id, data)
      return res.status(httpStatus.OK)
        .json(
          {
            success: true,
            message: 'Author request approved',
            data: result
          }
        )
    } catch (error) {
      console.error('Error approving author request:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

const authorRequestModel = new AuthorRequestModel('author_requests')

export default new AuthorRequestController(authorRequestModel)