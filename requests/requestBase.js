import Joi from "joi";

function ByIdRequest() {
  return Joi.object({
    id: Joi.number().required()
  })
}

export { ByIdRequest }