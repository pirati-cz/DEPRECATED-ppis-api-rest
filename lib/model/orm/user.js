Group = require('./group');
var schema = require('./schema');

var User = schema.define('User', {
    username:	String,
    fullname:	String,
    rank:	String,
    email:	String,
    created_at:	{ type: Date, default: function() { return new Date; } },
    updated_at:	{ type: Date, default: function() { return new Date; } }
});
User.validatesUniquenessOf('username', { message: 'username is not unique' });
module.exports = User;
