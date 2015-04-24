angular.module('app').factory('ngEvents', function($http) {
  var eventService = {
    getActiveEvents: function() {
      var promise = $http.get('/api/events/active').then(function (response) {
        // The then function here is an opportunity to modify the response
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    }
  };
  return eventService;
}); 