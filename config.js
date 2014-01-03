
module.exports = {
    listenPort: 443,
    dbSchema: 'mongodb',
    dbOptions: {
	url: 'mongodb://localhost/api'
    },
    sslKey: './ssl/ssl-cert.key',
    sslCertificate: './ssl/ssl-cert.pem'
};
