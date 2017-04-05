var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
require('../config/passport');
var express = require('express');
var router = express.Router();
var MailSender = require('../helpers/mail_sender');
var jwt = require('express-jwt');
var config = require('config');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var request = require('request');
var config = require('config');

router.get('/auth/facebook',
  passport.authenticate('facebook', {scope: ['email']}),
  function(req, res){
  });

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { 
    		session: false,
        failureRedirect: '/#/login'
    }), function(req, res) {
      if (!req.user.hash) {
        res.redirect("/#/register_with_social/" + req.user.email);
      }
      else {
        res.redirect("/#/login_with_social/" + req.user.generateJWT());
      }
    }
);

router.get('/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']}),
  function(req, res){
  });

router.get('/auth/google/callback', 
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/#/login'
    }), function(req, res) {
      if (!req.user.hash) {
        res.redirect("/#/register_with_social/" + req.user.email);
      }
      else {
        res.redirect("/#/login_with_social/" + req.user.generateJWT());
      }
    }
);

// route for twitter authentication and login
router.get('/auth/twitter', 
  passport.authenticate('twitter'), function(req, res){
  });

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {                                          
    		session: false,
        failureRedirect : '/#/login'
    }), function(req, res) {
      if (!req.user.hash) {
        res.redirect("/#/register_with_twitter/"+req.user.twitter.id);
      }
      else {
        res.redirect("/#/login_with_social/" + req.user.generateJWT());
      }    	
    });
module.exports = router;
