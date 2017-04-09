var express = require('express');
var router = express.Router();
var MailSender = require('../helpers/mail_sender');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/statistics', function(req, res, next) {
		
});

router.get('/sendActivationEmail/:username', function(req, res, next){
	User.findOne({username: req.params.username}, function(err, user){
		if (err) {
			return next(err);
		}

		MailSender.sendVerificationMessage(user).then(function(_res){
    	debugger;
    	res.redirect("/#/verify/");
		});
	})
})
module.exports = router;