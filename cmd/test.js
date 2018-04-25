const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    console.log("You hit sth for testing purpose.");
    
    return message.channel.send("hmmm....");
}

module.exports.help = {
	name: "test",
	cmd: "test"
}