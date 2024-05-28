import httpStatus from "http-status" // For standardized HTTP status codes
import autoBind from 'auto-bind'
import { ByIdRequest } from '../requests/requests.js'
import { searchBookRequestSchema } from "../requests/requests.js"
import { okResponse } from "../helpers/handleOkResponse.js"
import { notFoundResponse, serverErrorResponse } from "../helpers/handleErrorResponse.js"

class BaseController {
  constructor(model) {
    this.model = model
    autoBind(this)
  }

  async create(req, res) {
    try {
      const data = req.body
      const newId = await this.model.create(data)
      return res.status(httpStatus.CREATED).json(okResponse(newId))
    } catch (error) {
      console.error('Error creating data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  async readAll(req, res) {
    try {
      let data;

      if (req.baseUrl.includes('api/customer/books')) {
        data = await this.model.readAll({ author_request_status: 'none' })
      } else data = await this.model.readAll();

      if (!data.length) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

      return res.status(httpStatus.OK).json(okResponse(data))
    } catch (error) {
      console.error('Error reading data:', error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  async readById(req, res) {
    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    try {
      const id = req.params.id
      let data

      if (req.baseUrl.includes('api/user/books')) {
        data = await this.model.readById(id, { author_request_status: 'none' })
      } else data = await this.model.readById(id);

      if (!data) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

      return res.status(httpStatus.OK).json(okResponse(data))
    } catch (error) {
      // console.error('Error reading data by ID:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;

      await this.model.update(id, data);

      return res.status(httpStatus.OK).json(okResponse('Data updated successfully'));
    } catch (error) {
      // console.error('Error updating data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error));
    }
  }

  async delete(req, res) {
    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    const id = req.params.id

    // Check if the data exists
    const data = await this.model.readById(id);
    if (!data.length) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

    try {
      await this.model.delete(id);

      return res.status(httpStatus.OK).json(okResponse('Data deleted successfully'));
    } catch (error) {
      console.error('Error deleting data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error));
    }
  }

  async search(req, res) {
    const seachTerms = req.body

    // Validate the request depending on the model
    if (req.baseUrl.includes('/books')) {
      const { error } = searchBookRequestSchema().validate(seachTerms)
      if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))
    }

    try {
      const data = await this.model.search(seachTerms);

      if (data) return res.status(httpStatus.OK).json(okResponse(data))
      else return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())
    } catch (error) {
      // console.error('Error searching data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }
}

export default BaseController