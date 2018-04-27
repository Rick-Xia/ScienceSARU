const Discord = require("discord.js");
const fs = require("fs");

const R6USERFILENAME = "./localdata/r6users.json";

module.exports.run = async (bot, message, args) => {

    // Get user data from the databse
    let USERSFILE = fs.readFileSync(R6USERFILENAME);
    let USERS = JSON.parse(USERSFILE);
    let r6id = args[0], username = message.author.username;

    // If the number arguments is NOT right, give default response
    if ( args.length <= 0 || args.length >= 2 ) {
        if ( USERS.hasOwnProperty(username) ) {
            return message.channel.send(`Your default ID is ${USERS[username]}`);
        } else {
            return message.channel.send(`Tell me the uplay ID you want to bind? \`-setDefault [uplayid]\``);
        }
    }

    // If the user is about to unbinded its ID
    if ( r6id === "-d" ) {
        if ( USERS.hasOwnProperty(username) ) {
            delete USERS[username];
            fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
            return message.channel.send(`Your ID has been unbinded.`);
        } else {
            return message.channel.send(`Unbind failed. Your default ID is not registered`);
        }
    }

    // Search database for the user to update
    if ( USERS.hasOwnProperty(username) ) {
        if ( USERS[username] === r6id ) {
            return message.channel.send(`No update made. Your default ID is still ${USERS[username]}`);
        } else {
            USERS[username] = r6id;
            fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
            return message.channel.send(`Your default ID has been updated. Now is ${USERS[username]}`);
        }
    }

    // If the user has registered its ID, create a new one for it
    USERS[username] = r6id;
    fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    return message.channel.send(`Your default ID registered. Now is ${USERS[username]}`);
}

module.exports.help = {
	name: "setDefault",
	cmd: "setDefault"
}