require('dotenv').load();
var keystone = require('keystone');
var socketio = require('socket.io');
var watson = require('watson-developer-cloud');

keystone.init({
    'name': 'LEVI',
    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': '|pQ-OzeATlbPRg2|N`<IZa#3`=767+4Hzq+PhH(RW^E["1.E`~?TUX_!k-_?s,:b',
    'mongo': process.env.MONGOLAB_URI || process.env.MONGODB_URI
});

keystone.import('models');
keystone.set('routes', require('./routes'));
keystone.set('nav', {
    'Levi': [
        'users',
        'activities',
        'surveys'
    ]
});

keystone.start({
    onHttpServerCreated: function () {
        keystone.set('io', socketio.listen(keystone.httpServer));
    },
    onStart: function () {
        var io = keystone.get('io');
        var session = keystone.get('express session');
        var message = require('./routes/api/message');

        var alchemy_language = watson.alchemy_language({
            api_key: 'b436fe0c4a13f73bc30fb5e4943b627cf6ac6d8b'
        });

        // Share session between express and socketio
        io.use(function (socket, next) {
            session(socket.handshake, {}, next);
        });

        // Socketio connection
        io.on('connect', function (socket) {
            console.log('--- User connected');

            // Set session variables in route controller
            // which is going to load the client side socketio
            // in this case, ./routes/index.js
            console.log(socket.handshake.session);
            socket.emit('msg', socket.handshake.session.message);

            socket.on('chat', function (data) {
                socket.join('room/' + data.roomID);
            });

            socket.on('message', function (data) {
                io.to('room/' + data.roomID).emit('response', data.message);
                // TODO: implement bluemix endpoint
                var params = {
                    text: data.message
                };

                alchemy_language.sentiment(params, function (err, response) {
                    if (err) {
                        console.log('watson error:', err);
                    }
                    else {
                        console.log(response)
                        message.save(data.roomID, data.userID, data.message, response['docSentiment']['type'] || '',
                            response['docSentiment']['score'] || 0, function (result) {
                            if (result.error) {
                                console.log(result.error);
                            }
                            else {
                                io.to('room/' + data.roomID).emit('sentiment', response['docSentiment']);
                            }
                        })
                    }
                });
            })

            socket.on('disconnect', function () {
                console.log('--- User disconnected');
            });
        });
    }
});
