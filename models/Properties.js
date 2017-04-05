var mongoose = require('mongoose');

var PropertySchema = new mongoose.Schema({
	property_type: String,
	property_condition: String,
	beds: String,
	baths: String,
	workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'}
});

mongoose.model('Property', PropertySchema);