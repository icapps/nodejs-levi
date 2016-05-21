var fb = require('fb'),
    _ = require('lodash'),
    _treshold = 100;

module.exports = function() {

    function getPosts(user, cb) {

        console.log('getting posts of user', user._id, 'with accessToken', user.facebookAccessToken);
        fb.setAccessToken(user.facebookAccessToken);
        fb.api('me', {fields: ['posts.limit(250){message}']}, function(response) {

            if (!response || response.error) {
                cb(response.error ? response.error : {error: 'unknown'}, null);
                return;
            }

            var posts = response.posts && response.posts.data,
                strings = [];

            try {

                _.forEach(posts, function(post) {
                    if (post.hasOwnProperty('message')) {
                        var splits = post.message.split(' ');
                        _.forEach(splits, function(split) {
                            strings.push(split);
                        })
                    }
                });

                console.log('word count', _.size(strings));
                while (_.size(strings) < _treshold) {
                    var newStrings = strings;
                    strings = strings.concat(newStrings);
                }
                console.log(_.size(strings));

                if (_.isFunction(cb)) {
                    cb(null, {
                        user: user._id,
                        posts: strings.join(' ')
                    });
                }
            } catch (e) {
                console.log(e);
            }

        });
    }

    return {
        getPosts: getPosts
    }
};