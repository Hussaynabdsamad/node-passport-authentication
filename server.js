if(process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require('./passport-config')
initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
) 
const app = express()
const users = []
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false, 
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/',  checkAuthenticated, (req, res)=> {
res.render('index', {name: "hussayn"})
})
app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login')
})
app.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:  '/login',
    failureMessage: true
}))
app.post('/register', checkNotAuthenticated,  async (req,res)=> {
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
        id : Date.now().toString(),
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    })
   
      res.redirect('/login')
} catch (error) {
    res.redirect('/register')
}
})
app.delete('/logout', (req, res)=> {
    req.logOut()
    res.redirect('/login')
})
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return  res.redirect('/')
    }
next()
}




app.listen('4500' , () => {
    console.log('I don dey run')
})