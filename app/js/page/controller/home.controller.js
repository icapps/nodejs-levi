(function () {
    'use strict';

    angular.module('app.page').controller('HomeCtrl', HomeCtrl);

    /** @ngInject */
    function HomeCtrl($rootScope, crudService, socket) {
        var vm = this;
        vm.userID = '5740bc83cae3d8030082f706'
        vm.messages = []

        socket.emit('chat', { roomID: '574076e2e0474103008091c6' });

        socket.on('response', function (data) {
            vm.messages.push(data);
        });

        vm.send = function () {
            socket.emit('message', { userID: vm.userID, message: vm.message, roomID: '574076e2e0474103008091c6'})
            vm.messages.push({ userID: vm.userID, message: vm.message });
            vm.message = '';
        }
    }
})();
