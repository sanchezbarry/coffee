const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    equipment: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
