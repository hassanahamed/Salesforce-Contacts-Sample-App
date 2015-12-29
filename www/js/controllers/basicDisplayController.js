angular.module('ContactsExplorer')
    .controller('basicDisplayController', ['NetworkService', function(NetworkService) {
        console.log("basicDisplayController");
        var controller = this;
        controller.array = [];
        var saveContacts = function(array) {
            console.log("basicDisplayController: Fetched the contacts");
            controller.array = array;
        };
        var displayError = function(data) {
            console.log("basicDisplayController: Error fetching contacts");
        };
        controller.getContacts = function() {
            NetworkService.getBasicContacts(saveContacts, displayError);
        };
        controller.getContacts();
    }]);