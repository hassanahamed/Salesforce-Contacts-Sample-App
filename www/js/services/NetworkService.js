angular.module('ContactsExplorer')
    .factory('NetworkService', function($http) {
        console.log("network service");

        var factory = {
            hasToken: false,
            token: null,
            client_id: '3MVG9ZL0ppGP5UrCajaVH8UvmxGBbUX8DEmc7MjWNl4NLql_feAxN4OblScFVWNzo3anONr.64BGtx.yoW5xT',
            client_secret: '8908163000926325443',
            uname: 'hassanahamed24@gmail.com',
            pswd: 'Welcome@1234',
            security_token: 'eMpfGhrDcbj4t4zrz68twWeD'
        };

        //getting the access token
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

       




        factory.editContactsInitial = function(Id, successCallback, failureCallback) {
            console.log("editing the contact");
            successCallback(Id);
        };

        
        factory.getBasicContacts = function(successCallback, failureCallback) {

            if (!factory.hasToken) {
                console.log("Token not yet available");
                return;
            } else {
                $http({
                    method: 'GET',
                    url: "https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+FirstName,LastName,Id+FROM+Contact",
                    headers: {
                        Authorization: 'Bearer ' + factory.token
                    }
                }).then(function(response) {
                    successCallback(response.data.records);
                }, failureCallback);
            }
        };




        factory.AddAnyContacts = function(contactDetails, successCallback, failureCallback) {

            $http({
                method: 'POST',
                url: "https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: 'Bearer ' + factory.token
                },
                data: contactDetails

            }).then(function(response) {
				console.log(response.data.Id);
                successCallback(response.data.Id);
            }, failureCallback);

        };




        factory.deleteContact = function(contactId, successCallback, failureCallback) {

            $http({
                method: 'DELETE',
                url: "https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/" + contactId,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': 'Bearer ' + factory.token,
                    'Accept': 'application/json'




                },


            }).then(function(response) {
                successCallback();
            }, failureCallback);

        };




        factory.editContacts = function(contactId, contactDetails, successCallback, failureCallback) {

            console.log(contactId);
            console.log(contactDetails);
            $http({
                method: 'POST',
                url: "https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/" + contactId + "?_HttpMethod=PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + factory.token,
                    "X-HTTP-Method-Override": "PATCH"
                },
                data: contactDetails

            }).then(function(response) {
                successCallback(response.data);
            }, failureCallback);

        };




        //gets details about a specific contacts based on the id
        factory.getFullContact = function(id, successCallback, failureCallback) {
            $http({
                method: 'GET',
                url: "https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/" + id,
                headers: {
                    Authorization: 'Bearer ' + factory.token
                }
            }).then(function(response) {
                successCallback(response.data);
            }, failureCallback);
        };

        factory.refreshToken();
        return factory;
    });