angular.module('app').controller('customizeReportCtrl', function($scope, $modal, $http) {

	$scope.customizedDoc = {};
	$scope.customizedDoc.reportMeta = {title: '', type: ''};
	$scope.customizedDoc.docData = [];

	$scope.customizedDoc.reportMeta = $scope.eventdoc.reportMeta;
	$scope.customizedDoc.docData.push({sectionName: 'Daily Metrics', sectionType: 'Metrics',  sectionData:{doc:$scope.eventData, notes:$scope.eventdoc.notes}});
	$scope.customizedDoc.docData.push({sectionName: 'Media Summaries', sectionType: 'Document', sectionData:{doc:$scope.eventdoc, notes:$scope.eventdoc.notes}});
	$scope.customizedDoc.eventDocId = $scope.eventdoc._id;

	$scope.minColWidth = 110;
	$scope.minTopicWidth = 200;

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
		for (var i = 0; i < $scope.customizedDoc.docData.length; i++) {
			if ($scope.customizedDoc.docData[i].sectionData.notes != undefined) {
				if ($scope.customizedDoc.docData[i].sectionType == 'Document') {
					$scope.eventdoc = $scope.customizedDoc.docData[i].sectionData.doc;
					$scope.eventdoc.notes = $scope.customizedDoc.docData[i].sectionData.notes;
				}
			}
		}
		$scope.eventdoc.reportMeta = $scope.customizedDoc.reportMeta;

		var eventdoc = {};
		eventdoc = $scope.eventdoc;
		//console.log(customDoc);
		console.log($scope.eventdoc);
		$http.post('/api/events', eventdoc).then(function(res) {
			if(res.data.success){
				console.log('Customized report saved');
			} else {
				console.log(res.data.err);
			}
		});
		// $http.post('/api/reports/saveCustomizedReport', customDoc).then(function(res) {
		// 	if (res.data.success) {
		// 		console.log('Customized report saved');
		// 	} else {
		// 		console.log('there was an error');
		// 	}
		// });
	};

	$scope.selectAll = function(item) {
		//console.log(item.topics);
		for (var i = 0; i < item.topics.length; i++) {
			if(item.checked) {
				item.topics[i].checked = true;
			} else {
				item.topics[i].checked = false; 
			}
			
			for (var j = 0; j < item.topics[i].subTopics.length; j++){
				if(item.topics[i].checked) {
					item.topics[i].subTopics[j].checked = true;
				} else {
					item.topics[i].subTopics[j].checked = false;
				}
				for (var u = 0; u < item.topics[i].subTopics[j].bullets.length; u++) {
					if(item.topics[i].subTopics[j].checked) {
						item.topics[i].subTopics[j].bullets[u].checked = true;
					} else {
						item.topics[i].subTopics[j].bullets[u].checked = false;
					}
					for(var o = 0; o <item.topics[i].subTopics[j].bullets[u].subBullets.length; o++) {
						if(item.topics[i].subTopics[j].bullets[u].checked) {
							item.topics[i].subTopics[j].bullets[u].subBullets[o].checked = true;
						} else {
							item.topics[i].subTopics[j].bullets[u].subBullets[o].checked = false;
						}
					}
				}
			}

			for (var y = 0; y < item.topics[i].bullets.length; y++) {
				if(item.topics[i].checked) {
					item.topics[i].bullets[y].checked = true;
				} else {
					item.topics[i].bullets[y].checked = false;
				}
				for (var l = 0; l < item.topics[i].bullets[y].subBullets.length; l++) {
					if (item.topics[i].bullets[y].checked) {
						item.topics[i].bullets[y].subBullets[l].checked = true;
					} else {
						item.topics[i].bullets[y].subBullets[l].checked = false;
					}
				}
			}
		}
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