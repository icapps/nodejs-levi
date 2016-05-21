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
        options: 'steps, heartrate'
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
    },
    user: {
        type: Types.Relationship,
        ref: 'User',
        required: true,
        index: true,
        initial: true
    }
});
Activity.defaultColumns = 'type, timestamp, value, user';
Activity.register();
