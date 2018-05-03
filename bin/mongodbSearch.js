const mongoose = require('mongoose');
const R6ids = require('../models/r6ids');

module.exports.get = ( id, next ) => {
    
    return new Promise((resolve, reject) => {
        R6ids.findOne({ discordID: id }, (err, user) => {
            if (err) reject(`${err}`);

            if (user) {
                console.log( `${user.discordID} : ${user.rssID}` );
                resolve(user.rssID);
            } else {
                reject(`fail to find one`);
            }
        });
    });

    // R6ids.findOne( { discordID: id }, (err, user) => {
    //     if (err) { console.log(`Error Happened: ${err}`); }

    //     if (user) {
    //         console.log( `${user.discordID} : ${user.rssID}` );
    //         next(user.rssID);
    //     } else {
    //         console.log(`fail to find one`);
    //         next();
    //     }
    // });
}

/*
    to create a new discordID-uplayID pair in database
 */
module.exports.post = async ( id, val, next ) => {
    R6ids.create( { discordID: id, rssID: val }, (err, model) => {
        if (err) { console.log(`Error Happened: ${err}`); }

        next();
    });
}

/*
    to modify an existing pair
 */
module.exports.put = async ( id, val, next ) => {
    R6ids.findOneAndUpdate( { discordID: id }, { $set: { rssID: val } }, (err) => {
        if (err) { console.log(`Error Happened: ${err}`); }

        next();
    });

}

module.exports.delete = async ( id, next ) => {
    R6ids.findOneAndRemove( { discordID: id }, (err) => {
        if (err) { console.log(`Error Happened: ${err}`); }

        next();
    });
}
