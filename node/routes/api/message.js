
'use strict';
var keystone = require('keystone');
var Message = keystone.list('Message');
var watson = require('watson-developer-cloud');

module.exports = {
    addMessage: function (req, res) {
        saveMessage(req.body.roomID, req.body.userID, req.body.message, req.body.sentiment, function (result) {
            if (result.error) {
                res.status(400).send('tfoe');
            }
            res.status(200).send('success');
        });
    },
    analyzeTone: function (req, res) {
        var tone_analyzer = watson.tone_analyzer({
            username: '0a21d23d-6713-482e-a64a-8ed0c3bc3f6a',
            password: 'Rw18QfJ7wOwB',
            version: 'v3',
            version_date: '2016-05-19'
        });
        tone_analyzer.tone({ text: req.body.messages },
            function (err, tone) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                } else {
                    var maxTones = tone.document_tone.tone_categories.map(function (toneCat) {
                        var maxCatTone;
                        toneCat.tones.forEach(function (tone) {
                            if (maxCatTone) {
                                if (maxCatTone < tone.score) {
                                    maxCatTone = tone;
                                }
                            } else {
                                maxCatTone = tone;
                            }
                        });
                        return maxCatTone;
                    });
                    var maxTone;
                    maxTones.forEach(function (tone) {
                        if (maxTone) {
                            if (maxTone.score < tone.score) {
                                maxTone = tone;
                            }
                        } else {
                            maxTone = tone;
                        }
                    })
                    res.send(maxTone);
                }
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