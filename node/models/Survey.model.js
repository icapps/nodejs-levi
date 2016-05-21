'use strict';

var keystone = require('keystone'),
    Types = keystone.Field.Types,
    Survey = new keystone.List('Survey');

Survey.add({
    timestamp: {
        type: Types.Datetime,
        required: true,
        index: true,
        initial: true
    },
    questionOne: {
        type: Types.Number
    },
    user: {
        type: Types.Relationship,
        ref: 'User',
        required: true,
        index: true,
        initial: true
    }
});
Survey.defaultColumns = 'timestamp, user';
Survey.register();
