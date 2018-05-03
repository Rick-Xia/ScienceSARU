const Discord = require("discord.js");
const https = require('https');
const dbsearch = require('../bin/dbSearch.js');
const secToHMS = require('../bin/secToHMS.js');

const DEFAULTPATH = '/api/v1/players/';
const OPERATOR = 'operators/'
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

const ignoredAttri = ['has_played', 'bullets_fired', 'bullets_hit'];

/*
    Helper function that automaticaly load stat from json object
 */
function collectStats(stats, part, embed) {
    let collect = stats[part];
    let detail = "";

    for ( let attri in collect ) {
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

/*
    Helper functions that find the operator in both atk and def that
     the user played the most
 */
function findMostPlayedOps(records) {
    let retOps = { "mpATK": {"stats" : {
        "played": -1
    }, "operator": {
        "role": "atk"
    }},
        "mpDEF": {"stats" : {
        "played": -1
    }, "operator": {
        "role": "def"
    }}};

    for ( let op in records ) {
        if ( op.operator.role === "atk" ) {
            if ( op.stats.played > retOps.mpATK.stats.played ) retOps.mpATK = op;
        } else {
            if ( op.stats.played > retOps.mpDEF.stats.played ) retOps.mpDEF = op;
        }
    }

    return retOps; 
}

module.exports.run = async (bot, message, args) => {
    let id;

    /*
        If no id provided, try using the binded id of the user
     */
    if ( args.length == 0 ) {
        id = dbsearch.get( message.author.id );

        /*
            If no binded id found for this user
         */
        if ( id === "" )
            return message.channel.send("What's your ID? \`-r6 [uplayID]\`")
                    .then(message.channel.send("Or you can bind your uplayid using \`-setUplay [uplayID]\`"));

        message.channel.send(`Querying using your binded ID \`${id}\``);
    } else {
        id = args[0];
    }

    OPTIONS.path = DEFAULTPATH + id + OPERATOR + PLATFORM;

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

            let records = obj.operator_records;
            let ops = findMostPlayedOps(records);
            let atkOps = ops.mpATK, defOps = ops.mpDEF;

            console.log(`most played atk op is ${JSON.stringify(atkOps)} and def op is ${JSON.stringify(defOps)}`);

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
            .addField("TIME PLAYED", secondsToHms(casual.playtime), true)

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
	name: "r6op",
	cmd: "r6op"
}