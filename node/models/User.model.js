'use strict';

var keystone = require('keystone'),
    Types = keystone.Field.Types,
    User = new keystone.List('User');

User.add({
    name: {
        type: String,
        required: true,
        index: true,
        initial: true
    },
    email: {
        type: Types.Email,
        initial: true,
        index: true
    },
    password: {
        type: Types.Password,
        initial: true
    }
}, 'Permissions', {
    isAdmin: {
        type: Boolean,
        label: 'Admin',
        index: true
    }
});
User.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});
User.defaultColumns = 'name, email, isAdmin';
User.register();
