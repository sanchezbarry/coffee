const Joi = require('joi')

const createRecipeValidator = Joi.object({
    brand: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    equipment: Joi.string().required(),
    clicks: Joi.number().min(1).required(),
    time: Joi.number().min(1).required(),
    rating: Joi.number().min(1).required()
})

module.exports = {
    createRecipeValidator
}
