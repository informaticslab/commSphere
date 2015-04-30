angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier) {


$scope.myInstance = {}; 
$scope.eventName ="";
$scope.eventType = "";
$scope.eventInstanceId="";
$scope.topicValue={};
	$scope.subTopicValue={};
	$scope.userAssigned={};
	$scope.eventName='';
	$scope.eventdoc={
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

		if($scope.eventdoc.categories[category].topics==undefined)
		{
			$scope.eventdoc.categories[category].topics={};
		}


		if($scope.eventdoc.categories[category].topics[newTopic])
		{
			ngNotifier.notifyError(newTopic+" already exists");
		}
		else
		{
			$scope.eventdoc.categories[category].topics[newTopic]={};
			$scope.eventdoc.categories[category].topics[newTopic].displayValue=newTopic;
		}

		$scope.topicValue[category]="";
		
		console.log($scope.eventdoc);
	}
}


$scope.deleteTopic=function(category,topic)
{
	
	delete $scope.eventdoc.categories[category].topics[topic];
	console.log($scope.eventdoc);

}


$scope.addSubTopic=function(category,topic)
{
	console.log(category,topic);
	console.log($scope.eventdoc);
	
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
		console.log(newSubTopic,$scope.eventdoc.categories[category].topics[topic].subTopics);

		if($scope.eventdoc.categories[category].topics[topic].subTopics==undefined)
		{
			$scope.eventdoc.categories[category].topics[topic].subTopics={};
		}


		if($scope.eventdoc.categories[category].topics[topic].subTopics[newSubTopic])
		{
			ngNotifier.notifyError(newSubTopic+" already exists");
		}
		else
		{
			//$scope.eventdoc.categories[category].topics[topic].subTopics={};

			$scope.eventdoc.categories[category].topics[topic].subTopics[newSubTopic]={}
			$scope.eventdoc.categories[category].topics[topic].subTopics[newSubTopic].displayValue=newSubTopic;
		}
		
		$scope.subTopicValue[category+'-'+topic]="";
	}



}

$scope.assignUser = function(category) {
	var userAssigned = $scope.userAssigned[category];
	$scope.eventdoc.categories[category].userAssigned = userAssigned;
};

$scope.createEvent = function() {
	console.log($scope.eventdoc.eventInstanceId);
	//var formattedEventInstanceId = 'EQSA-01'; //TODO: Create actual eventInstanceId do this on server-side?


	//var trimEventName = $scope.eventName.trim();

	 $http.get('/api/events/duplicates/'+'event Name').then(function(res) {
	 	console.log(res.data);
	 });

	if($scope.eventName.trim() == ''){
		ngNotifier.notifyError('Event name cannot be blank');
	} else if($scope.eventName.replace(/ /g,'').match(/^[0-9]+$/) != null ) {
		ngNotifier.notifyError('Event name cannot contain only numbers');
	} else if($scope.eventType == undefined) {
		ngNotifier.notifyError('Please select an event type');
	} else {

		//data = $scope.eventdoc;
		var currentUser = 'Joe Coordinator'; //hardcoded placeholder

		//data = $scope.document;
		$scope.eventdoc.eventName = $scope.eventName;
		$scope.eventdoc.eventType = $scope.eventType;
		$scope.eventdoc.eventInstanceId = ""; 
		$scope.eventdoc.userCreated = currentUser;
		$scope.eventdoc.dateCreated = $scope.date;
		$scope.eventdoc.draftStatus = false;

        var partialId = genInstanceId($scope.eventName);

        $http.get('/api/events/getAvailEventId/'+partialId).then(function(res){
       	console.log(partialId);
        console.log(res.data);
         if(res.data) {
             //var eventInstanceIdParts = res.data.eventInstanceId.split("-");
             //$scope.eventInstanceId= eventInstanceIdParts[0] + '-' + String('0'+(Number(eventInstanceIdParts[1]) + 1));
             if(res.data.length>0)
             {
                console.log("ID alreADy prsent");
                 $scope.eventdoc.eventInstanceId= partialId+"xx";
             }
             else
             {
                console.log("id available to be used");
                console.log(partialId);
                $scope.eventdoc.eventInstanceId= partialId;
             }

			console.log("eventIDNew",$scope.eventdoc.eventInstanceId);

			$scope.eventdoc.userCreated = currentUser;
			$scope.eventdoc.dateCreated = new Date().getTime();
			console.log($scope.eventdoc);
			console.log($scope.eventdoc.eventInstanceId);
			$http.post('/api/events', $scope.eventdoc).then(function(res) {

				if(res.data.success) {
					ngNotifier.notify("Event has been saved!");
					$route.reload();

				} else {
					alert('there was an error');
				}
			});

			$scope.ok();
             
             } else {
                 alert('no data received, assign new id');
             }
        });


	}
	
}


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