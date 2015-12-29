angular.module('ContactsExplorer')
	.controller('EditController',['NetworkService','$routeParams','$location',function(NetworkService,$routeParams,$location){
		console.log("EditController");
		var controller = this;

		controller.FullContact = {};
		var saveDetails = function(data){
			controller.FullContact = data;
			console.log("Fetching details successful");
		};
		var displayError = function(data){
			console.log("failed fetching details");
		};
		NetworkService.getFullContact($routeParams.id,saveDetails,displayError);
		controller.goHome = function(){
			$location.path("/all");
		}
		controller.updateContact = function(){
			var NewCon = {};
			NewCon.FirstName = controller.FullContact.FirstName;
			NewCon.LastName = controller.FullContact.LastName;
			NewCon.Email = controller.FullContact.Email;
			NewCon.Phone = controller.FullContact.Phone;
			NetworkService.updateContact(controller.FullContact.Id,NewCon,function(data){
				alert("Success!");
				controller.goHome();
			},function(data){
				alert("Updating the contact failed");
				console.log("Error Updating");
			});
		}
	}]);