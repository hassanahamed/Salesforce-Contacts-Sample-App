angular.module('ContactsExplorer')
    .controller('contactsAdditionController', ['NetworkService', '$location', function(NetworkService, $location) {
        console.log("contactsAdditionController");
        var controller = this;
        this.contact = {};
        var saveContacts = function(id) {
            console.log("id retrived is" + id);

            $location.path('#/add');


        };
        var displayError = function(data) {
            console.log("ContactsController: Error fetching contacts");
        };

        controller.addContacts = function() {
            NetworkService.AddAnyContacts(controller.contact, saveContacts, displayError);
        };

    }]);