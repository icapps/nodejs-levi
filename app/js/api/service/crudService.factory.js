(function () {
    'use strict';

    angular.module('app.api').service('crudService', crudService);

    /** @ngInject */
    function crudService($log, api) {

        var _apiPrefix = '/api';

        function GET(action, data) {
            data = data || {};
            action = api.buildAction(_apiPrefix + action);

            return action.GET(data).then(function (res) {
                if (res && res.data) {
                    return res.data;
                }
            });
        }

        function POST(action, data) {
            data = data || {};
            action = api.buildAction(_apiPrefix + action);

            return action.POST(data).then(function (res) {
                if (res && res.data) {
                    return res.data;
                }
            });
        }

        return {
            POST: POST,
            GET: GET
        }
    }
})();
