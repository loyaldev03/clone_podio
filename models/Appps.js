var mongoose = require('mongoose');

var ApppSchema = new mongoose.Schema({
	name: String,
	item_name: String,
	type: String,
	app_icon: String,
	workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'},
	items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
	fields: [{type: mongoose.Schema.Types.ObjectId, ref: 'Field'}],
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('Appp', ApppSchema);