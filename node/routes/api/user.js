'use strict';

var keystone = require('keystone'),
    User = keystone.list('User'),
    facebookService = require('./../../services/facebook')(),
    apiResponseService = require('./../../services/apiResponse')(),
    personalityService = require('./../../services/watson/personalityInsights')();

module.exports = {

    verify: function(req, res) {

        var facebookId = req.body.facebookId,
            accessToken = req.body.accessToken,
            name = req.body.name;

        if (!facebookId || !accessToken || !name) {
            apiResponseService.fail(res, {message: 'no facebookID or accessToken or name'});
            return;
        }

        User.model.findOne({facebookId: facebookId}, function(err, user) {

            // No user found in db, add a new one
            if (!user) {
                console.log('no user found with Facebook ID', facebookId);
                var newUser = new User.model({
                    name: name,
                    facebookId: facebookId,
                    facebookAccessToken: accessToken,
                    updatedAt: new Date()
                });
                newUser.save(function(saveUserError, savedUser) {
                    if (saveUserError) {
                        console.log('error saving new user', saveUserError);
                        apiResponseService.fail(res, {message: saveUserError});

                    }
                    console.log('created new user ', savedUser);
                    _inputPersonality(res, savedUser);
                    apiResponseService.success(res);
                });

            } else {

                // Update the found user and return it
                console.log('user found with Facebook ID', facebookId);

                User.model.update({_id: user._id}, {
                    updatedAt: new Date(),
                    facebookAccessToken: accessToken
                }, function(updateUserError) {
                    if (updateUserError) {
                        apiResponseService.fail(res, {message: updateUserError});
                    }
                    console.log('updated user', user._id);
                    _inputPersonality(res, user);
                    apiResponseService.success(res);
                });

            }
        });
    }
};

function _inputPersonality(res, user) {


    facebookService.getPosts(user, function(err, posts) {

        if (!err) {
            personalityService.input(posts.posts, function(err, result) {

                if (err) {
                    console.log('personality insights err', err);
                    return;
                }

                User.model.update({_id: user._id}, {
                    personality: result.tree && result.tree.children
                }, function(updateUserError) {
                    if (updateUserError) {
                        apiResponseService.fail(res, {message: updateUserError});
                    }
                    console.log('updated user with personality', user._id);
                });

            });
        }
    });

}
