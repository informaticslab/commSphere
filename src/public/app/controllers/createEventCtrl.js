angular.module('app').controller('createEventCtrl', function($scope, $http, $filter) {

$scope.topicValue={};
	$scope.subTopicValue={};
	$scope.userAssigned={};
	$scope.document={
  "eventName": "",
  "eventType": "",
  "eventInstanceId": "",
  "userCreated": "",
  "dateCreated": "",
  "statusFinalized": false,
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
$scope.eventTypes=['Earthquake','Hurricane','Flood', 'Infectious Disease', 'Famine']


$scope.addTopic=function(category)
{
	
	var newTopic=$scope.topicValue[category];
	console.log(newTopic);

	newTopic=$filter('escapeDot')(newTopic);

	if($scope.document.categories[category].topics==undefined)
	{
		$scope.document.categories[category].topics={};
	}


	if($scope.document.categories[category].topics[newTopic])
	{
		alert(newTopic+" already exists");
	}
	else
	{
		$scope.document.categories[category].topics[newTopic]={};
		$scope.document.categories[category].topics[newTopic].displayValue=newTopic;
	}

	$scope.topicValue[category]="";
	
	console.log($scope.document);
}


$scope.deleteTopic=function(category)
{
	
	var newTopic=$scope.topicValue[category];

	newTopic=$filter('escapeDot')(newTopic);

	if($scope.document.categories[category].topics==undefined)
	{
		$scope.document.categories[category].topics={};
	}


	if($scope.document.categories[category].topics[newTopic])
	{
		alert(newTopic+" already exists");
	}
	else
	{
		$scope.document.categories[category].topics[newTopic]={};
		$scope.document.categories[category].topics[newTopic].displayValue=newTopic;
	}

	$scope.topicValue[category]="";
	
	console.log($scope.document);
}


$scope.addSubTopic=function(category,topic)
{
	console.log(category,topic);
	console.log($scope.document);
	
	var newSubTopic=$scope.subTopicValue[category+'-'+topic];
	console.log(newSubTopic,$scope.document.categories[category].topics[topic].subTopics);

	if($scope.document.categories[category].topics[topic].subTopics==undefined)
	{
		$scope.document.categories[category].topics[topic].subTopics={};
	}


	if($scope.document.categories[category].topics[topic].subTopics[newSubTopic])
	{
		alert(newSubTopic+" already exists");
	}
	else
	{
		//$scope.document.categories[category].topics[topic].subTopics={};

		$scope.document.categories[category].topics[topic].subTopics[newSubTopic]={}
		$scope.document.categories[category].topics[topic].subTopics[newSubTopic].displayValue=newSubTopic;
	}
	
	$scope.subTopicValue[category+'-'+topic]="";

}

$scope.assignUser = function(category) {
	var userAssigned = $scope.userAssigned[category];
	$scope.document.categories[category].userAssigned = userAssigned;
}

$scope.saveEvent = function() {
	var data = {};
	var formattedEventInstanceId = 'EQSA-01'; //TODO: Create actual eventInstanceId do this on server-side?
	var currentUser = 'Joe Coordinator'; //hardcoded placeholder

	data = $scope.document;
	data.eventName = $scope.eventName;
	data.eventType = $scope.eventType;
	data.eventInstanceId = formattedEventInstanceId; 
	data.userCreated = currentUser;
	data.dateCreated = Math.round((new Date()).getTime() / 1000);

	$http.post('/api/events', data).then(function(res) {
		if(res.data.success) {
			alert("Event has been saved!");
		} else {
			alert('there was an error');
		}
	});

	$scope.ok();
}

});