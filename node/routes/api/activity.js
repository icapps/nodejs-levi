'use strict';

var keystone = require('keystone'),
    Activity = keystone.list('Activity'),
    moment = require('moment');

module.exports = {

    postActivities: function(req, res) {
        Activity.model.findOneAndUpdate({
            user:      req.body.userId,
            timestamp: moment(req.body.timestamp).startOf('hour'),
            type:      req.body.type
        }, {
            value: req.body.value
        }, {
            new: true,
            upsert: true
        }, function(err, activity) {
            if (err) {
                res.status(404).send();
            } else {
                res.status(200).send({
                    activity: activity
                });
            }
        });
    }
};
