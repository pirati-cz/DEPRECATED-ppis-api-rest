User = require('./user');

var Group = require('./schema').define('Group', {
    name:	String,
    created_at:	{ type: Date, default: function() { return new Date; } },
    updated_at:	{ type: Date, default: function() { return new Date; } }
});
Group.validatesUniquenessOf('name', { message: 'name is not unique' });
module.exports = Group;
