import httpStatus from "http-status"; // For standardized HTTP status codes
import autoBind from 'auto-bind';
import { ByIdRequest } from '../requests/requestBase.js';

class BaseController {
  constructor(model) {
    this.model = model;
    autoBind(this);
  }

  async create(req, res) {
    try {
      const data = req.body;
      const newId = await this.model.create(data);
      return res.status(httpStatus.CREATED)
        .json(
          {
            success: true,
            id: newId
          }
        )
    } catch (error) {
      console.error('Error creating data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating data' });
    }
  }

  async readAll(req, res) {
    try {
      const data = await this.model.readAll();
      if (!data.length) {
        return res.status(httpStatus.NOT_FOUND)
          .json(
            {
              success: false,
              message: 'No data found'
            }
          );
      }
      return res.status(httpStatus.OK)
        .json(
          {
            success: true,
            message: 'Data retrieved successfully',
            data: data
          }
        );
    } catch (error) {
      console.error('Error reading data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error reading data' });
    }
  }

  async readById(req, res) {
    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          type: error.details[0].type,
          context: error.details[0].context
        }
      })
    }

    try {
      const id = req.params.id;
      const data = await this.model.readById(id);
      if (!data.length) {
        return res.status(httpStatus.NOT_FOUND)
          .json(
            {
              success: false,
              message: 'No data found'
            }
          );
      }
      return res.status(httpStatus.OK)
        .json(
          {
            success: true,
            message: 'Data retrieved successfully',
            data: data
          }
        );
    } catch (error) {
      console.error('Error reading data by ID:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error reading data' });
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      await this.model.update(id, data);
      return res.status(httpStatus.OK)
        .json(
          {
            success: true,
            message: 'Data updated successfully'
          }
        );
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error updating data' });
    }
  }

  async delete(req, res) {
    // Validate the request
    const { error } = ByIdRequest().validate(req.params)

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          type: error.details[0].type,
          context: error.details[0].context
        }
      })
    }

    try {
      const id = req.params.id;
      await this.model.delete(id);
      return res.status(httpStatus.OK)
        .json(
          {
            success: true,
            message: 'Deleted with success'
          }
        )
    } catch (error) {
      console.error('Error deleting data:', error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          {
            success: false,
            message: 'Error deleting data'
          }
        );
    }
  }
}

export default BaseController