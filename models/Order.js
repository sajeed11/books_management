import autoBind from 'auto-bind'
import BaseModel from "./BaseModel.js";


class OrderModel extends BaseModel {

  constructor(table) {
    super(table)
    this.table = table
    autoBind(this)
  }

  // Cancel an order
  // async cancel(id) {
  //   const connection = await this.getConnection()

  //   try {

  //   } catch (error) {
  //     console.log('Error canceling order:', error)
  //     throw error
  //   } finally {
  //     connection.release()
  //   }
  // }
}

export default OrderModel