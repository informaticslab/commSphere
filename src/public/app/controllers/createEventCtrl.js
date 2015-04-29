angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier) {

$scope.topicValue={};
	$scope.subTopicValue={};
	$scope.userAssigned={};
	$scope.eventName='';
	$scope.document={
  "eventName": "",
  "eventType": "",
  "eventInstanceId": "",
  "userCreated": "",
  "dateCreated": "",
  "draftStatus": true,
  "categories": {
    "Web": {
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      "displayValue": "Web"
    },
    "TV": {
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      "displayValue": "TV"
    },
    "Print": {
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      "displayValue": "Print"
    }
  }
};

$scope.users=['Dan','John','Steven','Paul','Tom']; //hardcoded placeholder
$scope.eventTypes=['Earthquake','Hurricane','Flood', 'Infectious Disease', 'Famine'] //hardcoded placeholder
$scope.date = new Date().getTime();


$scope.addTopic=function(category)
{
	
	var newTopic=$scope.topicValue[category];
	console.log(newTopic);

	newTopic=$filter('escapeDot')(newTopic);

	if(newTopic=="")
	{
		ngNotifier.notifyError("Topic cannot be blank");
	}
	else if(newTopic.trim()=="")
	{
		ngNotifier.notifyError("Topic cannot be blank");
	}
	else
	{

		if($scope.document.categories[category].topics==undefined)
		{
			$scope.document.categories[category].topics={};
		}


		if($scope.document.categories[category].topics[newTopic])
		{
			ngNotifier.notifyError(newTopic+" already exists");
		}
		else
		{
			$scope.document.categories[category].topics[newTopic]={};
			$scope.document.categories[category].topics[newTopic].displayValue=newTopic;
		}

		$scope.topicValue[category]="";
		
		console.log($scope.document);
	}
}


$scope.deleteTopic=function(category,topic)
{
	
	delete $scope.document.categories[category].topics[topic];
	console.log($scope.document);

}


$scope.addSubTopic=function(category,topic)
{
	console.log(category,topic);
	console.log($scope.document);
	
	var newSubTopic=$scope.subTopicValue[category+'-'+topic];

	if(newSubTopic=="")
	{
		ngNotifier.notifyError("Sub Topic cannot be blank");
	}
	else if(newSubTopic.trim()=="")
	{
		ngNotifier.notifyError("Sub Topic cannot be blank");
	}
	else
	{
		console.log(newSubTopic,$scope.document.categories[category].topics[topic].subTopics);

		if($scope.document.categories[category].topics[topic].subTopics==undefined)
		{
			$scope.document.categories[category].topics[topic].subTopics={};
		}


		if($scope.document.categories[category].topics[topic].subTopics[newSubTopic])
		{
			ngNotifier.notifyError(newSubTopic+" already exists");
		}
		else
		{
			//$scope.document.categories[category].topics[topic].subTopics={};

			$scope.document.categories[category].topics[topic].subTopics[newSubTopic]={}
			$scope.document.categories[category].topics[topic].subTopics[newSubTopic].displayValue=newSubTopic;
		}
		
		$scope.subTopicValue[category+'-'+topic]="";
	}



}

$scope.assignUser = function(category) {
	var userAssigned = $scope.userAssigned[category];
	$scope.document.categories[category].userAssigned = userAssigned;
}

$scope.createEvent = function() {
	var data = {};
	var formattedEventInstanceId = 'EQSA-01'; //TODO: Create actual eventInstanceId do this on server-side?
	var currentUser = 'Joe Coordinator'; //hardcoded placeholder

	data = $scope.document;
	data.eventName = $scope.eventName;
	data.eventType = $scope.eventType;
	data.eventInstanceId = formattedEventInstanceId; 
	data.userCreated = currentUser;
	data.dateCreated = $scope.date;
	data.draftStatus = false;

	//var trimEventName = $scope.eventName.trim();
	// $http.get('/api/events/duplicates').then(function(res) {
	// 	console.log(res.data);
	// });

	if($scope.eventName.trim() == ''){
		ngNotifier.notifyError('Event name cannot be blank');
	} else if($scope.eventName.replace(/ /g,'').match(/^[0-9]+$/) != null ) {
		ngNotifier.notifyError('Event name cannot contain only numbers');
	} else if($scope.eventType == undefined) {
		ngNotifier.notifyError('Please select an event type');
	} else {
		

		$http.post('/api/events', data).then(function(res) {
			if(res.data.success) {
				ngNotifier.notify("Event has been saved!");
				$route.reload();

			} else {
				alert('there was an error');
			}
		});

		$scope.ok();
	}
	

	
}

});