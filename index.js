const Discord = require('discord.js');
const tokenfile = require('./token.json');
const botconfig = require('./localdata/botconfig.json');
const mongoose = require('mongoose');

const fs = require("fs");

const MONGOURL = 'mongodb://localhost:27017/SARU';
const ERRORMSG = "It's so busy here...I need money for the Antarctica anyway!";
const PREFIX = botconfig.prefix;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./cmd/", async (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find any commands.");
        return;
    }

    const mongoConnect = await mongoose.connect(MONGOURL)
    .then((db) => {
        console.log(`Connected to MongoDB SUCCESS`);
    }, (err) => { console.log(`Connection to MongoDB FAIL`) });

    jsfile.forEach((f, i) => {
        let props = require(`./cmd/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

    console.log(`ALL CMD LOADED!`);
});

bot.on("ready", async () => {
    console.log(`${bot.user.username} IS ONLINE!`);
    bot.user.setActivity('Customer\'s Complain in 7-11', { type: 'LISTENING' })
    //.then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);
    // may want to have a number of activities.
    // and changes every now and then
});

bot.on("message", async message => {
    if ( message.author.bot ) return;
    if ( message.channel.type === "dm" ) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if ( cmd.charAt(0) !== PREFIX ) return;

    let commandfile = bot.commands.get( cmd.slice(PREFIX.length) );

    if ( commandfile ) {
        commandfile.run( bot, message, args );
    }
    else {
        message.channel.send(ERRORMSG);
        message.channel.send("(Bot didn't seem to understand your command. Use \"-help\" to get the command list)");
    }

    return;
});

bot.login(tokenfile.token);
