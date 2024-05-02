import Joi from "joi";

function ApprovingRequestID() {
  return Joi.object({
    id: Joi.number().required()
  })
}

function ApprovingRequestData() {
  return Joi.object({
    id: Joi.number().required(),
    book_id: Joi.number().required(),
    status: Joi.string().valid('approved', 'rejected').required()
  })
}

export { ApprovingRequestID, ApprovingRequestData }