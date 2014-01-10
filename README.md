ppis-api-rest
-------------

# REST API for Pirate Party Information System

This is just an alpha application as a base for further development.


## CONFIGURATION

Database configuration is taken the default from PPIS module.

### SSL

API can listen on https. Use arguments: `--ssl --sslKey <sslKeyFile> --sslCert <sslCertificateFile>`.

## MIGRATION

Migration tool script is necessary until we have better source of data. Without this step the database will be empty.

Run:
```
FORCE=migrate ./tools/migration.js
```
Wait until all the data from http://graph.pirati.cz is imported.

Ctrl+C to exit.

NOTICE: this destroys all corresponding collections/relations at the beginning. Use FORCE=model env setting to enable execution.

## USAGE

You can run the server from command line as root (or another user allowed to listen on a port) by:

```
sudo ./bin/ppis-rest start --listenPort 443 --ssl --sslKey ./ssl/ssl-cert.key --sslCert ./ssl/ssl-cert.pem
```

It should display message that "PPIS listening on https://0.0.0.0:443"

Browse your root URL to get basic info about usage of the API (or see public/index.html)

## TODO

- allow usage of ID in the REST requests as an addition to username or name (GET /user/ID or just GET /ID)
- add option for listenAddress
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

