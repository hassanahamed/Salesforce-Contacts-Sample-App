angular.module('ContactsExplorer').controller('contactsInDetailController', ['NetworkService',
    '$routeParams', '$window', '$scope',
    function(NetworkService, $routeParams, $window, $scope) {
        console.log("contactsInDetailController");
        var controller = this;
        var saveContacts = function(object) {
            console.log("id retrived is" + object);
            controller.obj = object;
        };
        var displayError = function(data) {
            console.log("contactsInDetailController: Error fetching contacts");
        };

        this.getFullContacts = function(Id) {
            NetworkService.getFullContact(Id, saveContacts, displayError);

        };

        console.log("calling for contacct:id:" + $routeParams.id);
        this.getFullContacts($routeParams.id);

    }
]);
angular.module("ContactsExplorer")
    .directive('goClick', function($location) {
        return function(scope, element, attrs) {
            var path;

            attrs.$observe('goClick', function(val) {
                path = val;
            });

            element.bind('click', function() {
                scope.$apply(function() {
                    $location.path(path);
                });
            });
        };
    });