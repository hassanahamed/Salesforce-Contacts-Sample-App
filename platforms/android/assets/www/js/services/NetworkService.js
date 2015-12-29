angular.module('ContactsExplorer')
	.factory('NetworkService',function($http){
		console.log("network service");
		var v2="v2";
		var factory={
			hasToken:false,
			token: null,
			client_id : '3MVG9ZL0ppGP5UrArCNBgKTk3esLlhzhSwoAS7c28LcS0Sr0nt9xsiP1SkEleQHvH71aA8e_buRvcNe0d4toM',
			client_secret :'787476313952282944',
			uname : 'yashwanth.gondi@kony.com',
			pswd : '1234abcd',
			security_token : 'kVLiks2mLNfnsLKrjx0MDl1E'
		};

		//fetches the access_token for that session
		factory.refreshToken = function(successCallback,failureCallback){
            if(factory.hasToken)
            {
                successCallback();
                return;
            }
            $http({
                method: 'POST',
                url: 'https://login.salesforce.com/services/oauth2/token',
                
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:"grant_type=password"+
                    "&client_id="+factory.client_id+
                    "&client_secret="+factory.client_secret+
                    "&username="+factory.uname+
                    "&password="+factory.pswd+factory.security_token
            }).then(function(response){
            	factory.hasToken = true;
            	factory.token=response.data.access_token;
            	console.log("Successful in getting access_token: "+response.data.access_token);
                successCallback();
            },
            function(response){
                failureCallback();
            	console.log("Error getting token");
            });
        };

        //sample test method
		factory.samplePrint = function(){
			console.log("NetworkService: samplePrint1");
		};

		//gets contacts with FirstName, LastName, Id and gives the array to SuccessCallback
		factory.getBasicContacts = function(successCallback,failureCallback){

			if(!factory.hasToken)
			{
				console.log("Token not yet available");
				return;
			}
			else{
            	$http({
                	method: 'GET',
                	url: "https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+FirstName,LastName,Id+FROM+Contact",
                	headers: {
                	    Authorization: 'Bearer '+factory.token
                	}
            	}).then(function(response){
            		successCallback(response.data.records);
            	},failureCallback);
            }
		};

		//gets details about a specific contacts based on the id
		factory.getFullContact = function(id,successCallback,failureCallback){
			$http({
                method: 'GET',
                url: "https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/"+id,
                headers: {
                    Authorization: 'Bearer '+factory.token
                }
            }).then(function(response){
            	successCallback(response.data);
            },failureCallback);
		};

		//patches an existing contact
		factory.updateContact = function(id,newData,successCallback,failureCallback){
			$http({
                method: 'POST',
                url: "https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/"+id+"?_HttpMethod=PATCH",
                headers: {
                    "Authorization": 'Bearer '+factory.token,
                    "Content-Type" : "application/json",
                    "X-HTTP-Method-Override": "PATCH"
                },
                data: newData 
            }).then(function(response){
            	successCallback(response.data);
            },failureCallback);
		}

		//add a new contact to the database
		factory.addNewContact = function(contact,successCallback,failureCallback){
			$http({
                method: 'POST',
                url: 'https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/',
                
                headers:{
                    'Content-Type': 'application/json',
                    "Authorization": 'Bearer '+factory.token,
                },
                data: contact
            }).then(successCallback,failureCallback);
		}

		//delete an existing contact
		factory.deleteContact = function(id,successCallback,failureCallback){
			$http({
                method: 'DELETE',
                url: "https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/"+id,
                headers: {
                    Authorization: 'Bearer '+factory.token
                }
            }).then(successCallback,failureCallback);
		}

		//factory.refreshToken();
		return factory;
	});