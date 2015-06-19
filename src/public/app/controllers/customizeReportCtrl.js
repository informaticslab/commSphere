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
	$scope.customizedDoc.push({sectionName: 'Document', sectionType: 'Document', sectionData:$scope.eventdoc});
	$scope.customizedDoc.push({sectionName: 'Metrics', sectionType: 'Metrics', sectionData:$scope.eventData});

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

	$scope.checkOthers = function(category) {
		category.checked = category.topics.checked;
	}

	$scope.checkCustomDoc = function() {
		console.log($scope.customizedDoc);
	}

	$scope.checkedValues = function(isChecked) {
		console.log(isChecked.checked);
	};

	$scope.saveSection = function(section, e) {
		// topic.save();
		section.editing = false;
		e.preventDefault();
	};

	$scope.editSection = function(section) {
		section.editing = true;
	};

	$scope.cancelEditingTopic = function(topic) {
		topic.editing = false;
	};

});