(function() {
    'use strict';

    angular.module('app.page').controller('HomeCtrl', HomeCtrl);

    /** @ngInject */
    function HomeCtrl($rootScope, crudService) {
        var vm = this;

        /*crudService.GET('/presences', {
            sprint_id: '573a21a8506945d4c6a474c6'
        }).then(function(sprint) {
            vm.sprint = sprint;
        });*/

        $rootScope.$watch('selectedSprint', function(sprint) {
            if (!sprint) {
                return;
            }


            crudService.GET('/presences', {
                sprint_id: sprint._id
            }).then(function(sprint) {
                vm.sprint = sprint;
            });
        })

    }
})();
