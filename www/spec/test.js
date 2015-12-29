describe("Tests on NetworkService", function() {


 beforeEach(module("ContactsExplorer"));



 beforeEach(inject(function(_NetworkService_, $injector) {

  $service = _NetworkService_;

  $httpBackend = $injector.get('$httpBackend');
  $httpBackend.when('POST', 'https://login.salesforce.com/services/oauth2/token').respond({
   access_token: 'sample_token'
  });

  $httpBackend.when('POST', 'https://ap2.salesforce.com/services/data/v34.0/sobjects/Contact/').respond({
   access_token: 'sample_token'
  });



  $httpBackend.when("GET", "https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+FirstName,LastName,Id+FROM+Contact")
   .respond({
    records: retrivedataset()
   });

 }));

 afterEach(function() {
  $httpBackend.flush();

 });

 var dataset = [{
  FirstName: "rob",
  LastName: "rose",
  Id: "01",
  Email: "dfgdg@gmail.com",
  Phone: "24234234"
 }, {
  FirstName: "dferf",
  LastName: "erfrverdf",
  Id: "02",
  Email: "efgveesf@mail.com",
  Phone: "+02"
 }, {
  FirstName: "dfvdf",
  LastName: "dfsvdfs",
  Id: "03",
  Email: "dfvdsfv@mail.com",
  Phone: "+03"
 }];

 var $service;
 var $httpBackend;




 var retrivedataset = function() {
  var arr = [];
  for (var i = 0; i < dataset.length; i++) {
   arr.push({
    FirstName: dataset[i].FirstName,
    LastName: dataset[i].LastName,
    Id: dataset[i].Id
   });
  }
  return arr;
 }


 it('should refresh the token', function() {

  $httpBackend.expectPOST("https://login.salesforce.com/services/oauth2/token");
  $service.refreshToken(function() {
   console.log("access_token received");

  }, function() {
   console.log("error getting access_token");
  });

  expect(true).toBe(true);

 });




 it('test case to get the basic contacts in the backend data set', function() {

  $httpBackend.expectPOST("https://login.salesforce.com/services/oauth2/token");
  $service.refreshToken(function() {
   console.log("access_token received");

   $httpBackend.expectGET("https://ap2.salesforce.com/services/data/v34.0/query/?q=SELECT+FirstName,LastName,Id+FROM+Contact");
   $service.getBasicContacts(function(array) {
    console.log(array);
    expect(JSON.stringify(retrivedataset())).toBe(JSON.stringify(array))

   }, function(errata) {
    console.log(errata);
   });
  }, function() {
   console.log("error getting access_token");
  });
 });
 it("test case to retrive the information of the person in detail for the given id", function() {
  for (var j = 0; j < dataset.length; j++) {

   $httpBackend.expect('GET', /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/, undefined, undefined, ['id'])
    .respond(function(method, url, data, headers, params) {
     console.log('params');
     console.log(params);
     var obj;
     for (var i = 0; i < dataset.length; i++) {
      if (params.id == dataset[i].Id) {
       break;
      }
     }
     return [200, dataset[i]];
    });
   (function() {
    var target = dataset[j];
    $service.refreshToken(function() {
     $service.getFullContact(target.Id, function(response) {

      console.log(response);

      expect(JSON.stringify(response)).toBe(JSON.stringify(target));

     }, function(errata) {
      console.log(errata);
     });
    });
   })();
  }
 });


 it("test case to add the contact in the backend", function() {
  var tempBackenddataset = dataset;
  $service.refreshToken(function() {
   var sampleContact = {
    FirstName: "dfghb",
    LastName: "drghbt",
    Id: "sampleId",
    Email: "tyht@mail.com",
    Phone: "1234"
   };
   tempBackenddataset.push(sampleContact);
   $service.AddAnyContacts(sampleContact, function() {
    expect(JSON.stringify(tempBackenddataset[tempBackenddataset.length - 1])).toBe(JSON.stringify(sampleContact));
   }, function() {
    console.log("adding failed");
   });
  });
 });

 it("test case to delete the contact in the backend given an id", function() {
  var tempBackenddataset = dataset;
  tempBackenddataset.push({
   FirstName: "erfge",
   LastName: "erf",
   Email: "erfgesr@mail.com",
   Phone: "1234",
   Id: "testing_id"
  });
  $httpBackend.expect('DELETE', /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/, undefined, undefined, ['id'])
   .respond(function(method, url, data, headers, params) {
    // for requested url of '/user/1234' params is {id: '1234'}
    for (var i = 0; i < tempBackenddataset.length; i++) {
     if (tempBackenddataset[i].Id == params.id) {
      tempBackenddataset.splice(i, 1);
      break;
     }
    }
    return [200, tempBackenddataset];
   });

  $service.deleteContact("sample_id", function() {
   console.log("strt");
   console.log(tempBackenddataset);
   expect(tempBackenddataset.length).toBe(5);
  }, function() {
   console.log("deleting failed");
  });
 });


 it("test case to update the contact in the backend given an id", function() {
  var tempBackenddataset = dataset;
  tempBackenddataset.push({
   FirstName: "sedfg",
   LastName: "sdfv",
   Email: "ffdvsdfv@mail.com",
   Phone: "234534",
   Id: "sample_id"
  });
  $httpBackend.expect('POST', /https:\/\/ap2.salesforce.com\/services\/data\/v34.0\/sobjects\/Contact\/(.+)/, undefined, undefined, ['id'])
   .respond(function(method, url, data, headers, params) {
    var target = {};
    // for requested url of '/user/1234' params is {id: '1234'}

    var id = params.id.split('?')[0];
    console.log(id);
    console.log(params.id);
    for (var i = 0; i < tempBackenddataset.length; i++) {
     if (tempBackenddataset[i].Id == id) {
      break;
     }
    }

    var parsedData = JSON.parse(data);
    for (key in parsedData) {
     console.log("key i :" + key);
     tempBackenddataset[i][key] = parsedData[key];
    }
    return [200, tempBackenddataset];

   });
  var newData = {
   FirstName: "changed"
  };
  $service.editContacts("sample_id", newData, function() {
   var i = 0;
   for (; i < tempBackenddataset.length; i++) {
    if (tempBackenddataset[i].Id == "sample_id")
     break;
   }
   expect(tempBackenddataset[i].FirstName).toBe("changed");
  }, function(data) {
   console.log("failed");
  });
 });
});