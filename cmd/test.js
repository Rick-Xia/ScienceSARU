const Discord = require("discord.js");
const mongoose = require('mongoose');

// const MongoDBSearch = require('../bin/mongodbSearch.js');
// const opPic = require('../bin/R6opPics.js');

module.exports.run = async (bot, message, args) => {
    let temp = 0;

    return message.channel.send(temp);
}

module.exports.help = {
	name: "test",
	cmd: "test"
}