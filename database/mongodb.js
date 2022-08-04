const mongoose = require('mongoose')

const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@generalassembly.a24zm.mongodb.net/?retryWrites=true&w=majority`
const DB = mongoose.connect(connStr, { dbName: 'coffee'})

module.exports = DB
