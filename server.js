//Express 
const express = require('express');
const app = express();
const PORT = 3000;

//Handlebars
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access') 


//Import our database and model
const {sequelize} = require('./db');
const {Sauce} = require('./models/index');


const seed = require('./seed')

//Set up our templating engine with handlebars
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars'); // To render template files, set the following application setting properties, set in app.js in the default app created by the generator:

//serve static assets from public folder
app.use(express.static('public')) //

//body parser so req.body is not undefined
app.use(require('body-parser').urlencoded());

//seed our database
seed();

//*************** ROUTES ******************//
app.get('/sauces', async (req, res) => {
    const sauces = await Sauce.findAll();
    res.render('sauces', {sauces}); //first param points to the sauces view in handlebars, second param is the data from the db
})

app.get('/sauces/:id', async (req, res) => {
    const sauce = await Sauce.findByPk(req.params.id);
    res.render('sauce', {sauce}); //sauce hb view
})

//New Routes go here: 
app.get("/new-sauce-form", (req, res) => {
    res.render("newSauceForm")
})

app.post("/new-sauce", async (req, res) => {
    //create hotsauce and store in db
    const newSauce = await Sauce.create(req.body)
    const foundNewSauce = await Sauce.findByPk(newSauce.id)
    //if new sauce was created, send status 201, else console error
    if(foundNewSauce) {
        res.status(201).send("New sauce successfully created")
    } else {
        console.error("Hot sauce was not created")
    }
})

//serving is now listening to PORT
app.listen(PORT, () => {
    console.log(`Your server is now listening to port ${PORT}`)
})