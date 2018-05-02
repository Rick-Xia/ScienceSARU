const Discord = require("discord.js");
const MongoDBSearch = require('../bin/mongodbSearch.js');

module.exports.run = async (bot, message, args) => {
    // console.log("You hit sth for testing purpose.");

    let id = args[0];

    MongoDBSearch.get(id);
    //.catch(err => console.log('err catched'));
    
    return;
}

module.exports.help = {
	name: "test",
	cmd: "test"
}