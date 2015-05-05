angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier) {

$scope.eventName ="";
$scope.eventType = "";
$scope.eventInstanceId="";
$scope.topicValue={};
	$scope.subTopicValue={};
	$scope.userAssigned={};
	$scope.eventName='';

$scope.eventdoc = {
	"eventName": "",
	"eventType": "",
	"eventInstanceId": "",
	"userCreated": "",
	"dateCreated": "",
	"draftStatus": true,
	categories:[
		{
			name:'Web',
			"userAssigned": "",
			"statusCompleted": false,
			"dateCompleted": "",
			topics:[

			]
		},
		{
			name:'TV',
			"userAssigned": "",
			"statusCompleted": false,
			"dateCompleted": "",
			topics:[

			]
		},
		{
			name:'Print',
			"userAssigned": "",
			"statusCompleted": false,
			"dateCompleted": "",
			topics:[

			]
		},
	]
};

$scope.users=['Dan','John','Steven','Paul','Tom']; //hardcoded placeholder
$scope.eventTypes=['Earthquake','Hurricane','Flood', 'Infectious Disease', 'Famine'] //hardcoded placeholder
$scope.date = new Date().getTime();

//$scope.eventdoc.categories[0].topics = $scope.eventdoc.categories[0].topics;
    

    $scope.addTopic = function(category) {
    	console.log(category);
      // if ($scope.eventdoc.categories.indexOf(category).topics.length > 10) {
      //   window.alert('You can\'t add more than 10 topics!');
      //   return;
      // }
      //var topicName = document.getElementById('topicName').value;
      var topicName = $scope.topicValue[category.name];
      if (topicName.length > 0) {
        category.topics.push({
          name: topicName,
          type: 'topic',
          subTopics: [],
          sortOrder: category.topics.length
        });
        
      }
      $scope.topicValue={};
    };

    $scope.editTopic = function(topic) {
      topic.editing = true;
    };

    $scope.cancelEditingTopic = function(topic) {
      topic.editing = false;
    };

    $scope.saveTopic = function(topic) {
      // topic.save();
      topic.editing = false;
    };

    $scope.removeTopic = function(category, topic) {
      // if (window.confirm('Are you sure to remove this topic?')) {
      //   //topic.destroy();  //TODO
      // }
      console.log(category);
      console.log(topic);
      var index = category.topics.indexOf(topic);
       if (index > -1) {
         category.topics.splice(index, 1)[0];
       }
    };

    $scope.saveTopics = function() {
      for (var i = $scope.eventdoc.categories[0].topics.length - 1; i >= 0; i--) {
        var topic = $scope.eventdoc.categories[0].topics[i];
        topic.sortOrder = i + 1;
         // topic.save();
      }
    };

    $scope.addSubTopic = function(topic) {
      console.log(topic);
      if (!topic.newSubTopicName || topic.newSubTopicName.length === 0) {
        return;
      }
      topic.subTopics.push({
        name: topic.newSubTopicName,
        sortOrder: topic.subTopics.length,
        type: 'subTopic'
      });
      topic.newSubTopicName = '';
      // topic.save();
    };

    $scope.removeSubTopic = function(topic, subTopic) {
      //if (window.confirm('Are you sure to remove this subTopic?')) {
        var index = topic.subTopics.indexOf(subTopic);
        if (index > -1) {
          topic.subTopics.splice(index, 1)[0];
        }
        // topic.save();
      //}
    };

    $scope.editSubTopic = function(subTopic) {
    	console.log("edit sub topic");
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
        return (data.type == destType); // only accept the same type
      },
      dropped: function(event) {
        console.log(event);
        var sourceNode = event.source.nodeScope;
        var destNodes = event.dest.nodesScope;
        // update changes to server
        if (destNodes.isParent(sourceNode)
          && destNodes.$element.attr('data-type') == 'subTopic') { // If it moves in the same topic, then only update topic
          var topic = destNodes.$nodeScope.$modelValue;
          // topic.save();
        } else { // save all
          $scope.saveTopics();
        }
      },
      beforeDrop: function(event) {
        // if (!window.confirm('Are you sure you want to drop it here?')) {
        //   event.source.nodeScope.$$apply = false;
        // }
      }
    };




$scope.assignUser = function(category) {
	var userAssigned = $scope.userAssigned[category];
	$scope.eventdoc.categories[category].userAssigned = userAssigned;
};

$scope.saveDraftEvent = function() {

		//data = $scope.eventdoc;
		var currentUser = 'Joe Coordinator'; //hardcoded placeholder

		//data = $scope.document;
		$scope.eventdoc.eventName = $scope.eventName;
		$scope.eventdoc.eventType = $scope.eventType;
		$scope.eventdoc.eventInstanceId = ""; 
		$scope.eventdoc.userCreated = currentUser;
		$scope.eventdoc.dateCreated = $scope.date;
		$scope.eventdoc.draftStatus = true;
		$http.post('/api/events', $scope.eventdoc).then(function(res) {

				if(res.data.success) {
					ngNotifier.notify("Draft Event has been saved!");
					$route.reload();

				} else {
					alert('there was an error');
				}
			});

			$scope.ok();
};


function getLatestInstance(partialId)
    { 
    	console.log(partialId);
       
       $http.get('/api/events/getAvailEventId/'+partialId).then(function(res){
       	console.log(partialId);
         console.log(res.data);
         if(res.data) {
             //var eventInstanceIdParts = res.data.eventInstanceId.split("-");
             //$scope.eventInstanceId= eventInstanceIdParts[0] + '-' + String('0'+(Number(eventInstanceIdParts[1]) + 1));
             if(res.data.length>0)
             {
                console.log("ID alreADy prsent");
                 return partialId+"xx";
             }
             else
             {
                console.log("id available to be used");
                console.log(partialId);
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
});