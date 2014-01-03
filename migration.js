COMMENT THIS LINE (this script destroys all database data and populates it by data from http://graph.pirati.cz)

require('./init');

User.destroyAll();
Group.destroyAll();

var restify = require('restify');
var graph = restify.createJsonClient({
  url: 'https://graph.pirati.cz'
});

function get(url, cb) {
    graph.get(url, function(err, req, res, objects) {
	if (err) { console.log('Graph API err:' + err); }
	cb(objects);
    });
}

function validateSave(record, cb) {
    console.log(record)
    record.isValid(function(valid) {
        if (valid) {
    	    record.save(function (err) {
    		if (err) console.log(err);
		cb();
    	    });
        } else {
    	    console.log(record.errors);
        }
    });
}

function bindGroupUsers(group) {
    get('/group/'+group.name+'/members', function (objects) {
	if (objects && typeof objects.forEach === 'function') {
	    objects.forEach(function (obj) {
		console.log('Binding %s to %s', obj.username, group.name);
		if (users[obj.id]) users[obj.id].groups.add(group, console.log);
	    });
	} else {
	    console.log('ERROR');
	    console.log(objects);
	}
    });
}

var users = {};
var groups = {};

get('/groups', function(objects) {
    objects.forEach(function (obj) {
	groups[obj['id']] = new Group ({
    	    'name':	obj['username']
	});
    });

    get('/users', function(objects) {
	objects.forEach(function (obj) {
	    console.log(obj);
	    var uid = obj['id'];
	    obj['id'] = null;
	    users[uid] = new User(obj);
	});

	Object.keys(groups).forEach(function (gid) {
	    bindGroupUsers(groups[gid]);
	    validateSave(groups[gid], console.log)
	});

	Object.keys(users).forEach(function (uid) {
	    validateSave(users[uid], console.log)
	});

    });

});

