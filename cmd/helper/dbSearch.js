const fs = require("fs");
const R6USERFILENAME = "./localdata/r6users.json";

let USERSFILE = fs.readFileSync(R6USERFILENAME), USERS = JSON.parse(USERSFILE);

module.exports.get = ( id ) => {

    return new Promise((resolve, reject) => {
        
        if ( USERS.hasOwnProperty(id) ) {
            resolve(USERS[id]);
        }

        reject(`fail to find one`);
    });
}

module.exports.post = ( id, val ) => {

    return new Promise((resolve, reject) => {
        USERS[id] = val;
        fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => {
            if (err) reject(err);
        });

        resolve();
    });
}

module.exports.put = ( id, val ) => {

    return new Promise((resolve, reject) => {
        USERS[id] = val;
        fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => {
            if (err) reject(err);
        });

        resolve();
    });
}

module.exports.delete = ( id ) => {

    return new Promise((resolve, reject) => {
        delete USERS[id];
        fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => {
            if (err) reject(err);
        });

        resolve();
    });
}
