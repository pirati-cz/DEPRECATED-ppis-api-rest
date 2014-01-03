conf = require('./init');

var restify = require('restify');
var fs = require('fs');

function formatJSON(req, res, body) {
        if (body instanceof Error) {
                res.statusCode = body.statusCode || 500;
                if (body.body) {
                        body = body.body;
                } else {
                        body = {
                                message: body.message
                        };
                }
        } else if (Buffer.isBuffer(body)) {
                body = body.toString('base64');
        }
        var data = JSON.stringify(body, null, '  ');
        res.setHeader('Content-Length', Buffer.byteLength(data));
        return (data);
}

var https_options = {
  certificate: fs.readFileSync(conf.sslCertificate),
  key: fs.readFileSync(conf.sslKey),
  formatters: {
    'application/json; q=0.9': formatJSON
  }
};

function sendJson(res, json) {
    res.charSet('utf-8');
    res.json(json);
}

var https_server = restify.createServer(https_options);

function passData(res, type, data) {
    res.writeHead(200, {
      'Content-Length': data.length,
      'Content-Type': type
    });
    res.write(data);
    res.end();
}

https_server.get('/', function (req, res, next) {
    data = fs.readFileSync('./public/index.html');
    passData(res, 'text/html', data);
});
https_server.get('/README.md', function (req, res, next) {
    data = fs.readFileSync('./README.md');
    passData(res, 'text/x-markdown', data);
});
https_server.get('/favicon.ico', function (req, res, next) {
    data = fs.readFileSync('./public/favicon.ico');
    passData(res, 'image/x-icon', data);
});
https_server.get('/users', function (req, res, next) {
    User.all(function(err, data) { sendJson(res, data); });
});
https_server.get('/groups', function (req, res, next) {
    Group.all(function(err, data) { sendJson(res, data); });
});
https_server.get('/user/:username', function (req, res, next) {
    User.findOne({
	where: { username: req.params.username },
        order: 'created_at DESC'
    }, function (err, user) {
        if (err) console.log(err);
        sendJson(res, user);
    });
});
https_server.get('/group/:name', function (req, res, next) {
    Group.findOne({
	where: { name: req.params.name },
        order: 'created_at DESC'
    }, function (err, group) {
        if (err) console.log(err);
        sendJson(res, group);
    });
});
https_server.get('/user/:username/groups', function (req, res, next) {
    User.findOne({
        where: { username: req.params.username },
        order: 'created_at DESC'
    }, function (err, user) {
        if (err) console.log(err);
        user.groups(function(err, groups) {
            sendJson(res, groups);
        });
    });
});
https_server.get('/group/:name/members', function (req, res, next) {
    Group.findOne({
                    where: { name: req.params.name },
                    order: 'created_at DESC'
                }, function (err, group) {
                    if (err) console.log(err);
                    group.users(function(err, users) {
                        sendJson(res, users);
                    });
    });
});

https_server.listen(conf.listenPort, function() {
  console.log('%s listening at %s', https_server.name, https_server.url);
});
