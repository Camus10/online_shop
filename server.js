const mongoose = require('mongoose');
const config = require('./config/database');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const expressValidator = require('express-validator');
const passport = require('passport');
const createError = require('http-errors');


// Database connection
mongoose.connect(config.database, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});
// Check whether database is connecting or not
let dataBase = mongoose.connection;
dataBase.once('open', function(){
    console.log('Connected to MongoDB');
});
dataBase.on('error', function(err){
    console.log(err);
});

// Initialisation app
let app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());

// Body parser middleware
app.use(express.urlencoded({
    extended : false
}));
app.use(cookieParser());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
    secret : 'keyboard cat',
    resave : true,
    saveUninitialized : true
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express validator middleware
app.use(expressValidator({
    errorFormatter : function(param, msg, value){
        let namespace = param.split('.'), root = namespace.shift(), formParam = root;
    
        while(namespace.length){
            formParam = formParam + '[' + namespace.shift() + ']'
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        }
    }
}));

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

// Route files
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let secureRouter = require('./routes/secure');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/secure', secureRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next){
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next){
    // Set locals only providing error in development
    res.locals.messages = err.messages;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;