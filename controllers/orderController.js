import autoBind from "auto-bind";
import httpStatus from "http-status";
import BaseController from "./baseController.js";
import OrderModel from "../models/Order.js";
import BookModel from "../models/Book.js";

const bookModel = new BookModel('books')
class OrderController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }


  // Order a book
  async order(req, res) {
    // Validathe the request

    const data = {
      book_id: req.body.book_id,
      customer_id: req.body.customer_id,
      status: 'pending',
    }

    const connection = await orderModel.getConnection()

    // We check if the book exists then if it not approved yet
    try {
      const book = await bookModel.readById(data.book_id)

      if (!book) {
        return res.status(httpStatus.NOT_FOUND)
          .json(
            {
              success: false,
              message: 'Book not found'
            }
          )
      }

      try {
        await connection.beginTransaction()

        try {
          const result = await orderModel.create(data)

          await bookModel.update(data.book_id, { stock_quantity: book[0].stock_quantity - 1 })

          await connection.commit()
          return res.status(httpStatus.OK)
            .json(
              {
                success: true,
                data: result
              }
            )
        } catch (error) {
          await connection.rollback()
          throw error
        } finally {
          connection.release()
        }

        // const order = await this.model.create(data)

        // return res.status(httpStatus.CREATED)
        //   .json(
        //     {
        //       success: true,
        //       data: order
        //     }
        //   )
      } catch (error) {
        console.log(error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            error: {
              message: error.message
            }
          })
      }
    } catch (error) {
      console.log(error)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          error: {
            message: error.message
          }
        })
    }






  }
}

const orderModel = new OrderModel('orders')

export default new OrderController(orderModel)