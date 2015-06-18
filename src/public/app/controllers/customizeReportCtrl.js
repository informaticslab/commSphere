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

	$scope.customizedDoc = [];
	console.log($scope.eventdoc);
	$scope.customizedDoc.push({sectionName: 'Document', sectionData:$scope.eventdoc});
	$scope.customizedDoc.push({sectionName: 'Data', sectionData:$scope.eventData});
	console.log($scope.customizedDoc);

	for(var i = 0; i < $scope.customizedDoc.length; i++){
		console.log($scope.customizedDoc[i].sectionName);
	}

});