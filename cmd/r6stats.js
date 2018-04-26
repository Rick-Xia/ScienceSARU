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

function collectStats(stats, part, embed) {
    let collect = stats[part];
    let detail = "";

    for ( var attri in collect ) {
        if ( attri === "has_played" ) continue;

        let val = collect[attri];
        if ( attri === "playtime" ) {
            val = secondsToHms(val);
        }
        attri = attri.replace(/_/g, ' ');
        detail += `**${attri.charAt(0).toUpperCase()+attri.slice(1)}:** ${val}\n`;
    }
    embed.addField(part.toUpperCase(), detail, true);
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
            let ranked = stats.ranked;
            let overallEmbed = new Discord.RichEmbed()
            .setAuthor(`${player.username}@${player.platform==="uplay"? "PC" : player.platform} - OVERALL STATS`, "https://i.imgur.com/uwf9FpF.jpg")
            .setColor(0x00AE86)
            .setThumbnail(`https://ubisoft-avatars.akamaized.net/${player.ubisoft_id}/default_146_146.png`)
            .addField("KILL", casual.kills+ranked.kills, true)
            .addField("DEATH", casual.deaths+ranked.deaths, true)
            .addField("K/D", ((casual.kills+ranked.kills)/(casual.deaths+ranked.deaths)).toFixed(3), true)
            .addField("LEVEL", stats.progression.level, true)
            .addField("WIN %", (casual.wins/(casual.wins + casual.losses) * 100).toFixed(2) + "%", true)
            .addField("TIME PLAYED", secondsToHms(casual.playtime), true)

            let detailEmbed = new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setTimestamp(`${player.updated_at}`)
            .setFooter("Recent update");
            collectStats(stats,"casual",detailEmbed);
            collectStats(stats,"ranked",detailEmbed);
            collectStats(stats,"overall",detailEmbed);
            
            if ( args[1] === "share" || args[1] === "s" ) {
                message.channel.send(overallEmbed);
                message.channel.send(detailEmbed);
            } else {
                message.author.send(overallEmbed)
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
