const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const idSchema = new Schema(
	{
		discordID: {
			type: String,
			required: true
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

var R6id = mongoose.model('R6id', idSchema);

module.exports = R6id;
