const bcrypt = require('bcrypt')
const userModel = require('../../models/users/users')
const userValidators = require('../validators/users')

const controller = {

    showRegistrationForm: (req, res) => {
        res.render('pages/register')
    },

    register: async (req, res) => {
        // validations
        const validationResults = userValidators.registerValidator.validate(req.body)

        if (validationResults.error) {
            res.send(validationResults.error)
            return
        }

        const validatedResults = validationResults.value

        // ensure that password and confirm_password matches
        if (validatedResults.password !== validatedResults.confirm_password) {
            res.send('passwords do not match')
            return
        }

        // hash the password
        const hash = await bcrypt.hash(validatedResults.password, 10)

        // create the user and store in db
        try {
            await userModel.create({
                name: validatedResults.fullname,
                email: validatedResults.email,
                hash: hash,
            })
        } catch(err) {
            console.log(err)
            res.send('failed to create user')
            return
        }

        res.redirect('pages/login')
    },

    showLoginForm: (req, res) => {
        res.render('pages/login')
    },

    login: async (req, res) => {
        // validations here ...
        const validatedResults = req.body

        let user = null

        // get user with email from DB
        try {
            user = await userModel.findOne({email: validatedResults.email})
        } catch (err) {
            res.send('failed to get user')
            return
        }

        // use bcrypt to compare the given password with the one store as has in DB
        const pwMatches = await bcrypt.compare(validatedResults.password, user.hash)

        if (!pwMatches) {
            res.send('incorrect password')
            return
        }

        console.log(req.session)

        //would be vulnerable to session fixation without this. with cookie value they can impersonate you.
        req.session.regenerate(function (err) { 

            if (err) {
                res.send('unable to regenerate session')
                return
            }
        
            // store user information in session, typically a user id
            //would be a gibberish string on the front end, any subsequent req. to the backend will include this cookie in the request. thessesion secret will decrypt this
            req.session.user = user
        
            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) {
                    res.send('unable to save session')
                    return
                }

                res.redirect('/recipes')
            })
          })
    },

    logout: async (req, res) => {
        req.session.user = null
        
        req.session.save(function (err) {
            if (err) {
                res.redirect('pages/login')
            }

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/')
            })
        })
    },
}

module.exports = controller