  commSphereApp.service('ngEventIdService', function($http,$q) {

	return { 
		nameIsDuplicated : function(eventName) {
        console.log('event name passed in ',eventName);
        var deferred = $q.defer();
          $http.get('/api/events/duplicate/' + eventName).then(function (res) {
          if (res.data){
             console.log(res.data);
             deferred.resolve(res.data.duplicate);
          }
        });
       // $http.get('/api/events/duplicate/' + eventName)
       //      .success(function(result){
       //        deferred.resolve(result.data);
       //      }).error(function (msg, code) {
       //        deferred.reject(msg);
       //        console.log(msg,code);  
       //      });
            return deferred.promise;
 	 		},
   		idDuplicated : function(id) {
         var deferred = $q.defer();
   			 $http.get('/api/events/findDuplicateId/' + id).then(function (res) {
                deferred.resolve(res.data.duplicate);
            });
        return deferred.promise;  
   		},
   		primaryIdDuplicated : function(partialId) {
        var deferred = $q.defer();
   			$http.get('/api/events/getPrimaryId/' + partialId).then(function (res) {
              deferred.resolve(res.data);
            });
         return deferred.promise;
   		}
	}
});
