const mongoose = require('mongoose');

const idSchema = new mongoose.Schema(
	{
		discordID: {
			type: String,
			required: true,
			unique: true
		},
		rssID: {
			type: String,
			required: true
		}
	}, 
	{
		timestamps: true
	}
);

idSchema.post('save', function (doc) {
	console.log('%s has been saved', doc._id);
});

var R6id = mongoose.model('R6id', idSchema);

module.exports = R6id;
