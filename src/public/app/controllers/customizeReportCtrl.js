angular.module('app').controller('customizeReportCtrl', function($scope, $rootScope, $modal, $http) {
	$rootScope.combinedGrid = [];
	$rootScope.checkedColumns = [];
	var gridData = $scope.eventData.gridData;
	// for(var i = 0; i < $scope.eventData.gridData.length; i++) {
	// 	//console.log($scope.eventData.gridData[i]);
	// 	$scope.combinedGrid.push({'gridSectionName':$scope.eventData.gridData[i].gridName, 'dailyData': $scope.eventData.gridData[i].dailyData});
	// }
	// console.log($scope.combinedGrid);
	
	for(var i = 0; i < gridData.length; i++) {
		//console.log(gridData[i].gridName);
		$rootScope.combinedGrid.push({"label":gridData[i].gridName});

		for(var j = 0; j < gridData[i].dailyData.length; j++) {
			//console.log(gridData[i].dailyData[j]);
			$rootScope.combinedGrid.push(gridData[i].dailyData[j]);
		}
	}

	var customizeHeaderCellTemplate = 
	  '<div ng-class="{ \'sortable\': sortable }">'+
	  '<div class="ui-grid-vertical-bar"> </div>'+
	  '<div col-index="renderIndex" ng-mouseenter="hoverTopic = true" ng-mouseleave="hoverTopic = false" class="ui-grid-cell-contents">'+
	  '  <input type="checkbox" ng-click="$event.stopPropagation(); grid.appScope.checkGridColumn(col.name, col.checked); " ng-model="col.checked"/>&nbsp;{{ col.displayName CUSTOM_FILTERS }}<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }"></span>'+
	  '</div>'+
	  '<div ng-if="grid.options.enableColumnMenus &amp;&amp; !col.isRowHeader &amp;&amp; col.colDef.enableColumnMenu !== false" ng-click="toggleMenu($event)" class="ui-grid-column-menu-button"><i class="ui-grid-icon-angle-down"> </i></div>'+
	  '<div ng-if="filterable" ng-repeat="colFilter in col.filters" class="ui-grid-filter-container">'+
	  '  <input type="text" ng-model="colFilter.term" ng-click="$event.stopPropagation()" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}" class="ui-grid-filter-input"/>'+
	  '  <div ng-click="colFilter.term = null" class="ui-grid-filter-button"><i ng-show="!!colFilter.term" class="ui-grid-icon-cancel right"> </i>'+
	  '    <!-- use !! because angular interprets \'f\' as false-->'+
	  '  </div>'+
	  '</div>'+
	  '</div>'

 $scope.checkGridColumn = function(column,checked) {
 	var toDelete = '';

 	if(checked) {
 		$rootScope.checkedColumns.push(column);
 	} else {
 		if($rootScope.checkedColumns.length > 0) {
 			toDelete = $scope.checkedColumns.indexOf(column);
 			if(toDelete != -1) {
 				$rootScope.checkedColumns.splice(toDelete, 1);
 			}
 		}
 	}

 	console.log($rootScope.checkedColumns);
 };

 $scope.getCustomizedTableHeight = function(grid,id) {
       var rowHeight = 30; // your row height
       var headerHeight = 30; // your header height
       if (id.split('_')[1] ==='0') {
          return {
              height: (($scope.combinedGrid.length+1) * rowHeight + headerHeight-12) + "px" };
       }
       else {
       return {
          height: ($scope.combinedGrid.length * rowHeight + headerHeight-14) + "px" };
       }
    };


$scope.customizeGenerateColumnDefs= function() {
   var columnArry = [];
   var columnLayout = [];
   // pick a grid to iterate
   var oneGrid =  $scope.eventData.gridData[0];
   if (oneGrid) {  // at least one grid exist
       for (var columnName in oneGrid.dailyData[0]) {
          if (oneGrid.dailyData[0].hasOwnProperty(columnName)) {
            if (columnName !== '$$hashKey' && columnName != 'label')  {
                columnArry.push(columnName);
            } 
          }
       }

    }
    else {
        $scope.addDataColumn('label');
       // columnArry.push('label');
        $scope.addDataColumn(''+$scope.eventdoc.dateCreated)
        columnArry.push(''+$scope.eventdoc.dateCreated);
    }
       columnArry.sort();
       columnArry.unshift('label');
       for(i=0; i< columnArry.length; i++) {
      // build columns defition object
         if (columnArry[i] === 'label') {
            oneColumnDef = {'field': columnArry[i], 'displayName':$scope.eventData.colDisplayNames[columnArry[i]] , enableSorting:false, minWidth: $scope.minTopicWidth,pinnedLeft:true};
          }
         else {
            //var formattedDate = $filter('date')(columnArry[i],'mediumDate');
            oneColumnDef = {'field': columnArry[i], 'displayName' : $scope.eventData.colDisplayNames[columnArry[i]], enableSorting:false, minWidth:$scope.minColWidth, enablePinning:false, enableColumnMenu:false
            //,headerCellTemplate: '/partials/customHeaderCellTemplate'
            ,headerCellTemplate: customizeHeaderCellTemplate
          }
         }
            columnLayout.push(oneColumnDef);
       }
       //console.log(columnLayout)
       return columnLayout;
     
};

$scope.customizeColumns = $scope.customizeGenerateColumnDefs();


});