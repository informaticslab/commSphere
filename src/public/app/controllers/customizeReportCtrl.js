angular.module('app').controller('customizeReportCtrl', function($scope, $modal) {

	$scope.customizedDoc = [];
	$scope.customizedDoc.push({sectionName: 'Media Summaries', sectionType: 'Document', sectionData:$scope.eventdoc});
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

	var previewReportModalInstanceCtrl = function($scope, $modalInstance, customizedDoc) {
		$scope.customizedDoc = customizedDoc;

		$scope.ok = function() {
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	};

	$scope.preview = function(size, customizedDoc) {
		var modalInstance = $modal.open({
			scope: $scope,
			templateUrl: '/partials/previewReportModal',
			controller: previewReportModalInstanceCtrl,
			size: size,
			resolve: {
				customizedDoc: function() {
					return customizedDoc;
				}
			}
		});
	};

});