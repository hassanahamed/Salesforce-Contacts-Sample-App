var thisApp = angular.module('ContactsExplorer');
angular.module('ContactsExplorer')
	.config(function($routeProvider){
		console.log("Configuring routes");
		$routeProvider.when('/',{
			templateUrl: "./templates/contacts_all.html",
			controller: "basicDisplayController",
			controllerAs: "contacts"
		}).when('/details/:id',{
			templateUrl: "./templates/contacts_details.html",
			controller: "contactsInDetailController",
			controllerAs: "detailer"
		})
		.when('/edit',{
			templateUrl: "./templates/contacts_edit.html",
			controller: "contactsEditionController",
			controllerAs: "editor"
		})
		.when('/add',{
			templateUrl: "./templates/contacts_add.html",
			controller: "contactsAdditionController",
			controllerAs: "adder"
		}).when('/delete/',{
			templateUrl: "./templates/delete.html",
			controller: "deletingContactsController",
			controllerAs: "deleter"
		})
		.otherwise({
			redirectTo:'/'
		});
	});
