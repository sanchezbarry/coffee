const express = require('express')

const app = express()
const port = 3000

const pageController = require('./controllers/pages/page_controller')



// view engine
app.set('view engine', 'ejs')

app.get('/', pageController.showHome)



app.listen(port, () => {
    console.log('listening...')
});
  