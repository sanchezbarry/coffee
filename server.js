require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000
const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@generalassembly.a24zm.mongodb.net/?retryWrites=true&w=majority`


const pageController = require('./controllers/pages/page_controller')
const userController = require('./controllers/users/users_controller')
const recipeController = require('./controllers/recipes/recipes_controller')
const authMiddleware = require('./middlewares/auth_middleware')




// view engine
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))
// app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, maxAge: 7200000 }
}))
app.use(authMiddleware.setAuthUserVar)

app.get('/', pageController.showHome)

app.use(methodOverride("_method"))

app.use(bodyParser.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings

app.use(bodyParser.json()); // returns middleware that only parses JSON

// Users Routes
app.get('/users/register', userController.showRegistrationForm)
app.post('/users/register', userController.register)
app.get('/users/login', userController.showLoginForm)
app.post('/users/login', userController.login)
app.post('/users/logout', userController.logout)

//recipe Routes
app.get('/recipes', authMiddleware.isAuthenticated, recipeController.showRecipes)
// gets list of recipes for a particular user.
app.post('/recipes', recipeController.createRecipe)
app.delete('/recipes/:id', recipeController.deleteRecipe)
app.patch('/recipes/:id/edit', recipeController.editRecipe)

// app.get('/recipes', authMiddleware.isAuthenticated, recipeController.recipeList)


app.listen(port, async () => {
    try {
        await mongoose.connect(connStr, { dbName: 'coffee'})
    } catch(err) {
        console.log(`Failed to connect to DB`)
        process.exit(1)
    }

    console.log(`Example app listening on port ${port}`)
})
  