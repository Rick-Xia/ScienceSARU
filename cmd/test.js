const Discord = require("discord.js");
const MongoDBSearch = require('../bin/mongodbSearch.js');

module.exports.run = async (bot, message, args) => {
    // MongoDBSearch.get(args[0], (id) => {
    // 	if ( id ) {
    // 		console.log(`get s: ${id}`);
    // 	} else {
    // 		console.log(`NO!`);
    // 	}
    // });

    // MongoDBSearch.post(args[0], args[1], (err) => {
    // 	// check if err happened
    // 	console.log(`no idea what happens now`);
    // });
    
    // MongoDBSearch.put(args[0], args[1], (err) => {
    // 	console.log(`no idea what happens now ver 2`);
    // });
 
    // MongoDBSearch.delete(args[0], (err) => {
    // 	console.log(`trying to do sth. should I add post middleware?`);
    // });

    return;
}

module.exports.help = {
	name: "test",
	cmd: "test"
}