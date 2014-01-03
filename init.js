var conf;

try {
    conf = require('./config');
} catch(err){
    conf = {
        listenPort: 443,
        dbSchema: 'mongodb',
        dbOptions: {
	    url: 'mongodb://localhost/api'
        },
        sslKey: './ssl/ssl-cert.key',
        sslCertificate: './ssl/ssl-cert.pem'
    };
}

module.exports = conf;

DB = require('./lib/model');

