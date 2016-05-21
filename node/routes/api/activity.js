'use strict';

var keystone = require('keystone'),
    Activity = keystone.list('Activity'),
    moment = require('moment'),
    _ = require('lodash');

module.exports = {

    postActivities: function(req, res) {
        var userId = req.body.userId;
        var activities = req.body.activities;

        var promises = [];
        _.forEach(activities, function(activity) {
           promises.push(
               new Promise(function(resolve, reject) {
                   Activity.model.findOneAndUpdate({
                       user:      userId,
                       timestamp: moment(activity.timestamp).startOf('hour'),
                       type:      activity.type
                   }, {
                       value: activity.value
                   }, {
                       new:    true,
                       upsert: true
                   }, function(err, activity) {
                       if (err) {
                           reject();
                       } else {
                           resolve(activity);
                       }
                   });
               })
           );
        });

        Promise.all(promises).then(function(activities) {
            res.status(200).send({
                activities: activities
            });
        }, function(err) {
            res.status(400).send();
        });
    }
};
