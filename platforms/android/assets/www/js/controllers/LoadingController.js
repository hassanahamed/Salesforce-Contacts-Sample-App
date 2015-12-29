angular.module('ContactsExplorer')
	.controller('LoadingController',['NetworkService','$location',function(NetworkService,$location){
		console.log("DetailsController");
		NetworkService.refreshToken(function(){
			$location.path("/all");
		},function(){
			alert("network failure");
		});
	}]);