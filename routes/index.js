var router = require('express').Router()
var User = require('../models/user.js')
var async = require('async')
var http = require('http')
var fs = require('fs')

var ensureAuthentication = (req,res,next)=>{
  if(req.isAuthenticated())
    next()
  else{
    req.flash('error_msg', 'You are not Logged In. Login First')
    return res.redirect('/users/login')
  }
}

router.get('/', (req,res)=>{
res.json({"Message": "Getting There Soon!"});
res.end();
})
module.exports = router;