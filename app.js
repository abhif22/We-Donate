var index = require('./routes/index');
var users = require('./routes/users');    
var express = require('express')
var app = express()
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var mongod = require('mongodb')
var mongoose = require('mongoose')
var flash = require('connect-flash')
var session = require('express-session')
var expressValidator = require('express-validator')
var passport = require('passport')
var LocalStrategy =  require('passport-local').Strategy

mongoose.connect('mongodb://localhost/movie-recommender',(err)=>{
  if(err){
      console.log('Connection to MongoDB Failed!')
      console.log(err)
    }
    else{
      console.log('Connection to MongoDB Successfull!')
    }
})

var db = mongoose.connection

    app.use(express.static(__dirname+'/public'));
    app.set('views','./views')
    app.set('view engine', 'ejs')
    app.engine('ejs', ejsMate);

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(session({
        secret: 'secret12344321',
        saveUninitialized: true,
        resave: true
    }))

    //Passport Initialization
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(expressValidator({
        errorFormatter: (params,msg,value)=>{
            var namespace = params.split('.'),
                root = namespace.shift(),
                formParam = root;

                while(namespace.length){
                    formParam += '['+namespace.shift() + ']'
                }
                return {
                    param: formParam,
                    msg: msg,
                    value: value
                }
        }
    }))

    //Use connect-flash
    app.use(flash())
    
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.loggedin = req.user||null
            next()
        })
    
        var users = require('./routes/users')
        var routes = require('./routes/index')
        var facebookLogin = require('./routes/facebook-route.js')
        
        app.use('/', routes)
        app.use('/users', users)
        app.use('/', facebookLogin)
    
        var port = process.env.PORT || 8080;
        app.set('port', port)
        app.listen(app.get('port'),(err)=>{
            if(err)
                console.log(err)
            else
                console.log('Server listening on '+app.get('port'))
        })

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
