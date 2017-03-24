var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
	name: string,
	app: {type: mongoose.Schema.Types.ObjectId, ref: 'App'},
	fields: [{type: mongoose.Schema.Types.ObjectId, ref: 'Field'}],
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('Item', ItemSchema);