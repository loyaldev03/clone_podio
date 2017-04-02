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

// route for facebook authentication and login
// different scopes while logging in
// router.post('/auth/facebook', function(req, res) {
//   var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
//   var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
//   var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
//   var params = {
//     code: req.body.code,
//     client_id: req.body.clientId,
//     client_secret: config.Facebook.appSecret,
//     redirect_uri: req.body.redirectUri
//   };
//   // Step 1. Exchange authorization code for access token.
//   request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
//     if (response.statusCode !== 200) {
//       return res.status(500).send({ message: accessToken.error.message });
//     }
//     console.log("------------------------auth facebook accessTokenUrl--------------------");
//     // Step 2. Retrieve profile information about the current user.
//     request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
//     	console.log("------------------------auth facebook userinfoUrl--------------------");
//       if (response.statusCode !== 200) {
//         return res.status(500).send({ message: profile.error.message });
//       }
//       if (req.header('Authorization')) {

//       	// res.send({"success": profile});
//         User.findOne({ facebook: profile.id }, function(err, existingUser) {
//           debugger;
//           if (existingUser) {
//             return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
//           }

//           var token = req.header('Authorization').split(' ')[1];
//           var payload = jwt.decode(token, config.TOKEN_SECRET);
//           User.findById(payload.sub, function(err, user) {
//             if (!user) {
//               return res.status(400).send({ message: 'User not found' });
//             }
//             user.facebook = profile.id;
//             user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
//             user.displayName = user.displayName || profile.name;
//             user.save(function() {
//               var token = createJWT(user);
//               res.send({ token: token });
//             });
//           });
//         });
//       } else {
//       	res.send({"success": accessToken});
//         // Step 3. Create a new user account or return an existing one.
//         User.findOne({ facebook: profile.id }, function(err, existingUser) {
//           if (existingUser) {
//             var token = createJWT(existingUser);
//             return res.send({ token: token });
//           }
//           var user = new User();
//           user.facebook = profile.id;
//           user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
//           user.displayName = profile.name;
//           user.save(function() {
//             var token = createJWT(user);
//             res.send({ token: token });
//           });
//         });
//       }
//     });
//   });
// });

router.get('/auth/facebook',
  passport.authenticate('facebook', {scope: ['email']}),
  function(req, res){
  //this function will not be called
  });

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { 
    		session: false,
        failureRedirect: '/#/login'
    }), function(req, res) {
    	res.redirect("/#/login_with_social/" + req.user.generateJWT());
    }
);

// route for twitter authentication and login
router.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
    		session: false,
        failureRedirect : '/#/login'
    }), function(req, res) {
    	res.redirect("/#/login_with_social/" + req.user.generateJWT());
    });
module.exports = router;
