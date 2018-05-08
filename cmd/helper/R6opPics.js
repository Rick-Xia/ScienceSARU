const https = require('https');
const fs = require("fs");
const R6OPFILENAME = "./localdata/R6operators.json";

let operatorPics = JSON.parse(fs.readFileSync(R6OPFILENAME));

let OPTIONS = {
    host: 'ubistatic-a.akamaihd.net',
    path: '/0058/prod/assets/data/operators.79229c6d.json',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ScienceSARU: a personal discord bot'
    }
};

async function updatePics() {

	return new Promise((resolve, reject) => {

		let req = https.request(OPTIONS, (res) => {
	        let data = '';

	        console.log(OPTIONS.host + ':' + res.statusCode);

	        if ( res.statusCode !== 200 ) {
	            return console.log("Operators Picture Fetching Failed");
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
	            let result = {};

	            for ( let op in obj ) {
	            	result[op] = {
	            		"figure": obj[op].figure.small,
	            		"badge": obj[op].badge
	            	}
	            }

	        	fs.writeFileSync(R6OPFILENAME, JSON.stringify(result, null, 2));
	        	resolve();
	        });
	    });

	    req.on('error', (err) => {
	        res.send('error: ' + err.message);
	    });

	    req.end();
	});
}

async function fetchOperatorBadge( name ) {

	if ( !operatorPics.hasOwnProperty(name) ) {
		await updatePics()
		.then(() => {
			operatorPics = JSON.parse(fs.readFileSync(R6OPFILENAME));
		});

	}

	return operatorPics[name].badge;
}

module.exports = fetchOperatorBadge;
