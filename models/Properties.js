var mongoose = require('mongoose');

var PropertySchema = new mongoose.Schema({
	contact_info: {
		type: mongoose.Schema.Types.Mixed
	},
	address: {
		type: mongoose.Schema.Types.Mixed
	},
	lead_info: {
		type: mongoose.Schema.Types.Mixed
	},
	property_info: {
		type: mongoose.Schema.Types.Mixed
	},
	property_questionnaire: {
		type: mongoose.Schema.Types.Mixed
	},
	status: {
		type: mongoose.Schema.Types.Mixed
	},
	files: {
		type: mongoose.Schema.Types.Mixed
	},
	workspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Workspace'}
});

mongoose.model('Property', PropertySchema);