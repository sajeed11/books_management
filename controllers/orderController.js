import autoBind from "auto-bind";
import BaseController from "./baseController";
import OrderModel from "../models/Order";


class OrderController extends BaseController {

  constructor(model) {
    super(model)
    autoBind(this)
  }
}

const orderModel = new OrderModel('orders')

export default new OrderController(orderModel)