/**
 * StatusBar directive responsible for:
 * - Displaying messages to the user (top of the page)
 */
(function() {
    'use strict';

    angular.module('app.page')
        .directive('statusBar', statusBar);


    /**
     * Assume we want to be able to show a list of messages at the same time.
     *
     * @return {directive} angular directive for statusBar
     */
    function statusBar() {
        return {
            restrict: 'E',
            scope: {}, // isolate scope because scopebleed is bad.
            templateUrl: '/views/directive/statusBar.html',
            replace: true,
            controller: statusBarCtrl,
            controllerAs: 'sb'
        };

        /* @ngInject */
        function statusBarCtrl(statusMessages) {
            /*jshint validthis:true */
            var sb = this;

            // We can simply share the same messages array as the messages service.
            sb.messages = statusMessages.messages;
        }
    }
})();


