const Discord = require("discord.js");
const fs = require("fs");

const R6USERFILENAME = "../localdata/r6users.json";

module.exports.run = async (bot, message, args) => {

    let USERS = require(R6USERFILENAME);

    if ( args.length <= 0 || args.length >= 2 ) {
        return message.channel.send(`Plz use the correct form.`);
    }
    let r6id = args[0], username = message.author.username;

    if ( USERS.hasOwnProperty(username) ) {
        if ( USERS[username] === r6id ) {
            return message.channel.send(`No update made. Your default ID is still ${USERS[username]}`);
        } else {
            USERS[username] = r6id;
            fs.writeFile('./localdata/r6users.json', JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
            return message.channel.send(`Your default ID has been updated. Now is ${USERS[username]}`);
        }
    }

    USERS[username] = r6id;
    fs.writeFile('./localdata/r6users.json', JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    return message.channel.send(`Your default ID registered. Now is ${USERS[username]}`);
}

module.exports.help = {
	name: "setDefault",
	cmd: "setDefault"
}