var MailSender = {};

MailSender.sendVerificationMessage = function(email) {
	var helper = require('sendgrid').mail;
	var from_email = new helper.Email('johncarter19840502@gmail.com');
	var to_email = new helper.Email('johncarter19840502@gmail.com');
	var subject = "Hello World from the SendGrid Node.js Library!";
	var content = new helper.Content("text/plain", "Hello, Email!");
	var mail = new helper.Mail(from_email, subject, to_email, content);
	var config = require('config');	 
	var sg = require('sendgrid')(config.get('Customer.SENDGRID_API_KEY'));
	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON(),
	});
	 
	sg.API(request, function(error, response) {
		console.log("-------------------message send request---------------------");
	  console.log(response.statusCode);
	  console.log(response.body);
	  console.log(response.headers);
	});	
}

module.exports = MailSender;
