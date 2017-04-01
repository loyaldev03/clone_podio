var mongoose = require('mongoose');

var WorkspaceSchema = new mongoose.Schema({
	title: String,
	description: String,
	access: String,
	default_appp: {type: mongoose.Schema.Types.ObjectId, ref: 'Appp'},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	appps: [{type: mongoose.Schema.Types.ObjectId, ref: 'Appp'}],
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('Workspace', WorkspaceSchema);