angular.module('app').controller('adminCtrl', function($scope, $log, ngNotifier, $http) {
 	// $scope.eventTypes = {};
	$scope.eventTypeValue = {};

	$http.get('/api/eventTypes').then(function(res) {
		var eventTypes = res.data;
		$scope.eventListDoc = res.data[0];
		// $scope.eventTypes = eventTypes[0];
		if ($scope.eventListDoc == undefined) {  //default
			$scope.eventListDoc = {
				eventTypeList: [{
					'name': 'Current Types',
					eventTypes: []
				}]
			};
		}
	});
	
	//$log.debug($scope.eventListDoc.eventTypeList);

	$scope.saveEventTypes = function() {
		$http.post('/api/eventTypes', $scope.eventListDoc).then(function(res) {
			console.log(res.data.success);
			if (res.data.success) {
                $log.debug(res.data);
              } else {
                alert('there was an error');
              }
		});
	};

	$scope.addEvent = function(eventTypeList, e) {
		//$log.debug(eventTypeList);
		var eventTypeName = $scope.eventTypeValue[eventTypeList.name];
		if (eventTypeName.length > 0) {
			eventTypeList.eventTypes.push({name:eventTypeName});
		}
		console.log(eventTypeName);
		ngNotifier.notify("Event types list has been updated!");
		$scope.eventTypeValue = {};
		e.preventDefault();
	};

	$scope.editEvent = function(eventType) {
		$log.debug(eventType);
		eventType.editing = true;
		console.log(eventType.editing);
	};

	$scope.cancelEditingEvent = function(eventType) {
		eventType.editing = false;
	};

	$scope.saveEvent = function(eventType, e) {
		// topic.save();
		eventType.editing = false;
		ngNotifier.notify("Event types list has been updated!");
		e.preventDefault();
	};

	$scope.removeEvent = function(eventTypeList, event) {
		var index = eventTypeList.eventTypes.indexOf(event);
		if (index > -1) {
			eventTypeList.eventTypes.splice(index, 1)[0];
			ngNotifier.notify("Event types list has been updated!");
		}
	};

	// $scope.saveTopics = function() {
	// 	for (var i = $scope.eventdoc.categories[0].topics.length - 1; i >= 0; i--) {
	// 		var topic = $scope.eventdoc.categories[0].topics[i];
	// 		topic.sortOrder = i + 1;
	// 		// topic.save();
	// 	}
	// };
});