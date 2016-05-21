(function() {

    'use strict';
    angular.module('app.page').controller('PageCtrl', PageCtrl);

    /** @ngInject */
    function PageCtrl($rootScope, crudService) {
        var page = this;

        page.showDropdown = false;

        crudService.GET('/projects').then(function(projects) {
            $rootScope.project = _.first(projects);
            $rootScope.selectedSprint = _.first($rootScope.project.sprints);

            page.project = $rootScope.project;
            page.selectedSprint = $rootScope.selectedSprint;
        });

        page.toggle = function() {
            page.showDropdown = !page.showDropdown;
        };

        page.switchSprint = function(sprint) {
            $rootScope.selectedSprint = sprint;
            page.selectedSprint = sprint;
        };
    }
})();
