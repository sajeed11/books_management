import Joi from "joi";

class UserRequest {
  getUserByIdRequestSchema() {
    return Joi.object({
      id: Joi.number().required()
    })
  }
}

export default UserRequest;