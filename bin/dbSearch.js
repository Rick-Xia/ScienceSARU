const fs = require("fs");
const R6USERFILENAME = "./localdata/r6users.json";

let USERSFILE = fs.readFileSync(R6USERFILENAME), USERS = JSON.parse(USERSFILE);

module.exports.get = ( id ) => {
    return USERS.hasOwnProperty(id)? USERS[id] : "";
}

module.exports.post = async ( id, val ) => {
    USERS[id] = val;
    fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    return;
}

module.exports.put = async ( id, val ) => {
    USERS[id] = val;
    fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    return;
}

module.exports.delete = async ( id ) => {
    delete USERS[id];
    fs.writeFile(R6USERFILENAME, JSON.stringify(USERS, null, 2), (err) => { if (err) throw err; });
    return;
}
