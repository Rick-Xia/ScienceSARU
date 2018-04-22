const Discord = require("discord.js");
const https = require('https');

const DefaultPath = '/api/v1/players/';
const platform = "?platform=uplay";

var options = {
    host: 'api.r6stats.com',
    path: '',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

module.exports.run = async (bot, message, args) => {
    let id = args[0];
    options.path = DefaultPath + id + platform;

    var req = https.request(options, (res) => {
        console.log(options.path);

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
            var obj = JSON.parse(data);
            let stats = obj.player.stats;
            let casual = stats.casual;
            let statembed = new Discord.RichEmbed()
            .setDescription("Casual stats")
            .addField("WIN/LOSE RATE", casual.wlr)
            .addField("KILL/DIE", casual.kd);
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
