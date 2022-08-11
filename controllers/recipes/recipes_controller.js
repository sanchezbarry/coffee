const userModel = require('../../models/users/users')
const recipeModel = require('../../models/recipes/recipes')
const userValidators = require('../validators/users')
const recipeValidators = require('../validators/recipes')

const controller = {

    // GET & NEW 1&2/7
    showRecipes: async (req, res) => {
        // get user data from db using session user
        let user = null
        
        try {
            user = await userModel.findOne({email: req.session.user.email})
        } catch(err) {
            console.log(err)
            res.redirect('pages/login')
            return
        }

        const recipe = await recipeModel.find({author: user._id}).exec()
        

        res.render('pages/recipes', {user, recipe})
    },

    // POST 3/7
    createRecipe: async (req, res) => {
        // validations
        const validationResults = recipeValidators.createRecipeValidator.validate(req.body)

        if (validationResults.error) {
            res.send('validation error occurred')
            return
        }

        let user = null

        try {
            user = await userModel.findOne({email: req.session.user.email})
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

    // DELETE 4/7
    deleteRecipe: async (req, res) => {
        
        try {
            await recipeModel.findByIdAndRemove(req.params.id);
            res.redirect("/recipes");
          } catch (err) {
            console.log(err);
          }
    },

    // EDIT 5/7
    showEditForm: (req, res) => {
        recipeModel.findById(req.params.id, (err, recipe) => {
            if (err) {
              console.log(err);
            }
            res.render("pages/edit.ejs", { recipe: recipe })
          })
    },

    // UPDATE & SHOW 6&7/7
    editRecipe: async (req, res) => {
        console.log(req.params)
        console.log(req.body)
        let recipe = await recipeModel.findById(req.params.id) //try catch for both 86&87 - to see their errors.
        await recipe.updateOne(req.body)
        console.log(recipe)
        res.redirect('/recipes')
        // recipeModel.findById(
        //     req.params._id,
        //     req.body,
        //     {new: true, overwrite: true},
        //     (err, recipe) => {
        //         if (err) {
        //             console.log(err)
        //         }
        //         res.redirect('/recipes')
        //     }
        // )
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