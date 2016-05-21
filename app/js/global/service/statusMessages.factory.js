/**
 * The statusMessages service is responsible for:
 * - Keeping a list of messages that are displayed.
 * - Automatically delete a message when it is based on a promise.
 * - Automatically deleting messages based on a timeout?
 */
(function() {
    'use strict';

    angular.module('app.global')
        .factory('statusMessages', statusMessages);

    /**
     * @return {object}
     *
     * @ngInject
     **/
    function statusMessages($timeout) {
        var _counter = 0;

        var factory = {
            messages: [],
            addPromiseMessage: addPromiseMessage
        };


        return factory;

        function addPromiseMessage(promise, loadingMessage, successMessage, errorMessage, cb) {
            var control = _addMessage(loadingMessage, true);

            var handlePromise = function(type, message) {
                return function() {
                    control.update(message);

                    if (type === 'error') {
                        cb(promise);
                    }

                    $timeout(function() {
                        control.remove();
                    }, 5000);
                };
            };

            promise.then(handlePromise('success', successMessage), handlePromise('error', errorMessage));
        }

        function _transformMessage(message) {
            if (angular.isString(message)) {
                message = {
                    text: message
                };
            }

            return message;
        }

        function _addMessage(message, loading) {
            message = _transformMessage(message);

            _counter++;
            message.id = _counter;
            message.loading = loading;
            factory.messages.push(message);

            // Remove message.
            return {
                remove: function() {
                    var index = _.indexOf(factory.messages, message);
                    if (index > -1) {
                        factory.messages.splice(index, 1);
                    }
                },
                update: function(newMessage) {
                    newMessage = _transformMessage(newMessage);

                    angular.extend(message, newMessage);

                    // Make sure the class and loading is removed on the old message is none is given to the new message.
                    if (_.isEmpty(newMessage['class'])) {
                        delete message['class'];
                    }

                    if (_.isUndefined(newMessage.loading)) {
                        delete message.loading;
                    }
                }
            };
        }
    }

})();

