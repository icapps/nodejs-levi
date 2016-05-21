(function() {
    'use strict';

    angular.module('app.user').factory('userService', userService);

    /** @ngInject */
    function userService($cookies, $log, $q, api, appConstants, eventSubscriber, User) {

        var _userInfoByIdAction = api.buildAction('/api/user/info/id'),
            _userInfoByUsernameAction = api.buildAction('/api/user/info/username'),
            _updateUserAction = api.buildAction('/api/user/update');

        var _updateUserPromise;
        var loaded = $q.defer();
        var _user;

        function initializeAnonymously() {
            _user || ($log.info('Anonymous user'));
            _setAnonymous();
        }

        function _builduser(user, isAnonymous) {
            return User.new(user, isAnonymous);
        }

        function _setUser(user) {
            _user = user;
            user.anonymous ? factory.onLogout.triggerAll() : factory.onLogin.triggerAll();
            factory.onChange.triggerAll(user);
            loaded.resolve();
        }

        function _setAnonymous() {
            _setUser(_builduser(_user, true));
        }

        function logOut() {
            _setAnonymous();
            clearCookie();
        }

        function logIn(user) {
            _setUser(_builduser(user, false))
        }

        function getUser() {
            return _user
        }

        function updateUser(data, userId) {

            return _updateUserPromise = _updateUserAction.POST({
                user_id: userId,
                data: data
            }).then(function(a) {
                return a.data
            })

        }
        function _decodeBase64(a) {
            var b = a.replace('-', '+').replace('_', '/');
            switch (b.length % 4) {
                case 0:
                    break;
                case 2:
                    b += '==';
                    break;
                case 3:
                    b += '=';
                    break;
                default:
                    throw 'Illegal base64url string!'
            }
            return window.atob(b)
        }

        function getClaimsFromToken(token) {
            if (!token) {
                return;
            }
            return JSON.parse(_decodeBase64(token.split('.')[1]));
        }

        function ensureLoggedIn() {
            var deferred = $q.defer(),
                currentUser = getUser();
            _.isUndefined(currentUser) ? deferred.reject() : deferred.resolve();
            return deferred.promise;

            var deferred = $q.defer();

            loaded.promise.then(function() {

                var currentUser = getUser();
                if (currentUser.anonymous) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
                return deferred.promise
            }, function() {
                return deferred.reject();
            });
        }

        function clearCookie() {
            $cookies.remove(appConstants.cookieName)
        }

        function setCookie(token, expireDate) {
            $cookies.put(appConstants.cookieName, token, {
                path: '/',
                secure: false, // TODO,
                expires: moment().add(10, 'days').format()
            })
        }

        function getUserByUserId(userId) {
            return _userInfoByIdAction.GET({
                id: userId
            }).then(function(response) {
                return response.data
            });
        }

        function getUserByUsername(username) {
            return _userInfoByUsernameAction.GET({
                username: username
            }).then(function(response) {
                return response.data
            });
        }

        var factory = {
            onLogin: eventSubscriber({invokeOnAdd: true}),
            onLogout: eventSubscriber({invokeOnAdd: true}),
            onChange: eventSubscriber({invokeOnAdd: true}),
            logOut: logOut,
            logIn: logIn,
            getUser: getUser,
            getClaimsFromToken: getClaimsFromToken,
            initializeAnonymously: initializeAnonymously,
            ensureLoggedIn: ensureLoggedIn,
            getUserByUserId: getUserByUserId,
            getUserByUsername: getUserByUsername,
            updateUser: updateUser,
            setCookie: setCookie,
            clearCookie: clearCookie
        };

        return factory;

    }
})();
