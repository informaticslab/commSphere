angular.module('app').controller('dashEventCtrl',function($scope, $rootScope, $http, $filter, $route,$routeParams, ngNotifier,ngIdentity,$modal,$location,$log,$document) {

$scope.contentloaded=false;
$scope.identity = ngIdentity;
$rootScope.continueNav = true;
$scope.canSubmit = true;
$scope.tabCategory=[
                    {active:true}
                   ];
$scope.currentLocation = $location.url();
// grid setup

$scope.gridOptions={};
$scope.readyForPreview = false;
$scope.minColWidth = 110;
$scope.minTopicWidth = 200;
$scope.chartData ={};
$scope.highChartConfig = {};
// $scope.eventData = {
//     "eventName": "",
//     "eventType": "",
//     "eventInstanceId": "",
//     gridData: []
//   };


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
      if ($scope.eventdoc.categories[i].statusCompleted == true) {
        completedCount++;
      }
    }
    if (completedCount === $scope.eventdoc.categories.length) {
      $scope.readyForPreview = true;
    } else {
      $scope.readyForPreview = false;
    }

     // $http.get('api/events/data/'+$scope.eventdoc.eventInstanceId).then(function(dataResult){
     //    if (dataResult){
       
     //        $scope.eventData = dataResult.data[0];
     //   //     $scope.addDataColumn('20150604');
     //        $scope.columnsLayout = $scope.generateColumnDefs();
     //   //     console.log($scope.columnsLayout);

     //    }
     //  });
     // set second set of test data
     $http.get('api/events/data/'+$scope.eventdoc.eventInstanceId).then(function(dataResult){
        if (dataResult.data.length > 0 ){
       
            $scope.eventData = dataResult.data[0];
      //      $scope.addDataColumn2($scope.eventdoc.dateCreated);
            $scope.columns = $scope.generateColumnDefs();
            $scope.gridOptions = {
              columnDefs : $scope.columns,
              onRegisterApi: function(gridApi) {
              $scope.gridApi = gridApi;
             }

            }
        } else {
          console.log ('data not available');  // add default record
           //var  newId = $scope.eventdoc.eventInstanceId.split('-')[0]+'-001';
           //$scope.eventData = {
           //       "eventName":  $scope.eventdoc.eventName,
           //        "eventInstanceId": newId,
          //         gridData : [ { 'gridName': 'table 1',
          //                        "dailyData": [{
          //                                       "subTopic":""
          //                                       }
          //                                     ]
          //                      }
          //                     ]
          //         };
          // var creationDate = $scope.eventdoc.dateCreated;
          // $scope.eventData.gridData[0].dailyData[0][creationDate] = '*'; 
          // $scope.columns = $scope.generateColumnDefs();
          // $scope.gridOptions = {
          //     data: $scope.eventData.gridData[0].dailyData[0],
          //     columnDefs : $scope.columns,
          //     onRegisterApi: function(gridApi) {
          //     $scope.gridApi = gridApi;
          //    }

          // }
            
        }

        // $scope.chartData = $scope.getChartData();
        //     $scope.highChartConfig = {
        //     options: {
        //       chart: {
        //           type: 'line',
        //       }
        //     },
        //     series: $scope.chartData.series,
        //     title: {
        //     text: 'Communication surveillance'
        //     },
        //      xAxis: {
        //     categories: $scope.chartData.xAxis
        //      },
        //     yAxis : [{
        //           type: "logarithmic"
        //     }],           
        //         loading: false
        //     }
        // $scope.showChartJs('chartJS1');
            


        $scope.tabCategory[0].active = true;
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
  category.statusCompleted = false;

  var data = { docId : $scope.eventdoc._id , categoryData : category};

  $http.post('/api/events/saveEventCategory',data).then(function(res) {
    if(res.data.success) {
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
      },
      beforeDrop: function(event) {
        // if (!window.confirm('Are you sure you want to drop it here?')) {
        //   event.source.nodeScope.$$apply = false;
        // }
      }
    };


$scope.saveCategory = function (status) {  // save data for the current tab

 var oneCategoryData;
 
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
        } else {
             alert('there was an error');
        }

 });

 $rootScope.continueNav=true;
 $rootScope.preventNavigation = false;
 var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
     $log.debug("watching");
      if(newVal!=oldVal)
      {
        $log.debug('changed');
        if(oldVal == undefined){
            //do nothing
        } else {
          $rootScope.continueNav=false;
          $rootScope.preventNavigation =true;
          unregister();
        }
        
        $log.debug('oldVal: ', oldVal);
        $log.debug('newVal: ', newVal);
      }
     
    }, true);
 var unregister2=$scope.$watch('eventData', function(newVal, oldVal){
      if(newVal!=oldVal)
      {
        $log.debug('changed');
        if(oldVal == undefined){
            //do nothing
        } else {
          $rootScope.continueNav=false;
          $rootScope.preventNavigation =true;
          unregister2();
        }
      }
     
    }, true);
};

function saveOneCategory(data) {
  // save category's data only
   $log.debug("i am in save one category" , data);
   $http.post('/api/events/saveEventCategory',data).then(function(res) {
              if(res.data.success) {
                
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
        $rootScope.continueNav=false;
        $scope.canSubmit = false;
        $rootScope.preventNavigation=true;
        unregister2();
      }
      
    }
   
  }, true);

 // var objectsToWatch = ['eventdoc', 'eventData'];
 // var unregister=$scope.$watchGroup('objectsToWatch', function(newVal, oldVal){
 //   console.log("watching fired");
 //    if(newVal!=oldVal)
 //    {
 //      $log.debug('changed');
 //      if(oldVal == undefined){
 //          //do nothing
 //      } else {
 //        $rootScope.continueNav=false;
 //        $scope.canSubmit = false;
 //        $rootScope.preventNavigation=true;
 //        unregister();
 //      }
      
 //    }
   
 //  }, true);

$scope.addDataColumn= function(columnName){

 for(var i=0; i < $scope.eventData.gridData.length; i++) {
        var oneGrid = $scope.eventData.gridData[i];
        for (var j=0; j < oneGrid.dailyData.length; j++) {
           if (oneGrid.dailyData[j].hasOwnProperty(columnName)) {
           } else {  // column not exists, add
               oneGrid.dailyData[j][columnName] = '*';
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
    if ($scope.columns) {
      if ($scope.columns.length >0) {
      for(i = 0; i < $scope.columns.length; i++) {
         if ($scope.columns[i].field !== 'label') {
           initialRow[$scope.columns[i].field] = '*';  
        }
      }
    }
  }
  else {
           var newColumn = ''+$scope.eventdoc.dateCreated
           initialRow[newColumn] = '*'; 
       }
   
  $scope.eventData.gridData.push({
            gridName: grid.newGridName,
            dailyData: [initialRow]
            });
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
            oneColumnDef = {'field': columnArry[i], enableSorting:false, minWidth: $scope.minTopicWidth,pinnedLeft:true};
          }
         else {
            var formattedDate = $filter('date')(columnArry[i],'mediumDate');
            oneColumnDef = {'field': columnArry[i], 'displayName' :formattedDate, enableSorting:false, minWidth:$scope.minColWidth, enablePinning:false, enableColumnMenu:false};
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


$scope.$on('uiGridEventEndCellEdit', function () {
  //   $scope.chartData = $scope.getChartData();
  //   console.log('chart data inside grid update ', $scope.chartData );
  //   $scope.highChartConfig.series = $scope.chartData.series;
    
})

$scope.removeColumn = function() {
     var lastColumnName = $scope.columns[$scope.columns.length-1].field.toString();
     if (lastColumnName !=='label') {
     $scope.columns.splice($scope.columns.length-1, 1);
     for(var i=0; i < $scope.eventData.gridData.length; i++) {
          for(var j=0; j<$scope.eventData.gridData[i].dailyData.length; j++){
             if ($scope.eventData.gridData[i].dailyData[j].hasOwnProperty(lastColumnName)) {
                delete $scope.eventData.gridData[i].dailyData[j][lastColumnName];
             } else {  // column not exists, add
             }
          }
      }
    }
  }
  
  $scope.addColumn = function() {
    // assuming using eventInstanceId as column name
    var newColumnName =  ''+new Date().getTime();
    var formattedDate = $filter('date')(newColumnName,'mediumDate');
    $scope.columns.push({ 'field': newColumnName, 'displayName' : formattedDate, enableSorting: false, minWidth:$scope.minColWidth, enablePinning:false});
    $scope.addDataColumn(newColumnName);
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
       //if (id.split('_')[1] ==='0') {
          return {
              height: ((grid.dailyData.length+1) * rowHeight + headerHeight-12) + "px" };
       //}
       // else {
       // return {
       //    height: (grid.dailyData.length * rowHeight + headerHeight) + "px" };
       // }
    };

  var previewReportModalInstanceCtrl = function($scope, $modalInstance, eventdoc) {
    $scope.eventdoc = eventdoc;

    $scope.ok = function() {
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  };

  $scope.openPreview = function(size,eventdoc) {
    var modalInstance = $modal.open({
      scope: $scope,
      templateUrl: '/partials/previewReportModal',
      controller: previewReportModalInstanceCtrl,
      size: size,
      resolve: {
         eventdoc: function () {
           return eventdoc;
         }
       }
    });
  };

  $scope.getFormattedDate = function(timeStamp) {
     //////var isoDate = $filter('date')(timeStamp,'yyyy-MM-ddTHH:mm:ss.sss') ;
     //return isoDate;
     return timeStamp;
  }

  $scope.showChartJs = function(chartId) {
    var ctx = document.getElementById(chartId).getContext("2d");
    
    var chartJsConfig = {
            bezierCurve : true,
    //Number - Tension of the bezier curve between points
            bezierCurveTension : 0.4,
            }
  var chartData = $scope.getChartData();
  var datasets = [];
  for (serie in chartData.series){
      dataset =  {
                    label: serie.name,
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: serie.data
                  }
      datasets.push(dataset);
  }
  var chartJsData = {
    labels: chartData.xAxis,
    datasets: datasets
  }

  var myLineChart = new Chart(ctx).Line(chartJsData, chartJsConfig);
  
  }

});