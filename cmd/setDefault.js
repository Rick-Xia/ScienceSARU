const Discord = require("discord.js");
const fs = require("fs");

var USERS;
fs.readFile('../localdata/r6users.json', 'utf8', function (err, data) {
    if (err) throw err;
    USERS = JSON.parse(data);
});

module.exports.run = async (bot, message, args) => {
    console.log(`the author id is ${message.author.id}`);
    console.log(`the author id is ${message.author.username}`);

    let id = args[0];

}

module.exports.help = {
	name: "setDefault",
	cmd: "setDefault"
}