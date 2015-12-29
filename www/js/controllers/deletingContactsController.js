angular.module('ContactsExplorer')
    .controller('deletingContactsController', ['NetworkService', '$location', function(NetworkService, $location) {
        console.log("deletingContactsController");
        var controller = this;
        this.contact = {};




        var saveContacts = function() {
            $location.path('#/add');


        };
        var displayError = function(data) {
            console.log("deletingContactsController: Error fetching contacts");
        };

        controller.deleteThisContact = function(Id) {
            NetworkService.deleteContact(Id, saveContacts, displayError);
        };

    }]);