'use strict';

var keystone = require('keystone'),
    User = keystone.list('User'),
    moment = require('moment'),
    _ = require('lodash');

module.exports = {

    postSurvey: function(req, res) {
        var userId = req.body.userId;
        var survey = req.body.survey

        User.model.findOneAndUpdate({
            _id: userId
        }, {
            surveyQuestion: survey.question
        }, {
            new:    true
        }, function(err, user) {
            if (err) {
                res.status(404).send();
            } else {
                res.status(200).send({
                    user: user
                });
            }
        });
    }
};
