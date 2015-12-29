angular.module('ContactsExplorer')
	.controller('ContactsController',['NetworkService',function(NetworkService){
		console.log("ContactsController");
		NetworkService.samplePrint();
		var controller = this;
		controller.array=[];
		var saveContacts = function(array){
			console.log("ContactsController: Fetched the contacts");
			controller.array = array;
		};
		var displayError = function(data){
			console.log("ContactsController: Error fetching contacts");
		};
		controller.getContacts = function(){
			NetworkService.getBasicContacts(saveContacts,displayError);
		};
		controller.getContacts();
	}]);