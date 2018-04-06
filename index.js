const Discord = require('discord.js');
const tokenfile = require('./token.json');
const botconfig = require('./botconfig.json');

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("Crusader Kings II");
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm" ) return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if (cmd === `${prefix}meigen`) {
        const meigenCollection = require('./meigen.json');

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

    if (cmd === `${prefix}botinfo`) {
        let bicon = bot.user.displayAvatarURL;

        let botembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor("#ff9933")
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username)
        .addField("Created On", bot.user.createdAt);

        return message.channel.send(botembed);
    }
});

bot.login(tokenfile.token);
