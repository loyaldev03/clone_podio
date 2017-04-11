var config = require('config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var uid = require('rand-token').uid;
var exports = module.exports;

exports.sendVerificationMessage = function(user) {
	return new Promise(function(resolve, reject) {
		const sendgrid = require('sendgrid')(config.get('Customer.SENDGRID_API_KEY'));
		const sghelper = require('sendgrid').mail;
	  var from_email = new sghelper.Email(config.get('Admin_Email'));
	  var to_email = new sghelper.Email(user.email);
	  var subject = 'Verify Your Account';
	  var content = new sghelper.Content('text/html', 
	  				`
						<center>            
						  <h1 style="color:#5091bd;font-size:24px;">Account verification</h1><br>
						  <p style="font-family:Helvetica, Arial, sans-serif;font-size:16px;">Confirm your email address to activate your account<br><br></p>
						  <a rel="nofollow" target="_blank" href=http://localhost:3000/#/activate/` + user.email + `/` + user.verification_token + `" style="color:#fff;background-color:#5fc55f;border-color:#5fc55f;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;padding:16px 40px;font-size:16px;text-decoration:none;">CONFIRM </a><br><br>            
						  <p style="font-family:Helvetica, Arial, sans-serif;font-size:16px;">Thanks for signing up. Click green button to confirm that <br>` + `<a rel="nofollow" ymailto="mailto:` + user.email + `" target="_blank" href="mailto:` + user.email + `">` + user.email + `</a>` + ` is your email address and get started<br>
								with Linkabee.</p><br><br><br>
						  <p style="font-family:Helvetica, Arial, sans-serif;font-size:12px;margin-bottom:10px;">
						  Having trouble with the links in this email? Copy and paste this link into your browser to verify: <br>
						  <a rel="nofollow" style="color:#444;font-size:12px;" target="_blank" href="http://localhost:3000/#/activate/` + user.email + `/` + user.verification_token + `">http://localhost:3000/#/activate/` + user.email + `/` + user.verification_token + `</a>
						  </p>
						</center>						
	  				`);
	  var mail = new sghelper.Mail(from_email, subject, to_email, content);

	  var request = sendgrid.emptyRequest({
	    method: 'POST',
	    path: '/v3/mail/send',
	    body: mail.toJSON(),
	  });
	  sendgrid.API(request, function(error, response) {
	    if(error)
	      return reject({
	        status: 0,
	        message: error.errors
	      });
	    else
	      return resolve({
	        status: 1,
	        message: "sent"
	      });
	  });	
	})
}

exports.sendWelcomeMessage = function(user) {
	return new Promise(function(resolve, reject) {
		const sendgrid = require('sendgrid')(config.get('Customer.SENDGRID_API_KEY'));
		const sghelper = require('sendgrid').mail;
	  var from_email = new sghelper.Email(config.get('Admin_Email'));
	  var to_email = new sghelper.Email(user.email);
	  var subject = 'Linkabee Account Information';
	  var content = new sghelper.Content('text/html', 
	  				`
						<center>
							<h1 style="color:#5091bd;font-size:24px;text-align:center;">Welcome to Linkabee</h1><br>
							<p style="font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:center;" >
								Hey ` + user.full_name + `, thanks for joining Linkabee - you'll find your account<br> 
								information below.<br> 
								We're sure you'll love using Linkabee. <br>
							</p>
							<h3 style="color:#999;font-size:14px;text-align:center;">YOUR ACCOUNT INFORMATION</h3>
							<p style="color:#444;font-size:16px;">
								<b>Email: </b><a rel="nofollow" ymailto="mailto:` + user.email + `" target="_blank" href="mailto:` + user.email + `">` + user.email + `</a>
							</p>
							<br>
							<p style="font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:center;">
								Best regards, <br>
						    Team Linkabee
						  </p>
						</center>	  								
	  				`);
	  var mail = new sghelper.Mail(from_email, subject, to_email, content);

	  var request = sendgrid.emptyRequest({
	    method: 'POST',
	    path: '/v3/mail/send',
	    body: mail.toJSON(),
	  });

	  sendgrid.API(request, function(error, response) {
	    if(error)
	      return reject({
	        status: 0,
	        message: error.errors
	      });
	    else
	      return resolve({
	        status: 1,
	        message: "sent"
	      });
	  });	
	})
}

exports.sendPasswordResetRequestMessage = function(email) {
	return new Promise(function(resolve, reject){
		User.findOne({email: email}, function(err, user) {
			if (err) {
				return reject(err);
			}
			if (!user) {
				return reject({message: 'Your email could not be found'})
			}
			debugger;
			user.password_reset_token = uid(32);
			user.save(function(err, _res) {
				if (err) {
					return next(err);
				}
				const sendgrid = require('sendgrid')(config.get('Customer.SENDGRID_API_KEY'));
				const sghelper = require('sendgrid').mail;
			  var from_email = new sghelper.Email(config.get('Admin_Email'));
			  var to_email = new sghelper.Email(user.email);
			  var subject = 'Forgot Password - Linkabee';
			  var content = new sghelper.Content('text/html', 
			  				`
								<center>
									<h1 style="font-size:24px;text-align:center;font-weight:bold">Password reset</h1><br>
									<p style="font-family:Helvetica,Arial,sans-serif;font-size:16px">
										Hi ` + user.full_name + `, you've told us you have forgotten the password to your Linkabee
										<br>account. No worries, just click the button below to create a new password. 
										</p><br><br>
									<a href="http://localhost:3000/#/resetpassword/`+ user.email + `/` + user.password_reset_token + `" style="color:#fff;background-color:#5fc55f;border-color:#5fc55f;text-align:center;white-space:nowrap;vertical-align:middle;padding:16px 40px;font-size:16px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=http://localhost:3000/#/resetpassword/`+ user.email + `/` + user.password_reset_token + `;source=gmail&amp;ust=1492010089791000&amp;usg=AFQjCNE2T6vuKdKtGY5L-XxkO1Ft3hKxLw">CHANGE PASSWORD </a><br><br>
									<br><br>					
									<br>
									<p>The Linkabee Support Team</p>
								</center>									
			  				`);
			  var mail = new sghelper.Mail(from_email, subject, to_email, content);
			  var request = sendgrid.emptyRequest({
			    method: 'POST',
			    path: '/v3/mail/send',
			    body: mail.toJSON(),
			  });
			  sendgrid.API(request, function(error, response) {
			  	debugger;
			    if(error)
			      return reject({
			        status: 401,
			        message: error.errors
			      });
			    else
			      return resolve({
			        status: 200,
			        message: "sent"
			      });
			  });				
			})
		})
	})
}