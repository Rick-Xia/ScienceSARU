const Discord = require("discord.js");
const fs = require("fs");
const dbsearch = require('../bin/dbSearch.js');

const R6USERFILENAME = "./localdata/r6users.json";

module.exports.run = async (bot, message, args) => {

    /*
        Get user data from the databse
     */
    let r6id = args[0], username = message.author.username;

    /*
        If the number arguments is NOT right, give default response
     */
    if ( args.length <= 0 || args.length >= 2 ) {
        if ( dbsearch.get(username) !== "" ) {
            return message.channel.send(`Your default ID is ${dbsearch.get(username)}`);
        } else {
            return message.channel.send(`Tell me the uplay ID you want to bind? \`-setDefault [uplayid]\``);
        }
    }

    /*
        If the user is about to unbinded its ID
     */ 
    if ( r6id === "-d" ) {
        if ( dbsearch.get(username) !== "" ) {
            dbsearch.delete(username);
            return message.channel.send(`Your ID has been unbinded.`);
        } else {
            return message.channel.send(`Unbind failed. Your default ID is not registered`);
        }
    }

    /*
        Search database for the user to update
     */ 
    if ( dbsearch.get(username) !== "" )
        return bsearch.put(username, r6id)
            .then(message.channel.send(`Your binded ID is now ${dbsearch.get(username)}`));

    /* 
        If the user hasn't registered its ID, create a new one for it
     */ 
    return dbsearch.post(username, r6id)
        .then(message.channel.send(`Your default ID registered. Now is ${dbsearch.get(username)}`));
}

module.exports.help = {
	name: "setUplay",
	cmd: "setUplay"
}