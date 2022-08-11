const userModel = require('../../models/users/users')
const recipeModel = require('../../models/recipes/recipes')
const userValidators = require('../validators/users')
const recipeValidators = require('../validators/recipes')

const controller = {
    showRecipes: async (req, res) => {
        // get user data from db using session user
        let user = null
        console.log('this is showrecipe')
        try {
            user = await userModel.findOne({email: req.session.user})
        } catch(err) {
            console.log(err)
            res.redirect('pages/login')
            return
        }

        const recipe = await recipeModel.find({author: user._id}).exec()
        console.log(recipe)

        res.render('pages/recipes', {user, recipe})
    },

    createRecipe: async (req, res) => {
        // validations
        const validationResults = recipeValidators.createRecipeValidator.validate(req.body)

        if (validationResults.error) {
            res.send('validation error occurred')
            return
        }

        let user = null

        try {
            user = await userModel.findOne({email: req.session.user})
        } catch(err) {
            console.log(err)
            res.redirect('pages/login')
            return
        }

        const validatedResults = validationResults.value

        validatedResults.author = user._id
        
        try {
            await recipeModel.create(validatedResults)
        } catch(err) {
            console.log(err)
        }

        // todo: redirect to products page
        res.redirect('/recipes')
    },

    deleteRecipe: async (req, res) => {
        console.log('delete route activated')
        try {
            await recipeModel.findByIdAndRemove(req.params.id);
            res.redirect("/recipes");
          } catch (err) {
            console.log(err);
          }
    },

    showEditForm: (req, res) => {
        recipeModel.findById(req.params.id, (err, recipe) => {
            if (err) {
              console.log(err);
            }
            res.render("pages/edit.ejs", { recipe: recipe })
          })
    },

    editRecipe: (req, res) => {
        recipeModel.findByIdAndUpdate(
            req.params._id,
            req.body,
            {new: true},
            (err, recipe) => {
                if (err) {
                    console.log(err)
                }
                res.redirect('/recipes')
            }
        )
    }

    // listRecipes: async (req, res) => {
    //     const recipe = await recipeModel.find().exec()
    //     console.log('hello')
    //     res.render('pages/recipes', {user, recipe})
    // },

    // getRecipe: async(req, res) => {
    //     const recipe = await recipeModel.findById(req.params.product_id)

    //     res.render('pages/recipes', {recipe})
    // }
}

module.exports = controller