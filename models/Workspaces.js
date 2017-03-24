var mongoose = require('mongoose');

var WorkspaceSchema = new mongoose.Schema({
	title: string,
	access: string,
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	apps: [{type: mongoose.Schema.Types.ObjectId, ref: 'App'}],
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('Workspace', WorkspaceSchema);