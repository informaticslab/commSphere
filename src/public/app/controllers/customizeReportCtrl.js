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

	$scope.getTableHeight = function(grid, id) {
		var rowHeight = 30; // your row height
		var headerHeight = 30; // your header height
		//if (id.split('_')[1] ==='0') {
		return {
			height: ((grid.dailyData.length + 1) * rowHeight + headerHeight - 12) + "px"
		};
		//}
		// else {
		// return {
		//    height: (grid.dailyData.length * rowHeight + headerHeight) + "px" };
		// }
	};

	$scope.generateColumnDefs = function() {
		var columnArry = [];
		var columnLayout = [];
		// pick a grid to iterate
		var oneGrid = $scope.eventData.gridData[0];
		if (oneGrid) { // at least one grid exist
			for (var columnName in oneGrid.dailyData[0]) {
				if (oneGrid.dailyData[0].hasOwnProperty(columnName)) {
					if (columnName !== '$$hashKey' && columnName != 'label') {
						columnArry.push(columnName);
					}
				}
			}

		} else {
			$scope.addDataColumn('label');
			// columnArry.push('label');
			$scope.addDataColumn('' + $scope.eventdoc.dateCreated)
			columnArry.push('' + $scope.eventdoc.dateCreated);
		}
		columnArry.sort();
		columnArry.unshift('label');
		for (i = 0; i < columnArry.length; i++) {
			// build columns defition object
			if (columnArry[i] === 'label') {
				oneColumnDef = {
					'field': columnArry[i],
					enableSorting: false,
					minWidth: $scope.minTopicWidth,
					pinnedLeft: true
				};
			} else {
				var formattedDate = $filter('date')(columnArry[i], 'mediumDate');
				oneColumnDef = {
					'field': columnArry[i],
					'displayName': formattedDate,
					enableSorting: false,
					minWidth: $scope.minColWidth,
					enablePinning: false
				};
			}
			columnLayout.push(oneColumnDef);
		}

		return columnLayout;

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