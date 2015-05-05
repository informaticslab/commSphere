var commSphereApp = angular.module('app', [
  'ngRoute'
  ,'ngResource'
  ,'ngAnimate'
  ,'ngSanitize'
  ,'LocalStorageModule'
  ,'ui.bootstrap'
  , 'ui.tree'
  // ,'chieffancypants.loadingBar'
  // ,'angulartics'
  // ,'angulartics.google.analytics'
]);

//Role checking for routes
var routeRoleChecks = {
  levelThree:{auth: function(ngAuth){
            return ngAuth.authorizeCurrentUserForRoute('levelThree')
          }},
  levelTwo:{auth:function(ngAuth){
    return ngAuth.authorizeCurrentUserForRoute('levelTwo')
          }},
  levelOne:{auth:function(ngAuth){
    return ngAuth.authorizeCurrentUserForRoute('levelOne')
          }},
  levelTwoOrThree:{auth:function(ngAuth){
    return ngAuth.authorizeCurrentUserForRoute('levelTwoOrThree')
  }} 
};


//to prevent IE caching
commSphereApp.config([
    '$httpProvider', function ($httpProvider) {
        // Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }
]);

commSphereApp.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider.
    when('/dashboard', {
        templateUrl : '/partials/dashboard',
        controller  : 'dashCtrl',
        //resolve : routeRoleChecks.levelTwoOrThree  //
    }).
      when('/dashboard/drafts', {
        templateUrl : '/partials/dashboardDrafts',
        controller  : 'dashDraftsCtrl',
        //resolve : routeRoleChecks.levelTwoOrThree
    }).
    when('/dashboard/archives', {
        templateUrl : '/partials/dashboardArchives',
        controller  : 'dashArchivesCtrl',
        //resolve : routeRoleChecks.levelTwoOrThree
    }).
    when('/login', {
        templateUrl : '/partials/login',
        controller  : 'loginCtrl'
    }).
    otherwise({
        redirectTo: '/dashboard'
      });
}]);

angular.module('app').run(function($rootScope,$location) {
  $rootScope.$on('$routeChangeError', function(evt,current, previous,rejection) {
    if(rejection === 'not authorized'){
      $location.path('/login');
    }
  }) 
})