(function() {
    'use strict';

    angular.module('app.global').filter('unsafe', unsafe);

    /** @ngInject */
    function unsafe($sce) {
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }
})();
