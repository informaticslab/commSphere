angular.module('app').controller('createEventCtrl', function($scope, $http) {

$scope.topicValue={};
	$scope.subTopicValue={};
	$scope.document={
  "eventName": "Japan Earthquake",
  "eventId": "12345",
  "eventInstanceId": "jp2",
  "categories": {
    "Web": {
      "assignedTo": "John",
      "displayValue": "Web"
    },
    "TV": {
      "assignedTo": "John",
      "displayValue": "TV"
    },
    "Print": {
      "assignedTo": "John",
      "displayValue": "Print"
    }
  }
};


$scope.addTopic=function(category)
{
	
	var newTopic=$scope.topicValue[category];

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

$scope.saveEvent = function() {
	var data = {};
	data = $scope.document;

	$http.post('/api/events', data).then(function(res) {
		if(res.data.success) {
			alert("Event has been saved!");
		} else {
			alert('there was an error');
		}
	});
}

});