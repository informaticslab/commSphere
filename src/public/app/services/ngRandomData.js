angular.module('app').factory('ngRandomData', function() {  //FOR MOCK DATA ONLY
	return {
		getRandomNumber: function() {
			var randomNumber = [25,30,35,40,45,50,55,60,65,70,75,80,85,90,95];
			return randomNumber[Math.floor(Math.random() * randomNumber.length)];
		}
	}
});