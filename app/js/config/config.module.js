(function() {
    'use strict';

    angular.module('app.config', []).constant('appConstants', {
        defaultLanguage: 'en',
        cookieName: '_LEVI'
    })
    .config(pushErrorInterceptor)
    .config(applyAsync);

    /** @ngInject */
    function pushErrorInterceptor($httpProvider) {
        $httpProvider.interceptors.push('errorInterceptor');
    }

    /** @ngInject */
    function applyAsync($httpProvider) {
        $httpProvider.useApplyAsync(true);
    }
})();