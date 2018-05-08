const mongoose = require('mongoose');
const R6ids = require('../../models/r6ids');

module.exports.get = ( id ) => {

    return new Promise((resolve, reject) => {
        R6ids.findOne({ discordID: id }, (err, user) => {
            if (err) reject(err);

            if (user) resolve(user.rssID);

            else reject(`fail to find one`);
        });
    });
}

/*
    to create a new discordID-uplayID pair in database
 */
module.exports.post = ( id, val ) => {

    return new Promise((resolve, reject) => {
        R6ids.create({ discordID: id, rssID: val }, (err, model) => {
            if (err) reject(err);

            resolve();
        });
    });
}

/*
    to modify an existing pair
 */
module.exports.put = ( id, val ) => {

    return new Promise((resolve, reject) => {
        R6ids.findOneAndUpdate({ discordID: id }, { $set: { rssID: val }}, { upsert: true }, (err) => {
            if (err) reject(err);

            resolve();
        });
    });
}

module.exports.delete = ( id ) => {

    return new Promise((resolve, reject) => {
        R6ids.findOneAndRemove( { discordID: id }, (err) => {
            if (err) reject(err);

            resolve();
        });
    })
}
