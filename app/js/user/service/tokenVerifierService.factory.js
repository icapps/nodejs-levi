(function() {
    'use strict';

    angular.module('app.user').factory('tokenVerifierService', tokenVerifierService);

    /** @ngInject */
    function tokenVerifierService($log, appConstants) {
        function verify(token) {
            // TODO: check for > now
            var now = moment().unix();

            /*if (token.iss !== token.aud) {

            }
            return token.iss !== token.aud ? {
                status: false,
                reason: 'iss !== aud'
            } : token.iss !== window.a4p.baseURL || token.aud !== window.a4p.baseURL ? {
                status: false,
                reason: 'baseurl not the same as iss or aud'
            } : !_.has(token, 'sub') && _.isNumber(token.sub) ? {
                status: false,
                reason: 'token has no sub or is not a number'
            } : {
                status: true
            }*/
            return {status: true};
        }
        return {
            verify: verify
        }
    }
})();
