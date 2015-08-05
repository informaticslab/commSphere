angular.module('app').controller('dashEventCtrl',function($scope, $rootScope, $http, $filter, $route,$routeParams, ngNotifier,ngIdentity,$modal,$location,$log,$document,$interval,$timeout, ngExcelExport) {

$scope.isCollapsed = true;
$scope.checkedRows =[];
$scope.checkedColumns = {};
$scope.contentloaded=false;
$scope.identity = ngIdentity;
$rootScope.continueNav = true;
//$rootScope.checkedColumns = {};
// $scope.numberOfColumns = Object.keys($scope.eventData.colDisplayNames).length;
$scope.canSubmit = true;
$scope.checkboxShow = false;
$scope.hideCheckbox = true;

$scope.tabCategory=[
                    {active:true}
                   ];
$scope.currentLocation = $location.url();
// grid setup

$scope.gridOptions={
  onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
    }
};
$scope.readyForPreview = false;
$scope.minColWidth = 110;
$scope.minTopicWidth = 200;
//$scope.googleChartObj = [];
//$scope.chartJsData =[];
$scope.highChartConfig = [];
$scope.chartColors = [ '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
             '#FF9655', '#FFF263', '#6AF9C4'];
// $scope.chartJsLineConfig = {
//             bezierCurve : true,
//             datasetFill : false,
//             responsive: true,
//             maintainAspectRatio: true,
//             legend:true,
//     //Number - Tension of the bezier curve between points
//             bezierCurveTension : 0.4,
//             legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
//             }
$scope.chartDefaultConfig = {
    'chartType'  :'line',
    'ChartTitle' :'Chart Title',
    'yAxis': {'title': {'text':'Count', 'style': {'color':'blue','fontSize':10,"fontWeight": "bold" }}},
    'xAxis': {'title': {'text' :undefined, 'style': {'color':'blue'}}},
    'seriesColors' : [ '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
             '#FF9655', '#FFF263', '#6AF9C4']
}
$scope.chartTypes = ['line'
                     ,'column'
                     ,'pie'
                     ,'bar'
                     ,'spline'
                     ,'area'
                     ,'areaspline'
                     ,'scatter'
                     //,'bubble'
                     //,'heatmap'
                     // ,'columnrange'
                    ]



//Prevent accidental leaving of dashboard event screen
$scope.$on('$locationChangeStart', function(event) {
  var nextLocation = $location.url();
  nextLocation = nextLocation.substring(0, nextLocation.indexOf("#"));
  if(nextLocation === $scope.currentLocation) {
    event.preventDefault();
  } else if (!$rootScope.continueNav){
      var answer = confirm("You have unsaved changes, do you want to continue?")
      if (!answer) {
          event.preventDefault();
      }
    }
});

$log.debug($routeParams.id);
$http.get('/api/events/id/'+$routeParams.id).then(function(res){
     if(res.data) {
     $log.debug(res.data[0]);
     $scope.eventdoc=res.data[0];
     $scope.contentloaded = true;



    //checking comepletion status for preview button display.
    var completedCount = 0;
    for (var i = 0; i < $scope.eventdoc.categories.length; i++) {
      if ($scope.eventdoc.categories[i].statusCompleted == true || $scope.eventdoc.categories[i].userAssigned =="") {
        completedCount++;
      }
    }
    if (completedCount === $scope.eventdoc.categories.length) {
      $scope.readyForPreview = true;
    } else {
      $scope.readyForPreview = false;
    }

     $http.get('api/events/data/'+$scope.eventdoc.eventInstanceId).then(function(dataResult){
        if (dataResult.data.length > 0 ){
       
            $scope.eventData = dataResult.data[0];
      //      $scope.addDataColumn2($scope.eventdoc.dateCreated);
            
             ////CUSTOMIZE REPORT////
              $scope.customizedDoc = {};
              $scope.customizedDoc.reportMeta = {title: '', type: ''};
              $scope.customizedDoc.docData = [];
              $scope.customizedDoc.reportMeta = $scope.eventdoc.reportMeta;
              $scope.customizedDoc.docData.push({sectionName: 'Daily Metrics', sectionType: 'Metrics',  sectionData:{doc:$scope.eventData, notes:$scope.eventdoc.notes.metrics}});
              $scope.customizedDoc.docData.push({sectionName: 'Charts', sectionType: 'Charts', sectionData:{notes:$scope.eventdoc.notes.charts}});
              $scope.customizedDoc.docData.push({sectionName: 'Media Summaries', sectionType: 'Document', sectionData:{doc:$scope.eventdoc, notes:$scope.eventdoc.notes.doc}});
              $scope.customizedDoc.eventDocId = $scope.eventdoc._id;
              $scope.customizedDoc.chartConfigs = $scope.eventdoc.chartConfigs || [];
              $scope.customizedDoc.checkedColumns = $scope.eventdoc.checkedColumns;



              if($scope.customizedDoc.selectedColumns !=  undefined) {
                $rootScope.checkedColumns = $scope.customizedDoc.selectedColumns;
              }
              
               ////////////////////////
            $scope.columns = $scope.generateColumnDefs();
            //$scope.chartDataFromDate = new Date($filter('date')($scope.columns[1].field , 'yyyy-MM-dd  h:mm a'));
            //$scope.chartDataToDate = new Date($filter('date')($scope.columns[$scope.columns.length-1].field , 'yyyy-MM-dd  h:mm a'));
            for(var i = 1; i < $scope.columns.length; i++) {
                $scope.checkedColumns[$scope.columns[i].field] =  {'checked':false};
            }
           for(var i = 0 ; i < $scope.eventData.gridData.length; i++) {
              for (var j = 0; j < $scope.eventData.gridData[i].dailyData.length; j++) {
                       $scope.checkedRows[i+'_'+j] = {'checked':false};
                      //   $scope.rowChecked(i,j);
              }
           }

            $scope.resetChart();

            $scope.gridOptions = {
              columnDefs : $scope.columns,
              onRegisterApi: function(gridApi) {
              $scope.gridApi = gridApi;
             }

            }
            //$scope.buildChartJsData();
            //showChartJs('chartJS_0', $scope.chartJsData[0]);

        } else {
          console.log ('data not available');  // add default record
            
        }

       
      });
     } else {
         alert('no data received, assign new id');
     }
});

            
$scope.date = new Date().getTime();
$scope.activeTab="tab_0";


//hide categories from coordinator if incomplete
$scope.hideFromCoordinator = function(category) {
  return !($scope.identity.isAuthorized('levelTwo') &&  (category.statusCompleted==false));
};

//show tabs only the tabes assigned to logged in user
$scope.filterTabForAnalyst = function(category) {
  if($scope.identity.currentUser)
  {
    return ((category.userAssigned.id == $scope.identity.currentUser._id) || $scope.identity.isAuthorized('levelTwo')); 
  }
};

$scope.returnToAnalyst = function(category) {
// set category statusCompleted flag back to false so analyst could access their assigned category
  unregister();
  category.statusCompleted = false;

  var data = { docId : $scope.eventdoc._id , categoryData : category};

  $http.post('/api/events/saveEventCategory',data).then(function(res) {
    if(res.data.success) {
         $rootScope.continueNav = true;
      ngNotifier.notify(data.categoryData.name  + " has been returned to "+ data.categoryData.userAssigned.displayName);
    } else {
      alert('There was an error, failed to return to analyst.');
    }
  });
  
};

// $scope.readyForPreview =  function() {
//   var completedCount = 0;
//   console.log($scope.eventdoc);
//   // for (var i = 0; i < $scope.eventdoc.categories.length; i++) {
//   //   if ($scope.eventdoc.categories[i].statusCompleted == true) {
//   //     completedCount++;
//   //   }
//   // }
//   // if (completedCount === $scope.eventdoc.categories.length) {
//   //   return true;
//   // } else {
//   //   return false;
//   // }
//   return true;
// };

$scope.gotoElement = function (eID){
      // // set the location.hash to the id of
      // // the element you wish to scroll to.
      // $location.hash(eID);
 
      // // call $anchorScroll()
      // anchorSmoothScroll.scrollTo(eID);
    var offset = 100; 
    var duration = 500;
    var someElement = angular.element(document.getElementById(eID));
    $document.scrollToElement(someElement, offset, duration);
      
    };

$scope.setActiveTab = function(tabId)
{
  $log.debug(tabId);
  $scope.activeTab=tabId;

};


    $scope.addBullet = function(subTopic,e) {
      $log.debug(subTopic);
      if (!subTopic.newBulletName || subTopic.newBulletName.length === 0) {
        return;
      }
      subTopic.bullets.push({
        name: subTopic.newBulletName,
        sortOrder: subTopic.bullets.length,
        type: 'bullet',
        editing:'',
        subBullets:[]
      });
      subTopic.newBulletName = '';
      e.preventDefault();
      // topic.save();
    };

    $scope.removeBullet = function(subTopic, bullet) {
      //if (window.confirm('Are you sure to remove this subTopic?')) {
        var index = subTopic.bullets.indexOf(bullet);
        if (index > -1) {
          subTopic.bullets.splice(index, 1)[0];
        }
        // topic.save();
      //}
    };

    $scope.editBullet = function(bullet) {
      bullet.editing=true;
    };

    $scope.saveBullet = function(bullet,e) {
      bullet.editing=false;
      e.preventDefault();
    };

    $scope.addSubBullet = function(bullet,e) {
      $log.debug(bullet);
      if (!bullet.newSubBulletName || bullet.newSubBulletName.length === 0) {
        return;
      }
      bullet.subBullets.push({
        name: bullet.newSubBulletName,
        sortOrder: bullet.subBullets.length,
        editing:'',
        type: 'subBullet'
      });
      bullet.newSubBulletName = '';
      e.preventDefault();
      // topic.save();
    };

    $scope.editSubBullet = function(subBullet) {
      subBullet.editing=true;
    };

    $scope.saveSubBullet = function(subBullet,e) {
      subBullet.editing=false;
      e.preventDefault();
    };

    $scope.removeSubBullet = function(bullet, subBullet) {
      //if (window.confirm('Are you sure to remove this subTopic?')) {
        var index = bullet.subBullets.indexOf(subBullet);
        if (index > -1) {
          bullet.subBullets.splice(index, 1)[0];
        }
        // topic.save();
      //}
     };

    $scope.editSubTopic = function(subTopic) {
      $log.debug("edit sub topic");
      subTopic.editing = true;
    };

    // $scope.cancelEditingSubTopic = function(topic) {
    //   topic.editing = false;
    // };

    $scope.saveSubTopic = function(subTopic) {
      // topic.save();
      subTopic.editing = false;
    };

      $scope.options = {
      accept: function(sourceNode, destNodes, destIndex) {
        var data = sourceNode.$modelValue;
        var destType = destNodes.$element.attr('data-type');
        return true;//(data.type == destType); // only accept the same type
      },
      dropped: function(event) {
        
        var sourceNode = event.source.nodeScope;
        var destNodes = event.dest.nodesScope;
        //console.log(event);
        if(destNodes.$element.attr('data-type')=="bullet")
        {
          //console.log("OK!!",sourceNode.subBullet.type)
          sourceNode.subBullet.type="bullet";
          sourceNode.subBullet.subBullets=[];
        }
        if(destNodes.$element.attr('data-type')=="subBullet")
        {

          console.log("WARNING!!",sourceNode.bullet.type)
          sourceNode.bullet.type="subBullet";
          delete sourceNode.bullet.bullets;
          //sourceNode.bullet.subBullets=[];
          delete sourceNode.bullet.newSubBulletName;
        }
        //delete sourceNode.subBullet.newSubBulletName;
        //sourceNode.subBullet.newBulletName="";
        //console.log(sourceNode.subBullet);
        // update changes to server
        if (destNodes.isParent(sourceNode)
          && destNodes.$element.attr('data-type') == 'subTopic') { // If it moves in the same topic, then only update topic
                    console.log("252");
          var topic = destNodes.$nodeScope.$modelValue;
          // topic.save();
        } else { // save all
       //   console.log("257");
       //   $scope.saveTopics();
        }
        // check for grid dropped event and update the chart
        if (sourceNode.grid) {
            $scope.buildChartJsData();
        }
      },
      beforeDrop: function(event) {
        // if (!window.confirm('Are you sure you want to drop it here?')) {
        //   event.source.nodeScope.$$apply = false;
        // }
      }
    };


$scope.saveCategory = function (status) {  // save data for the current tab

 var oneCategoryData;
 unregister();
 if (ngIdentity.isAuthorized('levelTwo'))
 { // coordinator save - save data from each category only if category statusCompleted flag = true
     $log.debug("i am in coordinator save");
     for(var i=0 ; i <$scope.eventdoc.categories.length; i++)
     {
       $log.debug($scope.eventdoc.categories[i]);
       if ($scope.eventdoc.categories[i].statusCompleted) {
            oneCategoryData = $scope.eventdoc.categories[i];
            var data = { docId : $scope.eventdoc._id , categoryData : oneCategoryData };
            saveOneCategory(data);
       }
     }
     ngNotifier.notify("Event has been saved!");
 }
 else
 {  // analyst save 
     for(var i=0 ; i <$scope.eventdoc.categories.length; i++)
     {
       if ($scope.eventdoc.categories[i].name == $scope.activeCategory) {
            oneCategoryData = $scope.eventdoc.categories[i];
            break;
       }
     }
      if (status === 'completed') {
        oneCategoryData.statusCompleted = true;
        oneCategoryData.dateCompleted = new Date().getTime();
      }
      else {
          oneCategoryData.statusCompleted = false;
      }
      var data = { docId : $scope.eventdoc._id , categoryData : oneCategoryData };
    
        $http.post('/api/events/saveEventCategory',data).then(function(res) {
    
            if(res.data.success) {
              if (oneCategoryData.statusCompleted === true) {
                ngNotifier.notify("Thank you. Your information has been submitted for review.");
                $location.path('/dashboard/');
              } else {
                ngNotifier.notify("Saved");
              }
            } else {
              alert('there was an error');
            }
          });
 }
 // data collected data here

 $http.post('/api/events/saveCollectedData',$scope.eventData).then(function(res){
        if(res.data.success){
          var unregister2=$scope.$watch('eventData', function(newVal, oldVal){
      if(newVal!=oldVal)
      {
        console.log('changed');
        if(oldVal == undefined){
            //do nothing
        } else {
          console.log('inside savecategory, metrics save')
          $rootScope.continueNav=false;
          $rootScope.preventNavigation =true;
          unregister2();
        }
      }
     
    }, true);
        } else {
             alert('there was an error');
        }

 });

 $rootScope.continueNav=true;
 $rootScope.preventNavigation = false;

 
};

function saveOneCategory(data) {
  // save category's data only
   $log.debug("i am in save one category" , data);
   $http.post('/api/events/saveEventCategory',data).then(function(res) {
              if(res.data.success) {
                 var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
                 $log.debug("watching");
                  if(newVal!=oldVal)
                  {
                    $log.debug('changed');
                    if(oldVal == undefined){
                        //do nothing
                    } else {
                      console.log('inside save one category')
                      $rootScope.continueNav=false;
                      $rootScope.preventNavigation =true;
                      unregister();
                    }
                    
                    $log.debug('oldVal: ', oldVal);
                    $log.debug('newVal: ', newVal);
                  }
                 
                }, true);
              } else {
                alert('there was an error');
              }
            });
            
}

function getLatestInstance(partialId)
    { 
      $log.debug(partialId);
       
       $http.get('/api/events/getAvailEventId/'+partialId).then(function(res){
        $log.debug(partialId);
         $log.debug(res.data);
         if(res.data) {
             if(res.data.length>0)
             {
                $log.debug("ID alreADy prsent");
                 return partialId+"xx";
             }
             else
             {
                $log.debug("id available to be used");
                $log.debug(partialId);
                return partialId;
             }
             
             } else {
                 alert('no data received, assign new id');
             }
        });

       
    }

    function genInstanceId(eventName)
    {
        var nameComponent = eventName.toUpperCase().split(' ');
        var instanceId;
        if (nameComponent.length > 1)
            instanceId = nameComponent[0].substr(0,2) + nameComponent[1].substr(0,2)+ '-'+ '01';  
        else
            instanceId = nameComponent[0].substr(0,4)+ '-' + '01';
        return instanceId;
    }
    
$scope.showInfo = function() {
  // function to activate "moreinfomodal"
   var modalInstance = $modal.open({
      scope:$scope,
      templateUrl: '/partials/moreInfoModal',
      controller: infoModalInstanceCtrl,
      windowClass: 'center-modal',
      size: 'md',
      resolve: {
         instance: function () {
           return $scope.eventdoc;
         }
       }
      
    });
};


var infoModalInstanceCtrl = function ($scope, $modalInstance) {
// controller for More Information modal popup 
$scope.instance = {};
$log.debug('instance in modal ',$scope.instance);
var categoryCount = 0;
var completedCount = 0;


for (var i = 0 ; i < $scope.eventdoc.categories.length; i++) 
   
{ 
  var oneCategory =  $scope.eventdoc.categories[i];
  var topicCount=oneCategory.topics.length;
      var subTopicCount = 0;
      for (topic in oneCategory.topics) {
        $log.debug('topic object',topic);
        subTopicCount=oneCategory.topics[topic].subTopics.length+subTopicCount;
      }
            
 $scope.instance[oneCategory.name]={topicCount:topicCount,subTopicCount:subTopicCount,name:oneCategory.name,userAssigned:oneCategory.userAssigned.displayName,statusCompleted:oneCategory.statusCompleted,dateCompleted:oneCategory.dateCompleted};
}

$log.debug('eventdoc ',$scope.eventdoc);
  $scope.ok = function () {

    $modalInstance.close();

  };

  $scope.cancel = function () {

    $modalInstance.dismiss();

  };

  $log.debug('instance object:',$scope.instance);

};



function getNodeCount(document) { 
  var nodeCount = 0;
  for (node in document) {
        nodeCount++;
  }
  return nodeCount;
};

$scope.setActiveCategory = function(category)
// retrieve category for the selected category tab
{
  $scope.activeCategory= category;
  $scope.activeTab="tab_0";
};



 
 var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
   $log.debug("watching");
    if(newVal!=oldVal)
    {
      $log.debug('changed');
      if(oldVal == undefined){
          //do nothing
      } else {
        console.log('inside main eventdoc unregister')
        $rootScope.continueNav=false;
        $scope.canSubmit = false;
        $rootScope.preventNavigation=true;
        unregister();
      }
      
    }
   
  }, true);

  var unregister2=$scope.$watch('eventData', function(newVal, oldVal){
  
    if(newVal!=oldVal)
    {
      $log.debug('changed');
      if(oldVal == undefined){
          //do nothing
      } else {
        console.log('old obj ', oldVal);
        console.log('new obj ', newVal);
        console.log('inside main eventData unregister 2')
        $rootScope.continueNav=false;
        $scope.canSubmit = false;
        $rootScope.preventNavigation=true;
        unregister2();
      }
      
    }
   
  }, true);

 $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'row selected ' + row.isSelected;
        console.log.log(msg);
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        var msg = 'rows changed ' + rows.length;
        console.log(msg);
      });

      gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };

$scope.addDataColumn= function(columnName,displayName){

 for(var i=0; i < $scope.eventData.gridData.length; i++) {
        var oneGrid = $scope.eventData.gridData[i];
        for (var j=0; j < oneGrid.dailyData.length; j++) {
           if (oneGrid.dailyData[j].hasOwnProperty(columnName)) {
           } else {  // column not exists, add
               oneGrid.dailyData[j][columnName] = '*';
               // also add a display name for it
               $scope.eventData.colDisplayNames[columnName] = displayName;
           }
        }
  }
  
};


$scope.addTable = function(grid) {
  if (grid) {
  if (grid.newGridName.length > 0) {
    var initialRow = {
     'label' : ''
    }
    var initialColName = {
      'label' : 'Label'
    }
    if ($scope.columns) {
      if ($scope.columns.length >0) {
      for(i = 0; i < $scope.columns.length; i++) {
         if ($scope.columns[i].field !== 'label') {
           initialRow[$scope.columns[i].field] = '*';  
           initialColName[$scope.columns[i].field] =  $filter('date')($scope.columns[i].field,'mediumDate');
        }
      }
    }
  }
  else {
           var newColumn = ''+$scope.eventdoc.dateCreated
           initialRow[newColumn] = '*'; 
       }
  
  $scope.eventData.gridData.push({
            gridId: $scope.eventData.gridData.length,
            gridName: grid.newGridName,
            dailyData: [initialRow]
            });
  $scope.eventData.colDisplayNames = initialColName;
  if (!$scope.columns) {
    $scope.columns = $scope.generateColumnDefs();
  }
  grid.newGridName="";
  }
}
};

$scope.removeTable = function(gridName) {
    for(var i=0; i < $scope.eventData.gridData.length ; i++){
        if ($scope.eventData.gridData[i].gridName === gridName) {
              $scope.eventData.gridData.splice(i,1);
        }
    }
    
}
$scope.editTableName = function(grid) {
  grid.editing = true;
};

$scope.cancelEditingTable = function(grid) {
  grid.editing = false;
};


$scope.saveTableName = function(grid,e) {
    // topic.save();
    grid.editing = false;
    e.preventDefault();
  };

$scope.editColName = function(col) {
   col.editing = true;
   col.orgName = col.displayName;
}

$scope.cancelEditingColName = function(col) {
   col.editing = false;
}

// $scope.saveColName = function(col,e) {
//     // topic.save();
//     col.editing = false;
//     e.preventDefault();
//     console.log(col.newColName);
//     if (col.displayName !== col.newColName && col.newColName !== '' && col.newColName.length>0) {
//         $scope.eventData.colDisplayNames[col.field] = col.newColName;
//         $scope.columns = [];
//         $timeout( function(){ $scope.columns = $scope.generateColumnDefs() ||[]; }, 55);
//         $timeout( function(){ $scope.buildChartJsData(); }, 100);

//     }
//   };

$scope.saveColName = function(col,e) {
    // topic.save();
    col.editing = false;
    
    if (col.displayName !== '' && col.displayName.length>0) {
        $scope.eventData.colDisplayNames[col.field] = col.displayName;
        $scope.columns = [];
        $timeout( function(){ $scope.columns = $scope.generateColumnDefs() ||[]; }, 55);
        $timeout( function(){ $scope.buildChartJsData(); }, 50);
        return true;
    }
    else {
        alert('Column Name can not be blank')
        col.displayName = col.orgName;
        return false;
    }
    e.preventDefault();
  };

$scope.showGridCheckbox  = function() {
  console.log($scope.checkboxShow);
  $scope.checkboxShow = true;
  console.log($scope.checkboxShow);
};

$scope.hideGridCheckbox = function () {
  $scope.checkboxShow = false;
};

// $scope.isChecked = false;
// $scope.selectColumn = function(checked, column) {
//   console.log(column);
//   console.log(checked);
//   if(checked){
//     $scope.eventData.selectedColumns.push(column);
//     $scope.isChecked = true;
//   } else {
//     var index = $scope.selectColumns.indexOf(column);
//     $scope.eventData.selectedColumns[column] = false;
//     $scope.isChecked = false;
//   }


  
// };

var customHeaderCellTemplate = 
  '<div ng-class="{ \'sortable\': sortable }">'+
  '<div class="ui-grid-vertical-bar"> </div>'+
  '<div col-index="renderIndex" ng-show="!col.editing" ng-mouseenter="hoverTopic = true" ng-mouseleave="hoverTopic = false" class="ui-grid-cell-contents-head">'+
  '<a ng-show="hoverTopic" href="" ng-click="$event.stopPropagation(); grid.appScope.editColName(col)" class="del-edit-btn btn btn-default btn-xs pull-right"><i class="glyphicon glyphicon-pencil"></i></a>'+
  '  &nbsp;{{ col.displayName CUSTOM_FILTERS }}'+
  '</div>'+
  '<div ng-show="col.editing"  class="ui-grid-cell-contents-head">'+
  '<label for="displayName" class="sr-only">Column Name</label>'+
  '<input class="form-control input-sm" type="text" placeholder="Column Name" ng-model="col.displayName" ng-keydown="$event.keyCode==13 ? grid.appScope.saveColName(col,$event) : null" ng-blur="grid.appScope.saveColName(col,$event)"/></a><span ui-grid-visible="col.sort.direction" ng-class="{ \'ui-grid-icon-up-dir\': col.sort.direction == asc, \'ui-grid-icon-down-dir\': col.sort.direction == desc, \'ui-grid-icon-blank\': !col.sort.direction }"></span>'+
  '</div>'+
  '<div ng-if="grid.options.enableColumnMenus &amp;&amp; !col.isRowHeader &amp;&amp; col.colDef.enableColumnMenu !== false" ng-click="toggleMenu($event)" class="ui-grid-column-menu-button"><i class="ui-grid-icon-angle-down"> </i></div>'+
  '<div ng-if="filterable" ng-repeat="colFilter in col.filters" class="ui-grid-filter-container">'+
  '  <input type="text" ng-model="colFilter.term" ng-click="$event.stopPropagation()" ng-attr-placeholder="{{colFilter.placeholder || \'\'}}" class="ui-grid-filter-input"/>'+
  '  <div ng-click="colFilter.term = null" class="ui-grid-filter-button"><i ng-show="!!colFilter.term" class="ui-grid-icon-cancel right"> </i>'+
  '    <!-- use !! because angular interprets \'f\' as false-->'+
  '  </div>'+
  '</div>'+
  '</div>';

var customHeaderCellTemplate0 = 
  '<div ng-class="{ \'sortable\': sortable }">'+
  '<div class="ui-grid-vertical-bar"> </div>'+
  '<div col-index="renderIndex" ng-mouseenter="hoverTopic = true" ng-mouseleave="hoverTopic = false" class="ui-grid-cell-contents-head">'+
  '  &nbsp;{{ col.displayName CUSTOM_FILTERS }}'+
  '</div>';


$scope.generateColumnDefs= function() {
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
            oneColumnDef = {'field': columnArry[i], 'displayName':$scope.eventData.colDisplayNames[columnArry[i]] , enableSorting:false, minWidth: $scope.minTopicWidth,pinnedLeft:true,headerCellTemplate: customHeaderCellTemplate0};
          }
         else {
            //var formattedDate = $filter('date')(columnArry[i],'mediumDate');
            oneColumnDef = {'field': columnArry[i], 'displayName' : $scope.eventData.colDisplayNames[columnArry[i]], enableSorting:false, minWidth:$scope.minColWidth, enablePinning:false, enableColumnMenu:false
            //,headerCellTemplate: '/partials/customHeaderCellTemplate'
            ,headerCellTemplate: customHeaderCellTemplate
          }
         }
            columnLayout.push(oneColumnDef);
       }
       //console.log(columnLayout)
       return columnLayout;
     
};

$scope.getChartData = function(grid) {
  var chartCategories= [];
  var chartCategoriesHeading= [];
  var serieData = [];
  var series = [];
  var chartData = {};
 
  for (i = 0; i < grid.dailyData.length; i ++) {
  var oneRow =  grid.dailyData[i];
  if (i == 0) { // pick first row and generate the chart categories
      for (var oneCol in oneRow) {
         if (oneCol !== '$$hashKey' && oneCol !=='label') {
          // reformat to display on chart
            chartCategories.push(oneCol);
           // chartCategoriesHeading.push($filter('date')(oneCol,'d-MMM'));
            chartCategoriesHeading.push($scope.eventData.colDisplayNames[oneCol]);
       }
      }
      chartCategories.sort();   // sort the remaining columns heading
  }
  serieName = oneRow['label'];
     for (var j=0 ; j < chartCategories.length; j++) { 
           var colValue = Number(oneRow[chartCategories[j]]);
            serieData.push({'name': $scope.eventData.colDisplayNames[chartCategories[j]], 'y': (isNaN(colValue)? null : colValue)});
         }
  var newSerie = {name: serieName, data: serieData, color: $scope.chartDefaultConfig.seriesColors[i]  }
      series.push(newSerie);
      serieData = [];
       //console.log(series);
  }
  chartData['xAxis'] = chartCategoriesHeading;
  chartData['series'] = series;
  //console.log(chartData);
  return  chartData;
     
}


$scope.$on('uiGridEventEndCellEdit', function (evt) {
  // console.log(evt.targetScope.row.grid.appScope);
   var gridIndex = evt.targetScope.row.grid.appScope.$parent.$index;
   //var chartId = 'chartJS_'+ gridIndex;
   //$scope.chartJsData[gridIndex] = $scope.getOneChartJsData($scope.eventData.gridData[gridIndex]);
   //$scope.highChartConfig[gridIndex] = $scope.buildHighChartData($scope.eventData.gridData[gridIndex],gridIndex);
   $scope.buildHighChartData($scope.eventData.gridData[gridIndex],gridIndex);
   //$scope.googleChartObj[gridIndex] =  $scope.buildGoogleChartData($scope.eventData.gridData[gridIndex]);
});

$scope.$on('uiGridEventData', function (gridId) {
    console.log('grid event fired ', gridId);
})

$scope.removeColumn = function() {
     var lastColumnName = $scope.columns[$scope.columns.length-1].field.toString();
     if (lastColumnName !=='label') {
     $scope.columns.splice($scope.columns.length-1, 1);
     for(var i=0; i < $scope.eventData.gridData.length; i++) {
          for(var j=0; j<$scope.eventData.gridData[i].dailyData.length; j++){
             if ($scope.eventData.gridData[i].dailyData[j].hasOwnProperty(lastColumnName)) {
                delete $scope.eventData.gridData[i].dailyData[j][lastColumnName];
                delete $scope.eventData.colDisplayNames[lastColumnName];
             } else {  // column not exists, add
             }
          }
      }
    }
  }
  
  $scope.addColumn = function() {
    
    var newColumnName =  ''+new Date().getTime();
    var formattedDate = $filter('date')(newColumnName,'mediumDate');  // default display name for date
    $scope.columns.push({ 'field': newColumnName, 'displayName' : formattedDate, enableSorting: false, minWidth:$scope.minColWidth, enablePinning:false, enableColumnMenu:false
      //, headerCellTemplate: '/partials/customHeaderCellTemplate'
      , headerCellTemplate: customHeaderCellTemplate
    });
    $scope.addDataColumn(newColumnName,formattedDate);
  }

 
  $scope.splice = function() {
    $scope.columns.splice(1, 0, { field: 'company', enableSorting: false });
  }
 
  $scope.unsplice = function() {
    $scope.columns.splice(1, 1);
  }

  $scope.addRow = function(grid,id) {
    var n = grid.dailyData.length + 1;
    grid.dailyData.push({
                
              });
    // var myGrid = angular.element( document.querySelector( '#'+id ) );
    // myGrid.css('height',(n+2)*30);
  };

  $scope.removeLastRow = function(grid,id) {

    var n = grid.dailyData.length;
    grid.dailyData.pop();

  }
  $scope.getTableHeight = function(grid,id) {
       var rowHeight = 30; // your row height
       var headerHeight = 30; // your header height
       $('.ui-grid-viewport').height("100%")
       //console.log(grid,id);
       //if (id.split('_')[1] ==='0') {
          return {
              //height: ((grid.dailyData.length+1) * rowHeight + headerHeight-12) + "px"
              height: ((grid.dailyData.length * rowHeight)+38)+"px"
            };
       //}
       // else {
       // return {
       //    height: (grid.dailyData.length * rowHeight + headerHeight) + "px" };
       // }
    };

 $scope.renameColumn = function(col,newColName) {
     $scope.eventData.colDisplayNames[col.field] = newColName;
     // for (i = 0; i < $scope.columns.length; i++) {
     //    if ($scope.columns[i].field === col.field) {
     //          console.log($scope.columns[i]);
     //          $scope.columns[i].displayName = newColName;
     //          console.log($scope.columns[i]);
     //          break; 
     //    }
    //}
     $scope.columns = [];
     $timeout( function(){ $scope.columns = $scope.generateColumnDefs() ||[]; }, 100);
     $timeout( function(){ $scope.buildChartJsData(); }, 100);
  }

  var customizeReportModalInstanceCtrl = function($scope, $modalInstance, eventdoc, eventData, gridOptions, gridApi) {
    $scope.eventdoc = eventdoc;
    $scope.eventData = eventData;
    $scope.gridOptions = gridOptions;
    $scope.gridApi = gridApi;


    $scope.ok = function() {
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  };

  $scope.customize = function(size,eventdoc,eventData, gridOptions, gridApi) {
    var modalInstance = $modal.open({
      scope: $scope,
      templateUrl: '/partials/customizeReportModal',
      controller: customizeReportModalInstanceCtrl ,
      backdrop: 'static',
      size: size,
      resolve: {
         eventdoc: function () {
           return eventdoc;
         },
          eventData: function() {
            return eventData;
          },
          gridOptions: function() {
            return gridOptions;
          },
          gridApi: function() {
            return gridApi;
          }
         
       }
    });
  };

$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
   // $timeout(function () { $scope.tabCategory[0].active = true; },100);
});

  $scope.buildOneGridChartData = function(index) {
    $timeout(function() {
        //$scope.chartJsData[index] = $scope.getOneChartJsData($scope.eventData.gridData[index]);
        //$scope.highChartConfig[index] = $scope.buildHighChartData($scope.eventData.gridData[index],index);
        $scope.buildHighChartData($scope.eventData.gridData[index],index);
        //$scope.googleChartObj[index] =  $scope.buildGoogleChartData($scope.eventData.gridData[index]);
      },400)

  };

  $scope.buildChartJsData = function (){

       for (x=0; x < $scope.eventData.gridData.length; x++) {
        //$scope.chartJsData[x] = $scope.getOneChartJsData($scope.eventData.gridData[x]);
        //$scope.highChartConfig[x] = $scope.buildHighChartData($scope.eventData.gridData[x],x);
        $scope.buildHighChartData($scope.eventData.gridData[x],x);
        //$scope.googleChartObj[x] =  $scope.buildGoogleChartData($scope.eventData.gridData[x]);
      }

  }
  
  // $scope.buildGoogleChartData = function(grid) {
  //   var chartData = $scope.getChartData(grid);
  //   var cols = [];
  //   var rows = [];
  //   var oneRow = [];
  //   var rawdata = [];
   
    
  //   for (i=0; i < chartData.series.length; i++) {
  //       oneRow.push(chartData.series[i].name);
  //   }
  //   oneRow.unshift('Date');
  //   rows.push(oneRow);
  //   oneRow=[];
  //   for (i=0; i < chartData.xAxis.length; i++){
  //        oneRow.push(chartData.xAxis[i]);
  //        for (j=0; j < chartData.series.length; j++) {
  //            oneRow.push(chartData.series[j].data[i]);

  //        }
  //        rows.push(oneRow);
  //        oneRow=[];
  //   }     
         
    //console.log(rows); 
    // for (i=0; i < chartData.series.length; i++) {
    //     for (j = 0 ; j < chartData.series[i].data.length; j++) {

    //     }
    //     if (i === 0) {
    //       rows.push({"v"})
    //     }
    // }
   //console.log(rows);
// 

  $scope.buildHighChartData = function(grid,index) {
    // console.log($scope.chartDefaultConfig.yAxis);
     var chartData = $scope.getChartData(grid);
     //console.log($scope.highChartConfig);
     if ($scope.highChartConfig[index] != undefined) {
          $scope.highChartConfig[index].title.text = grid.gridName
          $scope.highChartConfig[index].series = chartData.series;
          $scope.highChartConfig[index].xAxis.categories = chartData.xAxis;
     }
     else {
          $scope.highChartConfig[index] =      
          {
            options: {
              chart: {
                  type: $scope.chartDefaultConfig.chartType,
              },
              yAxis : [{
                        title: $scope.chartDefaultConfig.yAxis.title, 
                        //type: "logarithmic"
                        type : "linear"
            }]
            },
            series: chartData.series,
            title: {
                      text: grid.gridName
            },
            xAxis: { 
                      title : $scope.chartDefaultConfig.xAxis.title, 
            categories: chartData.xAxis
             },
            
                loading: false
            };
                                               
     }
     //return highChartConfig;   
     //console.log($scope.highChartConfig);   
  }
   
  $scope.addYaxis = function(chartIndex,yAxisId, serieId,side) {
    var oneYaxis = {
                  title: $scope.chartDefaultConfig.yAxis.title, 
                  //type: "logarithmic",
                  type : "linear",
                  opposite : function() { if (side == 'right') {
                                                 return true
                                             } else {
                                                 return false;
                                             }
                                         }
                                       }
        $scope.highChartConfig[chartIndex].options.yAxis.push(oneYaxis);
        $scope.highChartConfig[chartIndex].series[serieId].yAxis = yAxisId;
  }


  // $scope.getOneChartJsData = function (grid){
 
  //        var chartData = $scope.getChartData(grid);
  //        //console.log('chart data '+x ,chartData)
  //        var datasets = [];
  //         for (i= 0; i < chartData.series.length; i++){
  //           dataset =  {
  //                         label: chartData.series[i].name,
  //                         //fillColor: "rgba(220,220,220,0.2)",
  //                         strokeColor: $scope.chartColors[i],
  //                         pointColor: $scope.chartColors[i],
  //                         // pointStrokeColor: color,
  //                         // pointHighlightFill: color,
  //                         // pointHighlightStroke: color,
  //                         data: chartData.series[i].data
  //                       }
  //           datasets.push(dataset);
  //       }
  //       var oneChartJsData = {
  //         labels: chartData.xAxis,
  //         datasets: datasets
  //       }
  //       return oneChartJsData;
  // };
  $scope.getFormattedDate = function(timeStamp) {
     //////var isoDate = $filter('date')(timeStamp,'yyyy-MM-ddTHH:mm:ss.sss') ;
     //return isoDate;
     return timeStamp;
  }
  
  $scope.showChartJs = function(chartId,chartJsData) {
  
   var colors = [ "#FF0000","#0000FF"];
   //var chartJsData = [];
   var chartData =  [];
   var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};
 try {
    var chartJsConfig = {
            bezierCurve : true,
            datasetFill : false,
            responsive: true,
            maintainAspectRatio: true,
            legend:false,
    //Number - Tension of the bezier curve between points
            bezierCurveTension : 0.4
            //legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
            }
 var ctx = document.getElementById(chartId).getContext("2d");
 ctx.canvas.width = 500;
 ctx.canvas.height = 300;
 window.myLineChart = new Chart(ctx).Line(chartJsData, chartJsConfig);
  }
 finally {

 }
}


  /////////////CUSTOM REPORT////////////////


  $scope.minColWidth = 110;
  $scope.minTopicWidth = 200;

  $scope.saveCustomizedReport = function() {
    for (var i = 0; i < $scope.customizedDoc.docData.length; i++) {
      if ($scope.customizedDoc.docData[i].sectionData.notes != undefined) {
        if ($scope.customizedDoc.docData[i].sectionType == 'Document') {
          $scope.eventdoc = $scope.customizedDoc.docData[i].sectionData.doc;
          $scope.eventdoc.notes.doc = $scope.customizedDoc.docData[i].sectionData.notes;
        } else if ($scope.customizedDoc.docData[i].sectionType == 'Metrics') {
          $scope.eventdoc.notes.metrics = $scope.customizedDoc.docData[i].sectionData.notes;
        } else if ($scope.customizedDoc.docData[i].sectionType == 'Charts') {
          $scope.eventdoc.notes.charts = $scope.customizedDoc.docData[i].sectionData.notes;
        }
      }
    }
    $scope.eventdoc.reportMeta = $scope.customizedDoc.reportMeta;
    // chart custom configuration save
    for(config in $scope.customizedDoc.chartConfigs){
              config.series = undefined;
              config.categories = undefined
          }
    //console.log("Checked Columns ", $rootScope.checkedColumns);
    $scope.eventdoc.checkedColumns = $scope.customizedDoc.checkedColumns;
    $scope.eventdoc.chartConfigs = $scope.customizedDoc.chartConfigs;
    //$scope.eventdoc.selectedColumns = $rootScope.checkedColumns;
    //$scope.eventdoc.columnsList = $scope.columnsList;


    var eventdoc = {};
    eventdoc = $scope.eventdoc;
    //console.log(customDoc);
    console.log($scope.eventdoc);
    $http.post('/api/events', eventdoc).then(function(res) {
      if (res.data.success) {
        console.log('Customized report saved');
        ngNotifier.notify('Your customized report has been saved');
           var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
     $log.debug("watching");
      if(newVal!=oldVal)
      {
        $log.debug('changed');
        if(oldVal == undefined){
            //do nothing
        } else {
          console.log(' inside save customized repport')
          $rootScope.continueNav=false;
          $rootScope.preventNavigation =true;
          unregister();
        }
        
        $log.debug('oldVal: ', oldVal);
        $log.debug('newVal: ', newVal);
      }
     
    }, true);
      } else {
        console.log(res.data.err);
      }
    });


 $http.post('/api/events/saveCollectedData',$scope.eventData).then(function(res){
        if(res.data.success){
             var unregister2=$scope.$watch('eventData', function(newVal, oldVal){
      if(newVal!=oldVal)
      {
        console.log('changed');
        if(oldVal == undefined){
            //do nothing
        } else {
          console.log('inside customized report save, save collected data')
          $rootScope.continueNav=false;
          $rootScope.preventNavigation =true;
          unregister2();
        }
      }
     
    }, true);
        } else {
             alert('there was an error');
        }

 });
   $rootScope.continueNav = true;
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

  $scope.preview = function(size, customizedDoc, hiddenChartConfigs) {
    var modalInstance = $modal.open({
      scope: $scope,
      templateUrl: '/partials/previewReportModal',
      controller: previewReportModalInstanceCtrl,
      size: size,
      resolve: {
        customizedDoc: function() {
          return customizedDoc;
        },
        hiddenChartConfigs : function() {
          return hiddenChartConfigs;
        }
      }
    });
  };

  var previewReportModalInstanceCtrl = function($scope, $modalInstance) {

    $scope.ok = function() {
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
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


  $scope.autoResizeHGridack=function()
  {
    console.log($("#gridRow").css("padding"));
    var padValue=$("#gridRow").css("padding").slice(0,$("#gridRow").css("padding").length-2);
    console.log(padValue);
    padValue++;
    $("#gridRow").css("padding",padValue+"px");
    console.log($("#gridRow").css("padding"));
    padValue--;
    $("#gridRow").css("padding",padValue+"px");
    console.log($("#gridRow").css("padding"));
  }
  /////////////////////////////////////////
// new chart tab functions
  $scope.checkedColsChanged = function(){

    var chartData = $scope.getRowData();
    if ($scope.highChartTempConfig) {
      $scope.highChartTempConfig.series = chartData.series;
      $scope.highChartTempConfig.xAxis.categories = chartData.xAxis;
    }
  }
  $scope.rowChecked = function(grid,row) {
   //  console.log($scope.checkedColumns);
     var chartData = $scope.getRowData();
     if ($scope.highChartTempConfig) {
         $scope.highChartTempConfig.series = chartData.series;
         $scope.highChartTempConfig.xAxis.categories = chartData.xAxis;
         // reset y axises
         $scope.highChartTempConfig.options.yAxis = [];
         for(i=0; i < chartData.series.length; i ++) {
            var oneYaxis = {
            title: angular.copy($scope.chartDefaultConfig.yAxis.title), 
                      //type: "logarithmic",
                  type : "linear",
                  showEmpty : false,
                  opposite  : false,
                  style     : {color : chartData.series[i].color},
                  id: 'Y-Axis '+(i+1)
         }  
        $scope.highChartTempConfig.options.yAxis.push(oneYaxis);           
    } 
     }
     else {
      //console.log('chart data ', chartData );
     $scope.highChartTempConfig = { options: {
      //This is the Main Highcharts chart config. Any Highchart options are valid here.
      //will be overriden by values specified below.
                                chart: {
                                    type: 'line',
                                    polar: false
                                    },
                                tooltip: {
                                    style: {
                                        padding: 10,
                                        fontWeight: 'bold'
                                    }
                                },
                                yAxis : [],
                                },
                                series: chartData.series,
                                xAxis: { 
                                          title : $scope.chartDefaultConfig.xAxis.title, 
                                          categories: chartData.xAxis
                                },
                                
                                loading: false,
                              //size (optional) if left out the chart will default to size of the div or something sensible.
                                // size: {
                                //   width: 600,
                                //   height: 400
                                // },
                                title: {
                                          text: "chart title",
                                          style : {fontWeight: 'bold', fontSize:20}
                                },
                                //function (optional)
                                func: function (chart) {
                                 //setup some logic for the chart
                                }
                              };    
  for(var i=0; i < chartData.series.length; i ++) {
       // console.log('i am in chartdata series')
        var oneYaxis = {
        title: angular.copy($scope.chartDefaultConfig.yAxis.title), 
                  //type: "logarithmic",
                  type : "linear",
                  showEmpty : false,
                  opposite  : false,
                  style     : {color : chartData.series[i].color},
                  id        : 'Y-Axis '+ (i+1)
              }  
        $scope.highChartTempConfig.options.yAxis.push(oneYaxis);           
    } 
  }
}
  
  $scope.getRowData = function() {
  var chartCategories= [];
  var chartCategoriesHeading= [];
  var serieData = [];
  var series = [];
  var chartData = {};
  var checkedRowCount = 0;
  var headingSet = false;
  for(var oneCheckedRow in $scope.checkedRows) {
    if ($scope.checkedRows[oneCheckedRow].checked) {
        var grid = $scope.eventData.gridData[oneCheckedRow.split('_')[0]];
        //console.log('grid = ',grid)
        var oneRow =  grid.dailyData[oneCheckedRow.split('_')[1]];
        //console.log('row = ', oneRow);
        serieName = oneRow['label'];
        //console.log($scope.checkedColumns)
        for (var oneCol in $scope.checkedColumns) {
           if ($scope.checkedColumns[oneCol].checked) {
            // reformat to display on chart
             if (chartCategories.indexOf(oneCol) == -1) { 
                chartCategories.push(oneCol);
                // chartCategoriesHeading.push($filter('date')(oneCol,'d-MMM'));
                //chartCategoriesHeading.push($scope.eventData.colDisplayNames[oneCol]);
              }
            }
        }
        chartCategories.sort();   // sort the remaining columns heading
        if (!headingSet) {
          headingSet = true;
          for (var j=0 ; j < chartCategories.length; j++) { 
              chartCategoriesHeading.push($scope.eventData.colDisplayNames[chartCategories[j]]);
          }
        }
        for (var j=0 ; j < chartCategories.length; j++) { 
           var colValue = Number(oneRow[chartCategories[j]]);
           serieData.push({'name': $scope.eventData.colDisplayNames[chartCategories[j]], 'y': (isNaN(colValue)? null : colValue)});
        }
        var newSerie = {name: serieName, data: serieData, color: $scope.chartDefaultConfig.seriesColors[checkedRowCount], yAxis : 0   }
          series.push(newSerie);
          serieData = [];
          checkedRowCount++;
    }
  }
      chartData['xAxis'] = chartCategoriesHeading;
      chartData['series'] = series;
      //console.log('chart data inside get row data ',chartData);
  return  chartData;
}

$scope.refreshCheckedCols = function() {
 //  console.log($scope.chartDataFromDate);
    var rawFromDate = new Date($scope.chartDataFromDate).getTime();
    var rawToDate = new Date($scope.chartDataToDate).getTime()+ 86400000;
   for(var i = 1; i < $scope.columns.length; i++) {
      var col = Number($scope.columns[i].field);
      //console.log('col = ', col);
      if (( col >= rawFromDate ) && (col <= rawToDate)) {
        $scope.checkedColumns[col].checked = true;
      }
      else {
        $scope.checkedColumns[col].checked = false;
      }
  }
  $scope.checkedColsChanged();
}

$scope.todateChanged = function (newDate, oldDate) {
    //console.log(newDate);
    //console.log(oldDate);
    $scope.chartDataToDate = newDate;
    $scope.refreshCheckedCols();
}

$scope.fromdateChanged = function (newDate, oldDate) {
    //console.log(newDate);
    //console.log(oldDate);
    $scope.chartDataFromDate = newDate;
    $scope.refreshCheckedCols();
}

$scope.selectAllColumns = function() {
  for(var i = 1; i < $scope.columns.length; i++) {
      var col = Number($scope.columns[i].field);
      if ($scope.checkedColumns[col]) {
        $scope.checkedColumns[col].checked = true;
      }
      else {
        $scope.checkedColumns[col] = {'checked':true};
      }
      }
  $scope.checkedColsChanged();
}

$scope.deSelectAllColumns = function() {
  for(var i = 1; i < $scope.columns.length; i++) {
      var col = Number($scope.columns[i].field);
        $scope.checkedColumns[col].checked = false;
      }
  $scope.checkedColsChanged();
}

$scope.deleteChart = function(index) {
    if ($scope.customizedDoc.chartConfigs) {
      $scope.customizedDoc.chartConfigs.splice(index, 1);
    }
}

$scope.addChart = function() {
  if ($scope.highChartTempConfig){
     // $scope.highChartTempConfig.size = { width: 400, height: 320};
      $scope.customizedDoc.chartConfigs.unshift(JSON.parse(JSON.stringify($scope.highChartTempConfig)));
  }

}
$scope.editChart = function(index) {
   if ($scope.customizedDoc.chartConfigs[index]) {
      $scope.highChartTempConfig = JSON.parse(JSON.stringify($scope.customizedDoc.chartConfigs[index]));
   }
}

$scope.selectAllRows = function() {
    for(var i = 0 ; i < $scope.eventData.gridData.length; i++) {
              for (var j = 0; j < $scope.eventData.gridData[i].dailyData.length; j++) {
                       $scope.checkedRows[i+'_'+j] = {'checked':true}
                       $scope.rowChecked(i,j);
              }
   }

}

$scope.deSelectAllRows = function() {
    //console.log('checked rows before ',$scope.checkedRows)
   for (var checkedRow in $scope.checkedRows) {
      $scope.checkedRows[checkedRow].checked = false;
   }
   //console.log('checked rows after ',$scope.checkedRows)
   $scope.checkedColsChanged();
}

$scope.resetChart  = function() {
   $scope.highChartTempConfig = { options: {
      //This is the Main Highcharts chart config. Any Highchart options are valid here.
      //will be overriden by values specified below.
                                chart: {
                                    type: 'line',
                                    polar: false
                                    },
                                tooltip: {
                                    style: {
                                        padding: 10,
                                        fontWeight: 'bold'
                                    }
                                },
                                yAxis : []
                                },
                                series: undefined,
                                xAxis: { 
                                          title : $scope.chartDefaultConfig.xAxis.title, 
                                          categories: undefined
                                },
                                
                                loading: false,
                              //size (optional) if left out the chart will default to size of the div or something sensible.
                                // size: {
                                //   width: 600,
                                //   height: 400
                                // },
                                title: {
                                          text: "chart title",
                                          style : {fontWeight: 'bold', fontSize:20}
                                },
                                //function (optional)
                                func: function (chart) {
                                 $timeout(chart.reflow(),200);
                                }
                              };  
       var oneYaxis = {
        title: angular.copy($scope.chartDefaultConfig.yAxis.title), 
                  //type: "logarithmic",
                  type : "linear",
                  showEmpty : false,
                  opposite  : false,
                  id        : 'Y-Axis 1'   
              }  
       $scope.highChartTempConfig.options.yAxis.push(oneYaxis);

  $scope.deSelectAllRows();
  $scope.deSelectAllColumns();
  $scope.highChartTempConfig.options.chart.type = '';
  $timeout(function(){$scope.highChartTempConfig.options.chart.type = 'line';},200);

  

}

//Export to excel
  // $scope.exportToExcel = function(tableId) { 
  //     $scope.exportHref = ngExcelExport.tableToExcel(tableId, 'sheet 1');
  //     $timeout(function() {
  //       location.href = $scope.exportHref;
  //     }, 100); // trigger download

  // }

  $scope.exportToExcel = function() {
    $('#dataTableForPrint').table2excel({
      exclude: ".excludeThisClass",
      name: "Worksheet Name",
      filename: "SomeFile" //do not include extension
    });



  };

$scope.fnExcelReport = function() {
    
  console.log("Table generation");
       // var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
       // var textRange; var j=0;
    var tab_text = document.getElementById('dataTableForPrintDiv').innerHTML; // id of table

    console.log(tab_text);
    // for(j = 0 ; j < tab.rows.length ; j++) 
    // {     
    //       tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
    //       //tab_text=tab_text+"</tr>";
    // }

    // tab_text=tab_text+"</table>";
    // tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    // tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    //             tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

   var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE "); 

     if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        {
               txtArea1.document.open("txt/html","replace");
               txtArea1.document.write(tab_text);
               txtArea1.document.close();
               txtArea1.focus(); 
                sa=txtArea1.document.execCommand("SaveAs",true,$scope.eventdoc.eventName+"-Daily Metrics.xls");
              }  
      else                 //other browser not tested on IE 11
          sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  


    return (sa);
  }

$scope.TableToExcel=function(tableid)
{
  var id = $('[id$="' + "dataTableForPrint" + '"]');
  var strCopy = $('<div></div>').html(id.clone()).html(); window.clipboardData.setData("Text", strCopy);
  var objExcel = new ActiveXObject("Excel.Application");
  objExcel.visible = false; var objWorkbook = objExcel.Workbooks.Add; var objWorksheet = objWorkbook.Worksheets(1); objWorksheet.Paste; objExcel.visible = true;
}

$scope.CreateExcelSheet=function()
{
  var x= document.getElementById( "dataTableForPrint" ).rows;
  
  var xls = new ActiveXObject("Excel.Application");

  xls.visible = true;
  xls.Workbooks.Add
  for (i = 0; i < x.length; i++)
  {
  var y = x[i].cells;
  
  for (j = 0; j < y.length; j++)
  {
  xls.Cells( i+1, j+1).Value = y[j].innerText;
  }
  }
  xls.Visible = true;
  xls.UserControl = true;

  return xls;
}

});