'use strict';

var keystone = require('keystone'),
    Types = keystone.Field.Types,
    Activity = new keystone.List('Activity');

Activity.add({
    type: {
        type: Types.Select,
        required: true,
        index: true,
        initial: true,
        options: 'steps, hearthare'
    },
    timestamp: {
        type: Types.Datetime,
        required: true,
        index: true,
        initial: true
    },
    value: {
        type: Types.Number,
        required: true,
        index: true,
        initial: true
    }
}, 'Permissions', {
    isAdmin: {
        type: Boolean,
        label: 'Admin',
        index: true
    }
});
Activity.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});
Activity.defaultColumns = 'type, timestamp, value';
Activity.register();
