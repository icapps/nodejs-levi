(function () {
    'use strict';
    angular.module('app.global', [])
        .factory('socket', socket);
    /** @ngInject */
    function socket(socketFactory) {
        return socketFactory({
            ioSocket: io('https://levi-app.herokuapp.com/')
        });
    }
})();