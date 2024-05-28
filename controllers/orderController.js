import autoBind from "auto-bind";
import httpStatus from "http-status";
import BaseController from "./baseController.js";
import OrderModel from "../models/Order.js";
import BookModel from "../models/Book.js";
import { ByCustomerIdRequest, CreateOrderRequestSchema, ByIdAndCustomerIdRequest, UpdateOrderRequestSchema } from "../requests/requests.js";
import { clientErrorResponse, notFoundResponse, serverErrorResponse } from "../helpers/handleErrorResponse.js";
import { okResponse } from "../helpers/handleOkResponse.js";

const bookModel = new BookModel('books')
class OrderController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }

  // Read all orders
  async readOwnAll(req, res) {
    const customer_id = req.params.customer_id
    // Validate the request
    const { error } = ByCustomerIdRequest().validate({ customer_id })

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    try {
      const data = await orderModel.readAll({ customer_id })

      if (!data) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

      return res.status(httpStatus.OK).json(okResponse(data))
    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  // Read an order by id
  async readOwnById(req, res) {
    const { customer_id, order_id } = req.params

    // Validate the request
    const { error } = ByIdAndCustomerIdRequest().validate({ customer_id, order_id })

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))


    try {
      const data = await orderModel.readById(order_id)

      if (!data) {
        return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())
      }

      if (data[0].customer_id !== parseInt(customer_id))
        res.status(httpStatus.FORBIDDEN).json(clientErrorResponse('You are not authorized to view this order'))

      return res.status(httpStatus.OK).json(okResponse(data))
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  // Order a book
  async order(req, res) {
    // Validathe the request
    const { error } = CreateOrderRequestSchema().validate(req.body)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    const data = {
      book_id: req.body.book_id,
      customer_id: req.params.customer_id,
      quantity: req.body.quantity,
      status: 'pending',
    }

    const connection = await orderModel.getConnection()

    // We check if the book exists then if it not approved yet
    try {
      const book = await bookModel.readById(data.book_id)

      if (!book) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())
    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }

    try {
      const result = await orderModel.create(data)

      if (book[0].stock_quantity < data.quantity) {
        await connection.rollback()
        return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse('The book is out of stock'))
      }
      return res.status(httpStatus.CREATED).json(okResponse(result))
    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }

  // Admin functionality: update the order by set the status of it
  // If he want to approve the order: status = 'approved' and we make editing on the quantity of the book
  // If he want to reject the order: status = 'rejected' and we delete the order
  async updateOrder(req, res) {
    const { order_id } = req.params
    const data = req.body

    // Validate the request
    const { error } = UpdateOrderRequestSchema().validate(req.body)

    if (error) return res.status(httpStatus.BAD_REQUEST).json(clientErrorResponse(error))

    try {
      const order = await orderModel.readById(order_id)

      if (!order) return res.status(httpStatus.NOT_FOUND).json(notFoundResponse())

      orderModel.update(order_id, data)

      if (data.status === 'approved') {
        await bookModel.update(order[0].book_id, order[0].quantity)
      } else {
        await orderModel.delete(order_id)
      }

      return res.status(httpStatus.OK).json(okResponse('Order updated successfully'))
    } catch (error) {
      // console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(serverErrorResponse(error))
    }
  }
}

const orderModel = new OrderModel('orders')

export default new OrderController(orderModel)