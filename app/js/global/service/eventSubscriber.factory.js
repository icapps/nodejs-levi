(function() {

    'use strict';

    angular.module('app.config')
        .factory('eventSubscriber', eventSubscriber);

    /** @ngInject */
    function eventSubscriber($q, $rootScope) {
        var _defaults = {invokeOnAdd: false, digest: false, once: false};

        /**
         * @param options {object}
         *  - invokeOnAdd {boolean} When this is true it will invoke a callback when it gets added if the eventSubsscriber has been triggered before. Defaults to false.
         * @returns {object} An object containing a triggerAll, triggerAllAsPromised & listenerCount function.
         **/
        return function(options) {
            var listeners = [], result, lastArgs;

            options = angular.extend({}, _defaults, options);

            result = function(cb, config) {
                config = config || {};
                var listener = {cb: cb, config: config};

                if (angular.isFunction(cb)) {
                    listeners.push(listener);

                    if (lastArgs && (config.invokeOnAdd === true || (options.invokeOnAdd && angular.isUndefined(config.invokeOnAdd)))) {
                        _callListener(listener, lastArgs);
                    }

                    var unsubscribe = function() {
                        var index = _.indexOf(listeners, listener);
                        if (index > -1) {
                            listeners.splice(index, 1);
                        }
                    };

                    if (config.scope) {
                        config.scope.$on('$destroy', function() {
                            unsubscribe();
                        });
                    }

                    return unsubscribe;
                }

                return angular.noop;
            };

            var _getArgs = function(args) {
                return Array.prototype.slice.call(args, 0, args.length);
            };

            var _callListener = function(listener, args) {
                var result = listener.cb.apply(listener.cb, args);

                if (listener.config.once) {
                    var index = _.indexOf(listeners, listener);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }

                return result;
            };

            result.triggerAll = function() {
                var args = _getArgs(arguments);
                lastArgs = args;

                if (options.digest) {
                    if (options.digest === true) {
                        (options.scope || $rootScope).$evalAsync(function() {
                            angular.forEach(listeners, function(listener) {
                                _callListener(listener, args);
                            });
                        });
                    } else { // let's assume it gave a scope to digest
                        angular.forEach(listeners, function(listener) {
                            _callListener(listener, args);
                        });
                        try {
                            options.digest.$digest();
                        }
                        catch(e) {}
                    }
                } else {
                    angular.forEach(listeners, function(listener) {
                        _callListener(listener, args);
                    });
                }
            };

            result.triggerAllAsPromise = function() {
                var args = _getArgs(arguments);
                lastArgs = args;

                return $q.all(_.map(listeners, function(listener) {
                    return $q.when(_callListener(listener, args));
                }));
            };



            result.listenerCount = function() {
                return listeners.length;
            };

            return result;
        };
    }

})();

