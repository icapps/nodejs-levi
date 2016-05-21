var watson = require('watson-developer-cloud'),
    personalityInsights = watson.personality_insights({
        username: '4e9d86bd-2cc4-4288-b459-5651b5ab87ac',
        password: '3TvyvryGqYJK',
        version: 'v2'
    });

module.exports = function() {

    function input(text, cb) {
        console.log('getting the personality insights');
        personalityInsights.profile({
                text: text
            },
            function(err, response) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, response)
                }
            });
    }

    return {
        input: input
    }
};

