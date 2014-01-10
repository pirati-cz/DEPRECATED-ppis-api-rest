
    Q = require('q')
    fs = require('fs')
    PPIS = require('ppis')

    class REST

The `deferred` variable for promising

      deferred = Q.defer()

Define `self` to be used for passing `this` down the scope

      self = null

      constructor: (@options) ->
        @promise = deferred.promise
        self = @

        if not @options.formatters
          @options.formatters = {}
          @options.formatters['application/json; q=0.9'] = @formatJSON

        @options.listenPort ?= 443

        if @options.ssl
          if @options.sslKeyFile and @options.sslCertificateFile
            @options.certificate = fs.readFileSync(@options.sslCertificateFile)
            @options.key = fs.readFileSync(@options.sslKeyFile)
          else
            console.warn('SSL option requires you to specify sslKey and sslCert. Starting without SSL.')

        @options.name = 'PPIS'

        @server = require('restify').createServer(@options)
        @server.domain = 'gollum.klapka.cz'

        @ppis = new PPIS();
        @ppis.promise.then((ppis) ->
          self.setupRoutes()
          deferred.resolve(self)
        )

      formatJSON: (req, res, body) ->
        if body instanceof Error
          res.statusCode = body.statusCode || 500
          if body.body
            body = body.body
          else
            body = message: body.message
        else
          if (Buffer.isBuffer(body))
            body = body.toString('base64')
        data = JSON.stringify(body, null, '  ')
        res.setHeader('Content-Length', Buffer.byteLength(data))
        data

      sendJson: (res, json) ->
        res.charSet('utf-8')
        res.json(json)

      passData: (res, type, data) ->
        res.writeHead(200,
          'Content-Length': data.length,
          'Content-Type': type
        )
        res.write(data)
        res.end()

      setupRoutes: () ->
        server = self.server;
        User = self.ppis.model.User
        Group = self.ppis.model.Group
        Permission = self.ppis.model.Permission

        server.get('/', (req, res, next) ->
          data = fs.readFileSync('./public/index.html')
          self.passData(res, 'text/html', data.toString().replace(/https:\/\/example\.com/g, 'https://'+server.domain));
        )

        server.get('/README.md', (req, res, next) ->
          data = fs.readFileSync('./README.md')
          self.passData(res, 'text/x-markdown', data)
        )

        server.get('/favicon.ico', (req, res, next) ->
          data = fs.readFileSync('./public/favicon.ico')
          self.passData(res, 'image/x-icon', data)
        )

        server.get('/users', (req, res, next) ->
          User.all((err, data) -> self.sendJson(res, data))
        )

        server.get('/groups', (req, res, next) ->
          Group.all((err, data) -> self.sendJson(res, data))
        )

        server.get('/permissions', (req, res, next) ->
          Permission.all((err, data) -> self.sendJson(res, data))
        )

        server.get('/user/:username', (req, res, next) ->
          User.findOne(
            where: { username: req.params.username }
            order: 'created_at DESC'
          , (err, user) ->
            self.sendJson(res, user)
          )
        )

        server.get('/group/:name', (req, res, next) ->
          Group.findOne(
            where: { name: req.params.name }
            order: 'created_at DESC'
          , (err, group) ->
            self.sendJson(res, group)
          )
        )

        server.get('/permission/:name', (req, res, next) ->
          Permission.findOne(
            where: { name: req.params.name }
            order: 'created_at DESC'
          , (err, permission) ->
            self.sendJson(res, permission)
          )
        )

        server.get('/user/:username/groups', (req, res, next) ->
          User.findOne(
            where: { username: req.params.username },
            order: 'created_at DESC'
          , (err, user) ->
            user.groups((err, groups) ->
              self.sendJson(res, groups)
            )
          )
        )

        server.get('/user/:username/permissions', (req, res, next) ->
          User.findOne(
            where: { username: req.params.username },
            order: 'created_at DESC'
          , (err, user) ->
            user.permissions((err, permissions) ->
              self.sendJson(res, permissions)
            )
          )
        )

        server.get('/group/:name/members', (req, res, next) ->
          Group.findOne(
            where: { name: req.params.name },
            order: 'created_at DESC'
          , (err, group) ->
            group.users((err, users) ->
              self.sendJson(res, users)
            )
          )
        )

        server.get('/group/:name/permissions', (req, res, next) ->
          Group.findOne(
            where: { name: req.params.name },
            order: 'created_at DESC'
          , (err, group) ->
            group.permissions((err, permissions) ->
              self.sendJson(res, permissions)
            )
          )
        )

        server.get('/permission/:name/users', (req, res, next) ->
          Permission.findOne(
            where: { name: req.params.name },
            order: 'created_at DESC'
          , (err, permission) ->
            permission.users((err, users) ->
              self.sendJson(res, users)
            )
          )
        )

        server.get('/permission/:name/groups', (req, res, next) ->
          Permission.findOne(
            where: { name: req.params.name },
            order: 'created_at DESC'
          , (err, permission) ->
            permission.groups((err, groups) ->
              self.sendJson(res, groups)
            )
          )
        )

      start: () ->
        server = @server
        @server.listen(@options.listenPort, () ->
          console.log('%s listening at %s', server.name, server.url)
        )

      listen: @prototype.start

    module.exports = REST;
