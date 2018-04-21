const Discord = require('discord.js');
const tokenfile = require('./token.json');
const botconfig = require('./botconfig.json');

const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./cmd/", (err, files) => {
    
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find command.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./cmd/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

const errorMsg = "It's so busy here...I need money for the Antarctica anyway!";

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity('Customer\'s Complain in 7-11', { type: 'LISTENING' })
    .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);
    // may want to have a number of activities.
    // and changes every now and then
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm" ) return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);

    return message.channel.send(errorMsg + "\n\n(Bot didn't seem to understand your command)");

    if (cmd.charAt(0) === prefix) {

        console.log("cmd= " + cmd);
        console.log("args= " + args);

        let cmdContent = cmd.substring(1);

        // if (cmdContent === `meigen`) {
        //     const meigenCollection = require('./meigen.json');

        //     let id = Math.floor(Math.random() * 5).toString();
        //     let meigen = meigenCollection[id];
        //     let meigenembed = new Discord.RichEmbed()
        //     .setDescription("名言" + meigen.id)
        //     .setColor("#ff9933")
        //     .setThumbnail(bot.user.displayAvatarURL)
        //     .addField("Line", meigen.line)
        //     .addField("Translation(CHN)", meigen.trans);

        //     return message.channel.send(meigenembed);
        // }
        // else
                if (cmdContent === "r6stats") {
            const https = require('https');
            let id = args[0];
            let platform = "?platform=uplay";
            var options = {
                host: 'api.r6stats.com',
                path: '/api/v1/players/',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            options.path = options.path + id + platform;

            var req = https.request(options, (res) => {
                let data = '';

                console.log(options.host + ':' + res.statusCode);

                // A chunk of data has been recieved.
                res.on('data', (chunk) => {
                  data += chunk;
                });
                 
                // The whole response has been received. Print out the result.
                res.on('end', () => {
                    var obj = JSON.parse(data);
                    let stats = obj.player.stats;
                    let casual = stats.casual;
                    let statembed = new Discord.RichEmbed()
                    .setDescription("Casual stats")
                    .addField("WIN/LOSE RATE", casual.wlr)
                    .addField("KILL/DIE", casual.kd);
                    message.author.send(statembed);
                    message.channel.send("Just found yours~ Take a look at your PM");
                    if ( casual.kd < 1.59 ) {
                        message.channel.send("Your KDA is even lower than Macie Jay!");
                    }
                });
            });

            req.on('error', (err) => {
                res.send('error: ' + err.message);
            });

            req.end();

            return message.channel.send("I'm working hard on seraching");
        }
        // else if (cmdContent === `botinfo`) {
        //     let bicon = bot.user.displayAvatarURL;

        //     let botembed = new Discord.RichEmbed()
        //     .setDescription("Bot Information")
        //     .setColor("#ff9933")
        //     .setThumbnail(bicon)
        //     .addField("Bot Name", bot.user.username)
        //     .addField("Created On", bot.user.createdAt);

        //     return message.channel.send(botembed);
        // }

        return message.channel.send(errorMsg + "\n\n(Bot didn't seem to understand your command)");
    }
});

bot.login(tokenfile.token);
