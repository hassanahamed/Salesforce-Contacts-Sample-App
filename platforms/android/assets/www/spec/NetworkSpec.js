describe("Tests on NetworkService", function () {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //var $controller;

    var $service;
    var $httpBackend;
    var $http;
    beforeEach(module("ContactsExplorer"));

    var contacts = [
        {
            FirstName: "fn1",
            LastName: "ln1",
            Id: "01",
            Email: "fn1.ln1@mail.com",
            Phone: "+01"
    	},
        {
            FirstName: "fn2",
            LastName: "ln2",
            Id: "02",
            Email: "fn2.ln2@mail.com",
            Phone: "+02"
    	},
        {
            FirstName: "fn3",
            LastName: "ln3",
            Id: "03",
            Email: "fn3.ln3@mail.com",
            Phone: "+03"
    	}
	];

    /*Helper methods start here*/


    var simplifyContacts = function () {
        var arr = [];
        for (var i = 0; i < contacts.length; i++) {
            arr.push({
                FirstName: contacts[i].FirstName,
                LastName: contacts[i].LastName,
                Id: contacts[i].Id
            });
        }
        return arr;
    }

    function clone(obj) {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;

        var temp = obj.constructor(); // changed

        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }

        return temp;
    }
    /*End of helpers*/



    beforeEach(inject(function (_NetworkService_, $injector) {

        $service = _NetworkService_;

        $httpBackend = $injector.get('$httpBackend');
        //$httpBackend.when('GET', '/auth.py').respond({userId: 'userX'}, {'A-Token': 'xxx'});
        $httpBackend.when('POST', 'https://login.salesforce.com/services/oauth2/token').respond({
            access_token: 'sample_token'
        }, {});

        $httpBackend.when("GET", "https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+FirstName,LastName,Id+FROM+Contact")
            .respond({
                records: simplifyContacts()
            }, {});

        $http = $injector.get('$http');

    }));

    afterEach(function () {
        $httpBackend.flush();

    });

    it('should get the basic contacts array with FN,LN and Id', function () {

        $httpBackend.expectPOST("https://login.salesforce.com/services/oauth2/token");
        $service.refreshToken(function () {
            console.log("access_token received");

            $httpBackend.expectGET("https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+FirstName,LastName,Id+FROM+Contact");
            $service.getBasicContacts(function (array) {
                //console.log(array);
                expect(JSON.stringify(simplifyContacts())).toBe(JSON.stringify(array))

            }, function (errata) {
                console.log(errata);
            });
        }, function () {
            console.log("error getting access_token");
        });
    });
    it("should get a specific contact identified by Id field", function () {
        for (var j = 0; j < contacts.length; j++) {

            $httpBackend.expect('GET', /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/, undefined, undefined, ['id'])
                .respond(function (method, url, data, headers, params) {
                    // for requested url of '/user/1234' params is {id: '1234'}
                    console.log(params);
                    var obj;
                    for (var i = 0; i < contacts.length; i++) {
                        if (params.id === contacts[i].Id) {
                            break;
                        }
                    }
                    return [200, contacts[i]];
                });
            (function () {
                var target = contacts[j];
                $service.refreshToken(function () {
                    $service.getFullContact(target.Id, function (con) {
                        console.log(con);

                        expect(JSON.stringify(con)).toBe(JSON.stringify(target));

                    }, function (errata) {
                        console.log(errata);
                    });
                }, null);
            })();
        }
    });


    it("should create a new contact on the backend", function () {
        var tempBackendContacts = clone(contacts);
        $httpBackend.expect('POST', /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\//, undefined, undefined, undefined)
            .respond(function (method, url, data, headers, params) {
                // for requested url of '/user/1234' params is {id: '1234'}
                data.Id = "sample_id";
                tempBackendContacts.push(JSON.parse(data));
                return [200, {
                    Id: "sample_id"
                }];
            });
        $service.refreshToken(function () {
            var sampleContact = {
                FirstName: "fns",
                LastName: "lns",
                Email: "fns.lns@mail.com",
                Phone: "1234"
            };
            $service.addNewContact(sampleContact, function () {
                expect(JSON.stringify(tempBackendContacts[tempBackendContacts.length - 1])).toBe(JSON.stringify(sampleContact));
            }, function () {
                console.log("adding failed");
            });
        }, null);
    });

    it("should delete a contact given an Id", function () {
        var tempBackendContacts = clone(contacts);
        tempBackendContacts.push({
            FirstName: "fns",
            LastName: "lns",
            Email: "fns.lns@mail.com",
            Phone: "1234",
            Id: "sample_id"
        });
        $httpBackend.expect('DELETE', /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/, undefined, undefined, ['id'])
            .respond(function (method, url, data, headers, params) {
                // for requested url of '/user/1234' params is {id: '1234'}
                for (var i = 0; i < tempBackendContacts.length; i++) {
                    if (tempBackendContacts[i].Id === params.id) {
                        tempBackendContacts.splice(i, 1);
                        break;
                    }
                }
                return [200, {}];
            });

        $service.deleteContact("sample_id", function () {
            var i = 0;
            for (; i < tempBackendContacts.length; i++) {
                if (tempBackendContacts[i].Id === "sample_id")
                    break;
            }
            expect(tempBackendContacts.length).toBe(i);
        }, null);
    });


    it("should update a contact given an Id and new data", function () {
        var tempBackendContacts = clone(contacts);
        tempBackendContacts.push({
            FirstName: "fns",
            LastName: "lns",
            Email: "fns.lns@mail.com",
            Phone: "1234",
            Id: "sample_id"
        });
        $httpBackend.expect('POST', /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/, undefined, undefined, ['id'])
            .respond(function (method, url, data, headers, params) {
                var target = {};
                // for requested url of '/user/1234' params is {id: '1234'}
                var i;
                var id = params.id.split('?')[0];
                for (i = 0; i < tempBackendContacts.length; i++) {
                    if (tempBackendContacts[i].Id === id) {
                        break;
                    }
                }
                
                if (i < tempBackendContacts.length) {
                    var parsedData = JSON.parse(data);
                    for (key in parsedData) {
                        console.log("key i :"+key);
                        tempBackendContacts[i][key] = parsedData[key];
                    }
                    return [200, {}];
                } else
                    return [400, {}];
            });
        var newData = {
            Phone:"3241"  
        };
        $service.updateContact("sample_id",newData, function () {
            var i = 0;
            for (; i < tempBackendContacts.length; i++) {
                if (tempBackendContacts[i].Id === "sample_id")
                    break;
            }
            expect(tempBackendContacts[i].Phone).toBe("3241");
        }, function(data){
            console.log("failed");
        });
    });
});
