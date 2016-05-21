var keystone = require('keystone'),
    Types = keystone.Field.Types,
    Message = new keystone.List('Message');

Message.add({
    match: {
        type: Types.Relationship,
        ref: 'Match',
        initial: true
    },
    user: {
        type: Types.Relationship,
        ref: 'User',
        initial: true
    },
    message: {
        type: Types.Text,
        initial: true
    },
    sentiment: {
        type: Types.Text,
        initial: true
    },
     sentimentScore: {
        type: Types.Number,
        initial: true
    }

}, 'Permissions', {
    });
Message.defaultColumns = 'match, user, message';
Message.register();