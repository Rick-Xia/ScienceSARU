const fs = require("fs");
const R6USERFILENAME = "./localdata/r6users.json";

let USERSFILE = fs.readFileSync(R6USERFILENAME), USERS = JSON.parse(USERSFILE);

function ReadDB() {
    let USERSFILE = fs.readFileSync(R6USERFILENAME);
    let USERS = JSON.parse(USERSFILE);
}

module.exports.get = ( id ) => {
    ReadDB();
    return USERS.hasOwnProperty(id)? USERS[id] : "";
}

module.exports.post = ( id, val ) => {
    ReadDB();
    return USERS.hasOwnProperty(id)? USERS[id] : "";
}

module.exports.put = ( id, val ) => {
    ReadDB();
    return USERS.hasOwnProperty(id)? USERS[id] : "";
}

module.exports.delete = ( id ) => {
    ReadDB();
    return USERS.hasOwnProperty(id)? USERS[id] : "";
}
