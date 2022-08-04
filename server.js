require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

const app = express()
const port = 3000
const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@generalassembly.a24zm.mongodb.net/?retryWrites=true&w=majority`


const pageController = require('./controllers/pages/page_controller')
const userController = require('./controllers/users/users_controller')
const authMiddleware = require('./middlewares/auth_middleware')




// view engine
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, maxAge: 7200000 }
}))
app.use(authMiddleware.setAuthUserVar)

app.get('/', pageController.showHome)

// Users Routes
app.get('/users/register', userController.showRegistrationForm)
app.post('/users/register', userController.register)
app.get('/users/login', userController.showLoginForm)
app.post('/users/login', userController.login)
app.post('/users/logout', userController.logout)

app.get('/recipes', authMiddleware.isAuthenticated, userController.showRecipes)
// app.get('/users/profile', userController.showProfile)


app.listen(port, async () => {
    try {
        await mongoose.connect(connStr, { dbName: 'coffee'})
    } catch(err) {
        console.log(`Failed to connect to DB`)
        process.exit(1)
    }

    console.log(`Example app listening on port ${port}`)
})
  