const fs = require("fs");
const R6USERFILENAME = "./localdata/r6users.json";

let USERSFILE = fs.readFileSync(R6USERFILENAME), USERS = JSON.parse(USERSFILE);

module.exports.get = ( id, next ) => {
    if ( USERS.hasOwnProperty(id) ) next(USERS[id]);
    else next();
}

module.exports.post = async ( id, val, next ) => {
    USERS[id] = val;
    fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    next();
}

module.exports.put = async ( id, val, next ) => {
    USERS[id] = val;
    fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    next();
}

module.exports.delete = async ( id, next ) => {
    delete USERS[id];
    fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    next();
}
