const Discord = require("discord.js");
const https = require('https');
const operatorPics = require('../localdata/R6operators.json')

const mongoose = require('mongoose');
let db = ( mongoose.connection.readyState )? require('./helper/mongodbSearch.js') : require('./helper/dbSearch.js');

const timeHelper = require('./helper/timehelper.js');

const DEFAULTPATH = '/api/v1/players/';
const OPERATOR = '/operators'
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
            val = timeHelper.secToHMS(val);
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
    let retOps = { 
        "mpATK": {
            "stats" : {
                "played": -1
            },
            "operator": {
                "role": "atk"
            }
        },
        "mpDEF": {
            "stats" : {
                "played": -1
            },
            "operator": {
                "role": "def"
            }
        }
    };

    for ( let i = 0; i < records.length; ++i ) {
        let op = records[i];
        if ( op.operator.role === "atk" ) {
            if ( op.stats.played > retOps.mpATK.stats.played ) retOps.mpATK = op;
        } else {
            if ( op.stats.played > retOps.mpDEF.stats.played ) retOps.mpDEF = op;
        }
    }

    return retOps; 
}

function createOpEmbed( queryId, op ) {
    let opEmbed = new Discord.RichEmbed()
    .setAuthor(`${queryId}@PC - MOST USED OP`, "https://i.imgur.com/uwf9FpF.jpg")
    .setColor(PANELCOLOR)
    .setTitle(`Most played attack operator: ${op.operator.name}`)
    .setThumbnail(operatorPics[(op.operator.name).toLowerCase()].badge)
    .setImage(operatorPics[(op.operator.name).toLowerCase()].figure.small)
    .addField("TIME PLAYED", timeHelper.secToHMS(op.stats.playtime), true)
    .addField("Round Played", op.stats.played, true)
    .addField("WIN %", (op.stats.wins/(op.stats.wins + op.stats.losses) * 100).toFixed(2) + "%", true)
    .addField("K/D", (op.stats.kills/op.stats.deaths).toFixed(3), true)
    .addField("Kill per Round", (op.stats.kills/op.stats.played).toFixed(3), true)
    .addField("Death per Round", (op.stats.deaths/op.stats.played).toFixed(3), true);

    return opEmbed;
}

module.exports.run = async (bot, message, args) => {
    let queryId;

    switch( args.length ) {
        case 0:
            queryId = await db.get( message.author.id )
                .catch((err) => {
                    message.channel.send("What's your ID :)? You can tell me using:")
                    .then(message.channel.send(` * \`-r6op [uplayID]\` to directly tell me`)
                        .then(message.channel.send(` * \`-setUplay [uplayID]\` to register your default Uplay id`)));
                });

            if (queryId) message.channel.send(`Querying using your binded ID \`${queryId}\``);
            else return;

            break;

        case 1:
            queryId = args[0];
            break;
        default:
            return message.channel.send("Please input your correct id \`-r6op [uplayID]`");
    }

    OPTIONS.path = DEFAULTPATH + queryId + OPERATOR + PLATFORM;

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

            let attackEmbed = new Discord.RichEmbed()
            .setAuthor(`${queryId}@PC - MOST USED OP`, "https://i.imgur.com/uwf9FpF.jpg")
            .setColor(PANELCOLOR)
            .setTitle(`Most played attack operator: ${atkOps.operator.name}`)
            .setThumbnail(operatorPics[(atkOps.operator.name).toLowerCase()].badge)
            .setImage(operatorPics[(atkOps.operator.name).toLowerCase()].figure.small)
            .addField("TIME PLAYED", timeHelper.secToHMS(atkOps.stats.playtime), true)
            .addField("Round Played", atkOps.stats.played, true)
            .addField("WIN %", (atkOps.stats.wins/(atkOps.stats.wins + atkOps.stats.losses) * 100).toFixed(2) + "%", true)
            .addField("K/D", (atkOps.stats.kills/atkOps.stats.deaths).toFixed(3), true)
            .addField("Kill per Round", (atkOps.stats.kills/atkOps.stats.played).toFixed(3), true)
            .addField("Death per Round", (atkOps.stats.deaths/atkOps.stats.played).toFixed(3), true);

            let defEmbed = createOpEmbed(defOps);
             
            message.channel.send(attackEmbed);
            message.channel.send(defEmbed);
            
            // if ( args[1] === "share" || args[1] === "s" ) {
            //     message.channel.send(overallEmbed);
            //     message.channel.send(detailEmbed);
            // } else {
            //     message.author.send(overallEmbed)
            //     .then(message.author.send(detailEmbed))
            //     .then(message.channel.send("Found yours~ Take a look at your PM"));
            // }
        });
    });

    req.on('error', (err) => {
        res.send('error: ' + err.message);
    });

    req.end();
}

module.exports.help = {
	name: "r6op",
	cmd: "r6op"
}
