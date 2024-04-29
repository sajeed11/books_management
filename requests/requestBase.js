import Joi from "joi";

class BaseRequest {
  getElementByIdRequest() {
    return Joi.object({
      id: Joi.number().required()
    })
  }
}

export default BaseRequest