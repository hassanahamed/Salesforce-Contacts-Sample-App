angular.module('ContactsExplorer')
	.controller('DetailsController',['NetworkService','$routeParams','$location',function(NetworkService,$routeParams,$location){
		console.log("DetailsController");

		var controller = this;
		controller.FullContact = {};
		var saveDetails = function(data){
			controller.FullContact = data;
			console.log("Fetching details successful");
		};
		var displayError = function(data){
			console.log("failed fetching details");
		};
		controller.goHome = function(){
			$location.path("/all");
		}
		controller.deleteContact = function(){
			NetworkService.deleteContact(controller.FullContact.Id,
				function(data){
					controller.goHome();
				},
				function(data){
					//alert("failed deletion");
					console.log("deletion failed");
				});
		};
		NetworkService.getFullContact($routeParams.id,saveDetails,displayError);
	}]);