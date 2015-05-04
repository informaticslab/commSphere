/// <reference path="../../../typings/angularjs/angular.d.ts"/>
commSphereApp.filter('searchAll', function($filter) {
  return function(instances,searchText) {
    var searchRegx = new RegExp(searchText, "i");
    if (searchText == undefined || searchText == ''){
        return instances;
    }
    var result = [];
    for(i = 0; i < instances.length; i++) {
      
        if (instances[i].eventName.toString().search(searchRegx) != -1 ||
            instances[i].eventInstanceId.toString().search(searchRegx) != -1 ||
            $filter('date')(new Date(instances[i].dateCreated),'MM dd yyyy').search(searchRegx) != -1)
            {
            result.push(instances[i]);
        }
    }
    return result;
  }
  
  });