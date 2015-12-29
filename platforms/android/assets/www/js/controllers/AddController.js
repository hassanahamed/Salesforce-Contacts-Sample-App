angular.module('ContactsExplorer')
	.controller('AddController',['NetworkService','$location',function(NetworkService,$location){
		
		console.log("AddController");
		var controller=this;
		controller.contact={
			FirstName:"",
			LastName:"",
			Email:"",
			Phone:""
		};

		controller.goHome = function(){
			$location.path("/all");
		}

		controller.addContact =function(){
			NetworkService.addNewContact(controller.contact,function(data){
				alert("Success!");
				controller.goHome();
			},function(data){
				alert("Adding contact failed");
				console.log("Adding contact failed");
			});
		};
	}]);