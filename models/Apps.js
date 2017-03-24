var mongoose = require('mongoose');

var AppSchema = new mongoose.Schema({
	name: string,
	type: string,
	app_icon: string,
	workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'},
	items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('App', AppSchema);