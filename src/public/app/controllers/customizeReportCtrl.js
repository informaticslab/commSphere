angular.module('app').controller('customizeReportCtrl', function($scope) {
	$scope.eventData = { //Test grid model
		"_id": "558179624f8a168122d39072",
		"eventName": "Austin Hurricane",
		"eventInstanceId": "AU0001-001",
		gridData: [{
			"gridName": "Public Interest",
			"dailyData": [{
				"label": "Inquiries to CDC-INFO",
				"1434548481747": "20"
			}, {
				"label": "Inquiries to CDC EOC",
				"1434548481747": "5"
			}],
			"editing": false
		}]
	};
//For testing not useful
	$scope.customizedDoc = [];
	console.log($scope.eventdoc);
	$scope.customizedDoc.push({sectionName: 'Document', sectionData:$scope.eventdoc});
	$scope.customizedDoc.push({sectionName: 'Data', sectionData:$scope.eventData});
	console.log($scope.customizedDoc);

	for(var i = 0; i < $scope.customizedDoc.length; i++) {
		console.log($scope.customizedDoc[i].sectionName);
		console.log($scope.customizedDoc[i].sectionData);
		if($scope.customizedDoc[i].sectionName == 'Document'){
			console.log($scope.customizedDoc[i].sectionData.categories[0]);

		}
		// for(var j = 0; j < $scope.customizedDoc[i].sectionData.length; i++) {
		// 	console.log($scope.customizedDoc[i].sectionData[j]);
		// }
	}
//
	//Following two functions are for checking child boxes from parent
	$scope.allNeedsClicked = function() {
		var newValue = !$scope.allNeedsMet();

		_.each($scope.todos, function(todo) {
			todo.done = newValue;
		});
	};

	// Returns true if and only if all todos are done.
	$scope.allNeedsMet = function() {
		var needsMet = _.reduce($scope.todos, function(memo, todo) {
			return memo + (todo.done ? 1 : 0);
		}, 0);

		return (needsMet === $scope.todos.length);
	};
}

	$scope.checkedValues = function(section) {
		console.log(section.checked);
	};


//Movable UI section
	$scope.editSection = function(section) {
		section.editing = true;
	};

	$scope.cancelEditingTopic = function(topic) {
		topic.editing = false;
	};

});