'use strict';

(function() {
    angular.module('app', [
        'ui.router',
        'ngAnimate',
        'ngMessages',
        'ui.bootstrap',
        'app.config',
        'app.global',
        'app.api',
        'app.page',
        'app.user'
    ]).config(configureStates);

    /** @ngInject */
    function configureStates($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
                'abstract': true,
                url: '/',
                template: ['<div>', '<div ui-view></div></div>'].join('')
            })
            .state('app.home', {
                templateUrl: '../views/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                url: ''
            })
            .state('app.team', {
                templateUrl: '../views/team.html',
                controller: 'TeamCtrl',
                controllerAs: 'vm',
                url: 'team'
            })
            .state('app.sprints', {
                templateUrl: '../views/sprints.html',
                controller: 'SprintsCtrl',
                controllerAs: 'vm',
                url: 'sprints'
            })
            .state('app.addSprint', {
                templateUrl: '../views/add-sprint.html',
                controller: 'AddSprintCtrl',
                controllerAs: 'vm',
                url: 'sprints/add'
            });

        $urlRouterProvider.otherwise('/');
    }
})();