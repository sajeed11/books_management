import Joi from "joi";

function ByIdRequest() {
  return Joi.object({
    id: Joi.number().required()
  })
}

function ByTwoIdRequest() {
  return Joi.object({
    id: Joi.number().required(),
    author_id: Joi.number().required()
  })
}

export { ByIdRequest, ByTwoIdRequest }