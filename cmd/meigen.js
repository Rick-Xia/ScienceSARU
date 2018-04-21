const Discord = require("discord.js");
const meigenCollection = require('../localdata/meigen.json');

module.exports.run = async (bot, message, args) => {

    let id = Math.floor(Math.random() * 5).toString();
    let meigen = meigenCollection[id];
    let meigenembed = new Discord.RichEmbed()
    .setDescription("名言" + meigen.id)
    .setColor("#ff9933")
    .setThumbnail(bot.user.displayAvatarURL)
    .addField("Line", meigen.line)
    .addField("Translation(CHN)", meigen.trans);

    return message.channel.send(meigenembed);
}

module.exports.help = {
	name: "meigen",
    cmd: "meigen"
}