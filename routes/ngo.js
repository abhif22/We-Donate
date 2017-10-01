'use strict';
const router = require('express').Router();
var ngo = require('../models/ngo.js')
const passport = require('passport');  
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');  
const authenticate = expressJwt({secret : 'server secret'});
const db = {  
    updateOrCreate: function(ngo, cb){
      // db dummy, we just cb the user
      cb(null, ngo);
    }
  };

  function serialize(req, res, next) {  
    db.updateOrCreate(req.body.ngoname, function(err, user){
      if(err) {
        return next(err);
      }
      // we store the updated information in req.body.username again
      req.body.ngoname = req.body.ngoname;
      next();
    });
  }


  function generateToken(req, res, next) {  
    req.token = jwt.sign({
      ngoName: req.body.ngoname,
    }, 'server secret', {
      expiresIn: 60*2
    });
    next();
  }

  function respond(req, res) {  
    res.status(200).json({
      ngo: req.body.ngoname,
      token: req.token
    });
  }

passport.use(new LocalStrategy(  
  function(ngoName, password, done) {
    // database dummy - find user and verify password
    ngo.getNGOByNGOname(ngoName,'',(err, ngo)=>{
		if(err)
			throw(err)
		if(!ngo)
			return done(null, false, {message: 'Incorrect Ngoname'})
		ngo.comparePassword(password, ngo.password, (err, isMatch)=>{
			if(err)
				throw err
			if(isMatch)
				return done(null, ngo)
			else
				return done(null, false, {message: 'Incorrect Password'})
		})
	})
  }
));

router.post('ngo/signup',(req, res, next)=>{
  var authorisedPerson = req.body.authorisedPerson,
      ngoname = req.body.ngoname,
      email = req.body.email,
      password = req.body.password;
      description = req.body.description || '',
      address = req.body.address || '',
      regNo = req.body.regNo,
      country = req.body.country|| '',
      state = req.body.state|| '',
      city = req.body.city|| '',
      contactNo = req.body.contactNo || '',
      fundRaised = req.body.fundRaised || 0;
      location = {
          city: city,
          state: state,
          country: country
      }
      var newNgo = new ngo({
            authorisedPerson: authorisedPerson,
            ngoName: ngoname,
            email: email,
            password: password,
            description: description,
            address: address,
            regNo: regNo,
            location: location,
            contactNo: contactNo,
            fundRaised: fundRaised
      });
      ngo.getNGOByNGOname(ngoName,email,(err, existingNgo)=>{
        if(err){
          throw err
      }
        console.log('EXISTING NGO'+existingNgo)
        if(existingNgo){
          if(existingNgo.ngoName == ngoName){
              res.status(403).send({
                'error_msg': 'NGO Name not Available'
              });
          }
          else{
            res.status(403).send({
                'error_msg': 'NGO with this Email is Already Registered with us'
              });
          }
          return res.redirect('/ngo/signup')
        }
        else{
          ngo.createNgo(newNgo,(err,ngo)=>{
            if(err)
              throw err;
            // console.log(user)
            //generateToken
            jwt.sign({
              ngoName: req.body.ngoname,
            }, 'server secret', {
              expiresIn: 60*2
            },(err, token)=>{
              if(err){
                throw err;
              }
              else{
                req.token = token;
                respond(req, res);
              }
            });
          })
        }
      })

})

router.get('ngo/about', authenticate, function(req, res) {  
  console.log("Entered me route after authentication!");
//   if (!req.user) return res.status(401).send({
//     Message: 'You are not authorized to access this resource.'
//   });
    res.status(200).json({
      Message: 'Coming Soon!'
    });
  });

router.post('ngo/auth',passport.authenticate(  
    'local', {
      session: false
    }), serialize, generateToken, respond);

module.exports = router;