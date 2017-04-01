var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
	title: string,
	due_date: Date,
	description: string,
	privacy: string,
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'},
	appp: {type: mongoose.Schema.Types.ObjectId, ref: 'Appp'},
	item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'}
});

mongoose.model('Task', TaskSchema);