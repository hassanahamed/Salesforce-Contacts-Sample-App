angular.module('ContactsExplorer')
    .controller('contactsEditionController', ['NetworkService', '$window', '$rootScope', '$location', function(NetworkService, $window, $rootScope, $location) {
        console.log("contactsEditionController");

        var controller = this;
        this.contact = {};
		
		var saveContacts1 = function(id) {

            console.log("id retrived is" + id);

            $location.path('#/add');
        };
        var displayError1 = function(data) {
            console.log("contactsEditionController: Error fetching contacts");
        };




        var saveContacts = function(id) {
            $rootScope.Id = id;
            console.log("id retrived is" + id);

            $window.location.href = '#/edit';


        };
        var displayError = function(data) {
            console.log("contactsEditionController: Error fetching contacts");
        };

        controller.editThisContactTemp = function(Id) {
            console.log("heyy i reached here");

            NetworkService.editContactsInitial(Id, saveContacts, displayError);
           
        };


        controller.editThisContact = function(Id) {
            NetworkService.editContacts($rootScope.Id, controller.contact, saveContacts1, displayError1);
        };



    }]);