angular.module('app').controller('customizeReportCtrl', function($scope, $modal, $http) {

	$scope.customizedDoc = {};

	$http.get('/api/reports/getCustomizedReport/'+$scope.eventdoc._id).then(function(res) {
		if (res.data.length > 0){
			$scope.customizedDoc = res.data[0];
		} else {
			$scope.customizedDoc.docData = [];
			$scope.customizedDoc.docData.push({sectionName: 'Daily Metrics', sectionType: 'Metrics', sectionData:$scope.eventData});
			$scope.customizedDoc.docData.push({sectionName: 'Media Summaries', sectionType: 'Document', sectionData:$scope.eventdoc});
			$scope.customizedDoc.eventDocId = $scope.eventdoc._id;
		}
	});
	$scope.minColWidth = 110;
	$scope.minTopicWidth = 200;


	// $scope.checkOthers = function(category) {
	// 	category.checked = category.topics.checked;
	// }

	// $scope.checkCustomDoc = function() {
	// 	console.log($scope.customizedDoc);
	// }

	// $scope.checkedValues = function(isChecked) {
	// 	console.log(isChecked.checked);
	// };

	/////GRID//////
	$scope.addDataColumn = function(columnName) {

		for (var i = 0; i < $scope.eventData.gridData.length; i++) {
			var oneGrid = $scope.eventData.gridData[i];
			for (var j = 0; j < oneGrid.dailyData.length; j++) {
				if (oneGrid.dailyData[j].hasOwnProperty(columnName)) {} else { // column not exists, add
					oneGrid.dailyData[j][columnName] = '*';
				}
			}
		}

	};


	$scope.addTable = function(grid) {

		if (grid.newGridName.length > 0) {
			var initialRow = {
				'label': ''
			}
			if ($scope.columns) {
				if ($scope.columns.length > 0) {
					for (i = 0; i < $scope.columns.length; i++) {
						if ($scope.columns[i].field !== 'label') {
							initialRow[$scope.columns[i].field] = '*';
						}
					}
				}
			} else {
				var newColumn = '' + $scope.eventdoc.dateCreated
				initialRow[newColumn] = '*';
			}

			$scope.eventData.gridData.push({
				gridName: grid.newGridName,
				dailyData: [initialRow]
			});
			if (!$scope.columns) {
				$scope.columns = $scope.generateColumnDefs();
			}
			grid.newGridName = "";
		}
	};

	$scope.generateColumnDefs = function() {
		var columnArry = [];
		var columnLayout = [];
		// pick a grid to iterate
		var oneGrid = $scope.eventData.gridData[0];
		console.log(oneGrid);
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
					pinnedLeft: true,
					enableColumnMenu: false
				};
			} else {
				var formattedDate = $filter('date')(columnArry[i], 'mediumDate');
				oneColumnDef = {
					'field': columnArry[i],
					'displayName': formattedDate,
					enableSorting: false,
					minWidth: $scope.minColWidth,
					enablePinning: false,
					enableColumnMenu: false

				};
			}
			columnLayout.push(oneColumnDef);
		}

		return columnLayout;

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

	////END GRID///
	// console.log($scope.gridOptions);
	// console.log($scope.columns);
	// console.log($scope.gridApi);
	// console.log($scope.eventData);

	$scope.saveCustomizedReport = function() {
		var customDoc = {};
		customDoc = $scope.customizedDoc;
		//console.log(customDoc);
		$http.post('/api/reports/saveCustomizedReport', customDoc).then(function(res) {
			if (res.data.success) {
				console.log('Customized report saved');
			} else {
				console.log('there was an error');
			}
		});
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