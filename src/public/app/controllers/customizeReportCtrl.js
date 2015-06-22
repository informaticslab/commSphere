angular.module('app').controller('customizeReportCtrl', function($scope, $modal) {

	$scope.customizedDoc = [];
	$scope.customizedDoc.push({sectionName: 'Media Summaries', sectionType: 'Document', sectionData:$scope.eventdoc});
	$scope.customizedDoc.push({sectionName: 'Metrics', sectionType: 'Metrics', sectionData:$scope.eventData});

	
	$scope.minColWidth = 110;
	$scope.minTopicWidth = 200;
	$scope.chartData ={};
	$scope.highChartConfig = {};

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

	$scope.removeTable = function(gridName) {
		for (var i = 0; i < $scope.eventData.gridData.length; i++) {
			if ($scope.eventData.gridData[i].gridName === gridName) {
				$scope.eventData.gridData.splice(i, 1);
			}
		}

	}
	$scope.editTableName = function(grid) {
		grid.editing = true;
	};

	$scope.cancelEditingTable = function(grid) {
		grid.editing = false;
	};


	$scope.saveTableName = function(grid, e) {
		// topic.save();
		grid.editing = false;
		e.preventDefault();
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

	// $scope.getChartData = function() {
	//   var chartCategories= [];
	//   var chartCategoriesHeading= [];
	//   var serieData = [];
	//   var series = [];
	//   var chartData = {};

	//   for (i = 0; i < $scope.eventData.dailyData.length; i ++) {
	//   var oneRow =  $scope.eventData.dailyData[i];
	//   if (i == 0) { // pick first row and generate the chart categories
	//       for (var oneCol in oneRow) {
	//          if (oneCol !== '$$hashKey' && oneCol !=='subTopic') {
	//           // reformat to display on chart
	//             chartCategories.push(oneCol);
	//             chartCategoriesHeading.push($filter('date')(oneCol,'d-MMM'));
	//        }
	//       }
	//       chartCategories.sort();   // sort the remaining columns heading
	//   }
	//   serieName = oneRow['subTopic'];
	//      for (var j=0 ; j < chartCategories.length; j++) { 
	//            serieData.push(Number(oneRow[chartCategories[j]]));
	//          }
	//   var newSerie = {name: serieName, data: serieData}
	//       series.push(newSerie);
	//       serieData = [];
	//        console.log(series);
	//   }
	//   chartData['xAxis'] = chartCategoriesHeading;
	//   chartData['series'] = series;
	//   console.log(chartData);
	//   return  chartData;

	// }


	$scope.$on('uiGridEventEndCellEdit', function() {
		//   $scope.chartData = $scope.getChartData();
		//   console.log('chart data inside grid update ', $scope.chartData );
		//   $scope.highChartConfig.series = $scope.chartData.series;

	})

	$scope.removeColumn = function() {
		var lastColumnName = $scope.columns[$scope.columns.length - 1].field.toString();
		if (lastColumnName !== 'label') {
			$scope.columns.splice($scope.columns.length - 1, 1);
			for (var i = 0; i < $scope.eventData.gridData.length; i++) {
				for (var j = 0; j < $scope.eventData.gridData[i].dailyData.length; j++) {
					if ($scope.eventData.gridData[i].dailyData[j].hasOwnProperty(lastColumnName)) {
						delete $scope.eventData.gridData[i].dailyData[j][lastColumnName];
					} else { // column not exists, add
					}
				}
			}
		}
	}

	$scope.addColumn = function() {
		// assuming using eventInstanceId as column name
		var newColumnName = '' + new Date().getTime();
		var formattedDate = $filter('date')(newColumnName, 'mediumDate');
		$scope.columns.push({
			'field': newColumnName,
			'displayName': formattedDate,
			enableSorting: false,
			minWidth: $scope.minColWidth,
			enablePinning: false
		});
		$scope.addDataColumn(newColumnName);
	}


	$scope.splice = function() {
		$scope.columns.splice(1, 0, {
			field: 'company',
			enableSorting: false
		});
	}

	$scope.unsplice = function() {
		$scope.columns.splice(1, 1);
	}

	$scope.addRow = function(grid, id) {
		var n = grid.dailyData.length + 1;
		grid.dailyData.push({

		});
		// var myGrid = angular.element( document.querySelector( '#'+id ) );
		// myGrid.css('height',(n+2)*30);
	};

	$scope.removeLastRow = function(grid, id) {

		var n = grid.dailyData.length;
		grid.dailyData.pop();

	}
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
	console.log($scope.gridOptions);
	console.log($scope.columns);
	console.log($scope.gridApi);
	console.log($scope.eventData);

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