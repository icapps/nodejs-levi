'use strict';
var keystone = require('keystone');
var Match = keystone.list('Match');
var User = keystone.list('User');
module.exports = {
    findMatch: function (req, res) {
        User.model.findOne().exec(function (err, user) {
            var newMatch = Match.model({
                roomID: 'room/' + user.name.first,
                user: req.body.userID,
                coach: user._id
            });
            newMatch.save(function (err, match) {
                if (err) {
                    res.status(400).send({ message: 'deine muther ' + err });
                }
                res.status(200).send({ message: 'success'});
            })
        });
    }
};