(function(undefined) {
    'use strict';

    angular.module('app.api').provider('api', apiProvider);

    /** @ngInject */
    function apiProvider() {
        return {
            $get: apiProviderGet
        };
    }

    /** @ngInject */
    function apiProviderGet($http){
        function buildAction(path) {
            var call = function(method, data, config) {

                var serialized = config && _.size(config) > 0 ? path + '?' + _serialize(config) : path;

                var setup = {
                    method: method,
                    url: window.levi.baseUrl + serialized,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                return $http(_.merge(setup));
            };
            return {
                GET: function(data) {
                    return call('GET', {}, data);
                },
                POST: function(data, config) {
                    return call('POST', data, config);
                }
            };
        }

        function _serialize(data) {
            return _.keys(data).map(function(b) {
                return b + '=' + data[b];
            }).join('&');
        }

        return {
            buildAction: buildAction
        };
    }

})(undefined);
