var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	title: string,
	role: string,
	image: string,
	about: string,
	skills: string,
	email: string,
	phone: string,
	website: string,
	skype: string,
	linkedin: string,
	twitter: string,
	location: string,
	address: string,
	city: string,
	zip: string,
	state: string,
	country:string,
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
	workspaces: [{type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'}]
});

mongoose.model('User', UserSchema);