const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const method = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
//inits
const app = express();
require('./config/passport')
// sets
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    pactialsDir: path.join(app.get('views'), 'parcials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');
//middlewares
app.use(express.urlencoded({extend: false}))
app.use(morgan('dev'))
app.use(method('_method'))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true 
}))
app.use(flash(passport.initialize()))
app.use(passport.session())
app.use(flash())
// global vars
app.use((req, res, next)=>{
    res.locals.added_msg = req.flash('added_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.errorrd_msg = req.flash('errorrd_msg')
    res.locals.errors = req.flash('error')
    res.locals.user = req.user || null
    next();
})

// urls
app.use(require('./routes/index.routes'));
app.use(require('./routes/notes.routes'));
app.use(require('./routes/users.routes'));
// static files
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app