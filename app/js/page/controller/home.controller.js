(function () {
    'use strict';

    angular.module('app.page').controller('HomeCtrl', HomeCtrl);

    /** @ngInject */
    function HomeCtrl($rootScope, crudService, socketFactory) {
        var vm = this;
        var socket = socketFactory();
        vm.userID = '5740bc83cae3d8030082f706'
        vm.messages = []

        var socket = io('https://levi-app.herokuapp.com/');
        socket.emit('chat', { roomID: '574076e2e0474103008091c6' });

        socket.on('response', function (data) {
            console.log(data);
            vm.messages.push(data);
        });

        vm.send = function () {
            socket.emit('message', { userID: vm.userID, message: vm.message })
            vm.messages.push({ userID: vm.userID, message: vm.message });
            vm.message = '';
        }
    }
})();
