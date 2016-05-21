(function() {
    'use strict';

    angular.module('app.user').factory('User', UserFactory);

    /** @ngInject */
    function UserFactory() {
        var User = function(user, anonymous) {
            _.extend(this, user);
            this.anonymous = anonymous;
        };

        User.prototype = {
            getUserID: function() {
                return this._id;
            },
            getUsername: function() {
                return this.username;
            },
            getEmail: function() {
                return this.email;
            },
            getPaypalEmail: function() {
                return this.paypal;
            }
        };

        User.new = function(user, anonymous) {
            return new User(user, anonymous);
        };

        return User;
    }
})();
