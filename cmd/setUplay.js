const Discord = require("discord.js");
const fs = require("fs");
const mongoose = require('mongoose');

const botconfig = require('../localdata/botconfig.json');
const PREFIX = botconfig.prefix;

let db = ( mongoose.connection.readyState )? require('./helper/mongodbSearch.js') : require('./helper/dbSearch.js');

module.exports.run = async (bot, message, args) => {

    let discordID = message.author.id;

    /*
        If the number arguments is NOT right
     */
    if ( args.length >= 2 ) return message.channel.send(`Please use correct number of arguments`);

    /*
        If no argument provided, query the db (GET)
     */
    if ( args.length <= 0 ) {
        return db.get(discordID)
            .then((uplayID) => {
                return message.channel.send(`Your binded Uplay id is \`${uplayID}\``);
            })
            .catch((err) => {
                return message.channel.send(`Tell me the uplay ID you want to bind? \`-setUplay [uplayid]\``);
            });
    }

    /*
        If the user is about to unbinded its ID (DELETE)
     */ 
    if ( args[0].charAt(0) === PREFIX ) {
        if ( args[0].slice(1) === "d" || args[0].slice(1) === "delete" ) {
            return db.delete(discordID)
                .then(() => {
                    message.channel.send(`Your ID has been unbinded.`);
                })
                .catch((err) => {
                    message.channel.send(`Unbind failed. Your binded ID cannot be found`);
                })
        }
        else return message.channel.send(`Invalid options`);
    }

    let r6id = args[0];

    /*
        Search database for the user to update (PUT), create one if not pre-exist (POST)
     */
    return db.put(discordID, r6id)
        .then(() => {
            message.channel.send(`Your binded ID is now \`${r6id}\``);
        })
        .catch((err) => {
            message.channel.send(`Your default ID registered. Now is \`${r6id}\``)
        });

}

module.exports.help = {
	name: "setUplay",
	cmd: "setUplay"
}