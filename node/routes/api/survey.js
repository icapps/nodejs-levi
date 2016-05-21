'use strict';

var keystone = require('keystone'),
    User = keystone.list('User'),
    Survey = keystone.list('Survey'),
    moment = require('moment'),
    _ = require('lodash');

module.exports = {

    postSurvey: function(req, res) {
        var userId = req.body.userId;
        var survey = req.body.survey;

        var promises = [];
        promises.push(
            new Promise(function(resolve, reject) {
                User.model.findOneAndUpdate({
                    _id: userId
                }, {
                    surveyQuestion: survey.question
                }, {
                    new:    true
                }, function(err, user) {
                    if (err) {
                        console.error(err);
                        reject();
                    } else {
                        resolve(user);
                    }
                });
            })
        );
        promises.push(
            new Promise(function(resolve, reject) {
                var newSurvey = Survey.model({
                    user:        userId,
                    questionOne: survey.repeatingQuestion,
                    timestamp:   survey.timestamp
                });
                newSurvey.save(function(err, survey) {
                    if (err) {
                        console.error(err);
                        reject();
                    } else {
                        resolve(survey);
                    }
                });
            })
        );

        Promise.all(promises).then(function(result) {
            res.status(200).send({
                result: result
            });
        }, function(err) {
            console.error(err);
            res.status(400).send();
        });
    }
};
