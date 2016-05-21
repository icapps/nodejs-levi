require('dotenv').load();
var keystone = require('keystone');
keystone.init({
    'name': 'SOLEPICS',
    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': '|pQ-OzeATlbPRg2|N`<IZa#3`=767+4Hzq+PhH(RW^E["1.E`~?TUX_!k-_?s,:b',
    'mongo': process.env.MONGOLAB_URI || process.env.MONGODB_URI
});
keystone.set('s3 config', {
    bucket: process.env.S3_BUCKET,
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET
});

keystone.import('models');
keystone.set('routes', require('./routes'));
keystone.set('nav', {
    'users': 'users'
});

keystone.start();
