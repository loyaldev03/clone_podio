var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
	id: String,
	email: String,
	first: String,
	last: String,
	link: String,
	name: String,
	url: String,
	access_token: String,
	pages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Page'}],
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Account', AccountSchema);