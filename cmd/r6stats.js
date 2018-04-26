const Discord = require("discord.js");
const https = require('https');

const DEFAULTPATH = '/api/v1/players/';
const PLATFORM = "/?platform=uplay";
const PANELCOLOR = 0x00AE86;

let OPTIONS = {
    host: 'api.r6stats.com',
    path: '',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ScienceSARU: a personal discord bot'
    }
};

function secondsToHms(d) {
    d = Number(d);

    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return `${h}h ${m}m ${s}s`;
}

const ignoredAttri = ['has_played', 'bullets_fired', 'bullets_hit'];

function collectStats(stats, part, embed) {
    let collect = stats[part];
    let detail = "";

    for ( var attri in collect ) {
        if ( ignoredAttri.includes(attri) ) continue;

        let val = collect[attri];
        if ( attri === "playtime" ) {
            val = secondsToHms(val);
        }
        attri = attri.replace(/_/g, ' ');
        attri = attri.charAt(0).toUpperCase()+attri.slice(1);

        detail += `**${attri}:** ${val}\n`;
    }
    embed.addField(part.toUpperCase(), detail, true);
}

module.exports.run = async (bot, message, args) => {
    if ( args.length == 0 ) {
        return message.channel.send("What's your ID?")
        .then(msg => msg.channel.send("(Please add your ID after the command)"));      
    }

    let id = args[0];
    OPTIONS.path = DEFAULTPATH + id + PLATFORM;

    let req = https.request(OPTIONS, (res) => {
        let data = '';

        console.log(OPTIONS.host + ':' + res.statusCode);

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
            .setColor(PANELCOLOR)
            .setThumbnail(`https://ubisoft-avatars.akamaized.net/${player.ubisoft_id}/default_146_146.png`)
            .addField("KILL", casual.kills+ranked.kills, true)
            .addField("DEATH", casual.deaths+ranked.deaths, true)
            .addField("K/D", ((casual.kills+ranked.kills)/(casual.deaths+ranked.deaths)).toFixed(3), true)
            .addField("LEVEL", stats.progression.level, true)
            .addField("WIN %", (casual.wins/(casual.wins + casual.losses) * 100).toFixed(2) + "%", true)
            .addField("TIME PLAYED", secondsToHms(casual.playtime), true)

            let detailEmbed = new Discord.RichEmbed()
            .setColor(PANELCOLOR)
            .setTimestamp(`${player.updated_at}`)
            .setFooter("Recent update");
            collectStats(stats, "casual", detailEmbed);
            collectStats(stats, "ranked", detailEmbed);
            collectStats(stats, "overall", detailEmbed);
            
            if ( args[1] === "share" || args[1] === "s" ) {
                message.channel.send(overallEmbed);
                message.channel.send(detailEmbed);
            } else {
                message.author.send(overallEmbed)
                .then(message.author.send(detailEmbed))
                .then(message.channel.send("Found yours~ Take a look at your PM"));
            }
        });
    });

    req.on('error', (err) => {
        res.send('error: ' + err.message);
    });

    req.end();

    return message.channel.send("Working hard on seraching...");
}

module.exports.help = {
	name: "r6stats",
	cmd: "r6stats"
}
