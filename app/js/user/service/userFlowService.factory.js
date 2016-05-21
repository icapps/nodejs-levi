(function() {
    'use strict';
    angular.module('app.user').factory('userFlowService', userFlowService);

    /** @ngInject */
    function userFlowService($log, $q) {

        var _handlers = [];

        function add(handler, priority) {
            handler && _handlers.push({
                priority: priority || 0,
                handler: handler
            });
            
            _handlers = _.sortByOrder(_handlers, ['priority'], ['asc'])
        }

        function register() {
            return _.size(_handlers) > 0 ? chain(_.map(_handlers, function(handler) {
                return handler.handler
            })) : []
        }

        function chain(a) {
            var c = $q.when(),
                d = !1,
                e = function(a) {
                    d = a
                };
            return _.forEach(a, function(a) {
                c = c.then(function(c) {
                    return d ? $q.reject(d) : a(c, e)
                }, function(a) {
                    return $q.reject(a)
                })
            }), c = c.then(function(a) {
                return d ? $q.resolve(d) : $q.resolve(a)
            }, function(a) {
                return d ? $q.resolve(d) : $q.reject(a)
            })
        }
        return {
            chain: chain,
            add: add,
            register: register
        }
    }
})();
