const Discord = require("discord.js");
const botconfig = require('../localdata/botconfig.json');

const prefix = botconfig.prefix;

module.exports.run = async (bot, message, args) => {

	let helpembed = new Discord.RichEmbed()
	.setDescription("Command list");

	bot.commands.forEach((f, i) => {
		helpembed.addField(i, `command: ${prefix}${f.help.cmd}`);
	});

	message.channel.send(helpembed);

	return;
}

module.exports.help = {
	name: "help",
	cmd: "help"
}