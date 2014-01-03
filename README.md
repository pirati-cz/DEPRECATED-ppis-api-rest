pirati-api
----------

# REST API for pirati.cz

This is just a prototype/alpha application as a base for further development.

## CONFIGURATION

Configuration is in init.js file. If you want your own configuration ignored by git and npm create config.js with following content:

``` javascript
module.exports = {
    listenPort: 443,
    dbSchema: 'mongodb',
    dbOptions: {
        url: 'mongodb://localhost/api'
    },
    sslKey: './ssl/ssl-cert.key',
    sslCertificate: './ssl/ssl-cert.pem'
};
```
And change it to your values


### Server

443 is default https port. If you want to run server on another port (for example there is already a service listening on https on your server), change listenPort

``` javascript
    listenPort: 443,
```


### Database

API uses jugglingdb ORM. Update dbconf to change database details. If you want to use something else than MongoDB, install the adapter for your DB by npm install jugglingdb-<adapter>

See https://npmjs.org/package/jugglingdb for more details.

Otherwise this settings is for MongoDB running on localhost with auth=false and with database called 'api'

``` javascript
    dbSchema: 'mongodb',
    dbOptions: {
        url: 'mongodb://localhost/api'
    }
```


### SSL

API runs on https. You will need to configure SSL key and certificate files. Use same files you would use for Apache HTTPS configuration.

``` javascript
    sslKey: '/path/to/the/key.key',
    sslCertificate: './path/to/the/certificate.pem'
```

## MIGRATION

This is necessary until we have better source of data. Without this step the database will be empty.

Run:
```
nodejs migration.js
```

Wait until all the data from http://graph.pirati.cz is imported.

Ctrl+C to exit.

NOTICE: this destroys all corresponding collections/relations at the beginning. Comment first line to avoid syntax error blocking the execution of the script.


## RUNNING

You can run the API from command line as root (or another user allowed to listen on a port) by:

```
nodejs index.js
```

It should display message that its listening on https://0.0.0.0:443 (depending on your listenPort setting)

Browse your root URL to get basic info about usage of the API (or see public/index.html)

## TODO

- better structure of files and also the code (create internal js API and use restify to wrap it) or use separate packages
- agree on the schema (current schema is just for illustration)
- allow usage of ID in the REST requests as an addition to username or name (GET /user/ID of just GET /ID)
- static content?
- caching
- OAuth2

## LICENSE

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

