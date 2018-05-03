const Discord = require("discord.js");
const https = require('https');
const botconfig = require('../localdata/botconfig.json');

const timeHelper = require('../bin/secToHMS.js');
const mongoose = require('mongoose');

let db;
if ( mongoose.connection.readyState ) {
    db = require('../bin/mongodbSearch.js');
} else {
    db = require('../bin/dbSearch.js');
}

const DEFAULTPATH = '/api/v1/players/';
const PLATFORM = "/?platform=uplay";
const PANELCOLOR = 0x00AE86;
const PREFIX = botconfig.prefix;

let OPTIONS = {
    host: 'api.r6stats.com',
    path: '',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ScienceSARU: a personal discord bot'
    }
};

const ignoredAttri = ['has_played', 'bullets_fired', 'bullets_hit'];

/*
    Helper function that automaticaly load stat from json object
 */
function collectStats ( stats, part, embed ) {
    let collect = stats[part];
    let detail = "";

    for ( let attri in collect ) {
        if ( ignoredAttri.includes(attri) ) continue;

        let val = collect[attri];
        if ( attri === "playtime" ) {
            val = timeHelper.secToHMS(val);
        }
        attri = attri.replace(/_/g, ' ');
        attri = attri.charAt(0).toUpperCase()+attri.slice(1);

        detail += `**${attri}:** ${val}\n`;
    }
    embed.addField(part.toUpperCase(), detail, true);
}

module.exports.run = async ( bot, message, args ) => {

    let share = false, queryId = "";
    if ( args.length > 0 && args[0].charAt(0) === PREFIX ) {
        if ( args[0].slice(1) === "s" || args[0].slice(1) === "share" ) {
            share = true;
        }
        args.shift();
    }

    switch( args.length ) {
        case 0:
            await db.get( message.author.id )
                .then((result) => {
                    message.channel.send(`Querying using your binded ID \`${result}\``);
                    queryId = result;
                })
                .catch((err) => {
                    return message.channel.send("What's your ID? \`-r6 [uplayID]\`")
                            .then(message.channel.send("Or you can bind your uplayid using \`-setUplay [uplayID]\`"));
                });
            break;

        case 1:
            queryId = args[0];
            break;
        default:
            return message.channel.send("Please input correct id \`-r6 [uplayID]`");
    }

    OPTIONS.path = DEFAULTPATH + queryId + PLATFORM;

    let req = https.request(OPTIONS, (res) => {
        let data = '';

        console.log(OPTIONS.host + ':' + res.statusCode);

        if ( res.statusCode !== 200 ) {
            return message.channel.send("No results found...");
        }

        /*
            A chunk of data has been recieved.
         */
        res.on('data', (chunk) => {
            data += chunk;
        });
         
        /*
            The whole response has been received. Print out the result.
         */
        res.on('end', () => {
            let obj = JSON.parse(data);

            let player = obj.player;
            let stats = player.stats;
            let casual = stats.casual;
            let ranked = stats.ranked;

            /*
                Panel for overall stats
             */
            let overallEmbed = new Discord.RichEmbed()
            .setAuthor(`${player.username}@${player.platform==="uplay"? "PC" : player.platform} - OVERALL STATS`, "https://i.imgur.com/uwf9FpF.jpg")
            .setColor(PANELCOLOR)
            .setThumbnail(`https://ubisoft-avatars.akamaized.net/${player.ubisoft_id}/default_146_146.png`)
            .addField("KILL", casual.kills+ranked.kills, true)
            .addField("DEATH", casual.deaths+ranked.deaths, true)
            .addField("K/D", ((casual.kills+ranked.kills)/(casual.deaths+ranked.deaths)).toFixed(3), true)
            .addField("LEVEL", stats.progression.level, true)
            .addField("WIN %", (casual.wins/(casual.wins + casual.losses) * 100).toFixed(2) + "%", true)
            .addField("TIME PLAYED", timeHelper.secToHMS(casual.playtime), true)

            /*
                Panel for detail stat (Casual & Ranked)
             */
            let detailEmbed = new Discord.RichEmbed()
            .setColor(PANELCOLOR)
            .setTimestamp(`${player.updated_at}`)
            .setFooter("Recent update");
            collectStats(stats, "casual", detailEmbed);
            collectStats(stats, "ranked", detailEmbed);
            collectStats(stats, "overall", detailEmbed);

            if (share) {
                message.channel.send(overallEmbed);
                message.channel.send(detailEmbed);
            } else {
                message.author.send(overallEmbed)
                .then(message.author.send(detailEmbed));
            }

        });
    });

    req.on('error', (err) => {
        res.send('error: ' + err.message);
    });

    req.end();
}

module.exports.help = {
	name: "r6",
	cmd: "r6"
}
