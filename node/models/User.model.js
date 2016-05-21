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
    password: {
        type: Types.Password,
        initial: true
    },
    facebookId: {
        type: String
    },
    facebookAccessToken: {
        type: String
    },
    updatedAt: {
        type: Date
    }
}, 'Permissions', {
    isAdmin: {
        type: Boolean,
        label: 'Admin',
        index: true
    }
});

User.schema.add({
    personality: {
        type: keystone.mongoose.Schema.Types.Mixed
    }
});

User.schema.virtual('canAccessKeystone').get(function() {
    return this.isAdmin;
});

User.defaultColumns = 'name, email, facebookId, isAdmin';
User.register();