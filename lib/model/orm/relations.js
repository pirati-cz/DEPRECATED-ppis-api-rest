User.hasAndBelongsToMany(Group, { as: 'groups', model: 'Group', linkTable: 'UserGroup' });
Group.hasAndBelongsToMany(User, { as: 'users', model: 'User', linkTable: 'UserGroup' });
