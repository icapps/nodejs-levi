var keystone = require('keystone'),
    Types = keystone.Field.Types,
    Match = new keystone.List('Match');

Match.add({
    roomID: {
        type: Types.Text,
        required: true,
        index: true,
        initial: true
    },
    coach: {
        type: Types.Relationship, ref: 'User',
        initial: true
    },
    user: {
        type: Types.Relationship, ref: 'User',
        initial: true
    },
    matchedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, 'Permissions', {
    });
Match.defaultColumns = 'roomID, coach, user, matchedAt';
Match.register();