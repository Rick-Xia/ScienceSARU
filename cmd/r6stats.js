const Discord = require("discord.js");
const https = require('https');

const DefaultPath = '/api/v1/players/';
const platform = "/?platform=uplay";

var options = {
    host: 'api.r6stats.com',
    path: '',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports.run = async (bot, message, args) => {
    if ( args.length == 0 ) {
        message.channel.send("What's your ID?");
        message.channel.send("(Use \"-r6stats yourID\" command)");
        return;
    }

    let id = args[0];
    options.path = DefaultPath + id + platform;

    let req = https.request(options, (res) => {
        let data = '';

        console.log(options.host + ':' + res.statusCode);

        if ( res.statusCode !== 200 ) {
            return message.channel.send("No results found...");
        }

        // A chunk of data has been recieved.
        res.on('data', (chunk) => {
          data += chunk;
        });
         
        // The whole response has been received. Print out the result.
        res.on('end', () => {
            let obj = JSON.parse(data);

            let player = obj.player;
            let stats = player.stats;
            let casual = stats.casual;
            let statembed = new Discord.RichEmbed()
            .setDescription("Casual stats")
            .setColor(0x00AE86)
            .addField("WIN %", casual.wlr)
            .addField("KILL/DIE", casual.kd)
            .setFooter("Updated at: " + player.updated_at);
            
            message.author.send(statembed);
            message.channel.send("Just found yours~ Take a look at your PM");
        });
    });

    req.on('error', (err) => {
        res.send('error: ' + err.message);
    });

    req.end();

    return message.channel.send("I'm working hard on seraching");
}

module.exports.help = {
	name: "r6stats",
	cmd: "r6stats"
}
