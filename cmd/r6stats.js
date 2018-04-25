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
            .setAuthor(`${player.username}@${player.platform}`, "https://i.imgur.com/uwf9FpF.jpg")
            .setColor(0x00AE86)
            .setThumbnail(`https://ubisoft-avatars.akamaized.net/${player.ubisoft_id}/default_146_146.png`)
            .setDescription("Casual stats")
            .addField("WIN %", casual.wins/(casual.wins + casual.losses), true)
            .addField("KILL/DIE", casual.kd, true)
            .addField("KILL", casual.kills, true)
            .addField("DEATH", casual.deaths, true)
            .addField("Play Time", casual.playtime, true)
            .setTimestamp(`${player.updated_at}`)
            .setFooter("Recent update");
            
            if ( args[1] === "share" ) {
                message.channel.send(statembed);
            } else {
                message.author.send(statembed)
                .then(message.channel.send("Just found yours~ Take a look at your PM"));
            }
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
