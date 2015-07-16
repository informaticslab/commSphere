angular.module('app').controller('previewReportCtrl', function($scope,$rootScope) {
	// console.log($scope.eventdoc);
	// console.log($scope.customizedDoc);
	$scope.previewedGrid = [];
	var checked = $rootScope.checkedColumns;
	checked = ['1435861626006','1436463022438']
	var gridData = $scope.eventData.gridData;
	var combinedGrid = JSON.parse(JSON.stringify($rootScope.combinedGrid));
	$scope.customizedData = JSON.parse(JSON.stringify($scope.eventData));
	//console.log('combinedGrid',combinedGrid);
	if (checked.length > 0) {
		for(var j = 0; j < combinedGrid.length; j++) {
			for(key in combinedGrid[j]) {
				//console.log('Key:',key);
				if(key === 'label') {
					//do nothing
				} else if (checked.indexOf(key) == -1) {
					delete combinedGrid[j][key];
				}
			}
		}
	}
	
	// console.log(combinedGrid);
	$scope.previewedGrid = combinedGrid;
	
	/////GRID//////
	
		var previewHeaderCellTemplate = 
	  '<div ng-class="{ \'sortable\': sortable }">'+
	  '<div class="ui-grid-vertical-bar"> </div>'+
	  '<div col-index="renderIndex" ng-mouseenter="hoverTopic = true" ng-mouseleave="hoverTopic = false" class="ui-grid-cell-contents">'+
	  '  {{ col.displayName CUSTOM_FILTERS }}<span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }"></span>'+
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
 		if($rootScopecheckedColumns.length > 0) {
 			toDelete = $scope.checkedColumns.indexOf(column);
 			if(toDelete != -1) {
 				$rootScope.checkedColumns.splice(toDelete, 1);
 			}
 		}
 	}
 };

 $scope.getPreviewTableHeight = function(grid,id) {
       var rowHeight = 30; // your row height
       var headerHeight = 30; // your header height
       if (id.split('_')[1] ==='0') {
          return {
              height: (($scope.previewedGrid.length+1) * rowHeight + headerHeight-12) + "px" };
       }
       else {
       return {
          height: ($scope.previewedGrid.length * rowHeight + headerHeight-14) + "px" };
       }
    };


$scope.previewGenerateColumnDefs= function() {
   var columnArry = [];
   var columnLayout = [];
   // pick a grid to iterate
   var oneGrid =  $scope.previewedGrid;
		if (oneGrid) { // at least one grid exist
			for (var  i=0; i<  oneGrid.length; i++) {

				
				for (var columnName in oneGrid[i]) {
					
					if (oneGrid[i].hasOwnProperty(columnName)) {

						if (columnName !== '$$hashKey' && columnName != 'label') {
							if (columnArry.indexOf(columnName) == -1) {
								columnArry.push(columnName);
							}
						}
					}
				}

			}

		}
    else {
       //  $scope.addDataColumn('label');
       // // columnArry.push('label');
       //  $scope.addDataColumn(''+$scope.eventdoc.dateCreated)
       //  columnArry.push(''+$scope.eventdoc.dateCreated);
    }
       columnArry.sort();
       columnArry.unshift('label');
       for(i=0; i< columnArry.length; i++) {
      // build columns defition object
         if (columnArry[i] === 'label') {
            oneColumnDef = {'field': columnArry[i], 'displayName':$scope.eventData.colDisplayNames[columnArry[i]] , enableSorting:false, minWidth: $scope.minTopicWidth,pinnedLeft:true,enableColumnMenu:false};
          }
         else {
            //var formattedDate = $filter('date')(columnArry[i],'mediumDate');
            oneColumnDef = {'field': columnArry[i], 'displayName' : $scope.eventData.colDisplayNames[columnArry[i]], enableSorting:false, minWidth:$scope.minColWidth, enablePinning:false, enableColumnMenu:false,headerCellTemplate: previewHeaderCellTemplate
          };
         }
            columnLayout.push(oneColumnDef);
       }
       //console.log(columnLayout)
       return columnLayout;
     
};


$scope.previewColumns = $scope.previewGenerateColumnDefs();

$scope.filterSelected = function(items) {
    var result = {};
    angular.forEach(items, function(value,key) {
        //console.log(key,' ',value)
        if (key != 'label' && (checked.indexOf(key) > -1)) {
            result[key] = value;
        }
    });
    return result;
}

	////END GRID///
});