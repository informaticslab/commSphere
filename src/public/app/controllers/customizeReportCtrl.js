angular.module('app').controller('customizeReportCtrl', function($scope) {
	$scope.customizedDoc = [];
	console.log($scope.eventdoc);
	$scope.customizedDoc.push($scope.eventdoc);
	console.log($scope.customizedDoc);
});