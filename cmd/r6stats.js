const Discord = require("discord.js");
const https = require('https');

const DefaultPath = '/api/v1/players/';
const platform = "/?platform=uplay";

let options = {
    host: 'api.r6stats.com',
    path: '',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

function secondsToHms(d) {
    d = Number(d);

    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return `${h}h ${m}m ${s}s`;
}

module.exports.run = async (bot, message, args) => {
    if ( args.length == 0 ) {
        return message.channel.send("What's your ID?")
        .then(msg => msg.channel.send("(Please add your ID after the command)"));      
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
            .setAuthor(`${player.username}@${player.platform} OVERALL STATS`, "https://i.imgur.com/uwf9FpF.jpg")
            .setColor(0x00AE86)
            .setThumbnail(`https://ubisoft-avatars.akamaized.net/${player.ubisoft_id}/default_146_146.png`)
            .addField("WIN %", (casual.wins/(casual.wins + casual.losses) * 100).toFixed(2) + "%", true)
            .addField("KILL/DIE", casual.kd, true)
            .addField("KILL", casual.kills, true)
            .addField("DEATH", casual.deaths, true)
            .addField("TIME PLAYED", secondsToHms(casual.playtime), true)
            .setTimestamp(`${player.updated_at}`)
            .setFooter("Recent update");
            
            if ( args[1] === "share" || args[1] === "s" ) {
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
