var config = require('config');
var MailSender = {};

MailSender.sendVerificationMessage = function(user) {
	return new Promise(function(resolve, reject) {
		const sendgrid = require('sendgrid')(config.get('Customer.SENDGRID_API_KEY'));
		const sghelper = require('sendgrid').mail;
	  var from_email = new sghelper.Email(config.get('Admin_Email'));
	  var to_email = new sghelper.Email(user.username);
	  var subject = 'Actodo.co Pasword Reset Token';
	  var content = new sghelper.Content('text/html', 
	           `<p> Thank you for reaching us </p>
	            <p> <a href="` + `http://localhost:3000` + `/#/activate/`+user._id+`">Please verify your account here</a></p>`);
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

module.exports = MailSender;
