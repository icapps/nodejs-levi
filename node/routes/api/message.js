
'use strict';
var keystone = require('keystone');
var Message = keystone.list('Message');
module.exports = {
    addMessage: function (req, res) {
        saveMessage(req.body.roomID, req.body.userID, req.body.message, req.body.sentiment, function (result) {
            if (result.error) {
                res.status(400).send('tfoe');
            }
            res.status(200).send('success');
        });
    }
};
function saveMessage(roomID, userID, message, sentiment, sentimentScore, callback) {
    var newMessage = Message.model({
        match: roomID,
        user: userID,
        message: message,
        sentiment: sentiment,
        sentimentScore: sentimentScore
    });
    newMessage.save(function (err, match) {
        if (err) {
            callback({ error: 'deine mufti ' + err });
        }
        callback({ message: 'success' });
    });
}


module.exports.save = saveMessage;