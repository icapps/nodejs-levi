(function() {
    'use strict';

    angular.module('app.global').factory('errorInterceptor', errorInterceptor);

    /** @ngInject */
    function errorInterceptor($log, $q) {
        function responseError(err) {
            return $log.warn('ERR detected ', err.data);

            // 401 --> /denied
            // 400 Bad request

            if (200 !== err.status) {
                $q.reject(err);
            }
        }
        return {
            responseError: responseError
        }
    }
})();