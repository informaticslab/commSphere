var commSphereApp = angular.module('app', [
  'ngRoute'
  ,'ngResource'
  ,'ngAnimate'
  ,'ngSanitize'
  ,'LocalStorageModule'
  ,'ui.bootstrap'
  , 'ui.tree'
  ,'ui.grid'
  ,'ui.grid.edit'
  ,'ui.grid.cellNav'
  ,'ui.grid.pinning'
  ,'ui.grid.moveColumns'
  ,'ui.grid.autoResize'
  ,'ui.grid.selection'
  ,'isteven-multi-select'
  ,'ui.bootstrap.datetimepicker'
  ,'duScroll'
  ,'highcharts-ng'
  ,'ngFileUpload'
  //,'chart.js'
  //,'tc.chartjs'
  //,'googlechart'
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
    '$httpProvider','$logProvider', function ($httpProvider,$logProvider) {
         $logProvider.debugEnabled(false);
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

commSphereApp.config(['$routeProvider', '$locationProvider', 
  function($routeProvider,$locationProvider) {
    $routeProvider.
    when('/dashboard/event/:id', {
        templateUrl : '/partials/dashboardEvent',
        controller  : 'dashEventCtrl',
        reloadOnSearch : false,
        resolve : routeRoleChecks.levelTwoOrThree
    }).
    when('/dashboard', {
        templateUrl : '/partials/dashboard',
        controller  : 'dashCtrl',
        resolve : routeRoleChecks.levelTwoOrThree  
    }).
      when('/dashboard/drafts', {
        templateUrl : '/partials/dashboardDrafts',
        controller  : 'dashDraftsCtrl',
        resolve : routeRoleChecks.levelTwoOrThree
    }).
    when('/dashboard/archives', {
        templateUrl : '/partials/dashboardArchives',
        controller  : 'dashArchivesCtrl',
        resolve : routeRoleChecks.levelTwoOrThree
    }).
    when('/admin', {
        templateUrl: '/partials/admin',
        controller: 'adminCtrl',
        resolve: routeRoleChecks.levelTwo
    }).
    when('/login', {
        templateUrl : '/partials/login',
        controller  : 'loginCtrl'
    }).
    otherwise({
        redirectTo: '/dashboard'
      });

    //$locationProvider.html5Mode(true);
}]);

angular.module('app').run(function($rootScope,$location) {
  $rootScope.$on('$routeChangeError', function(evt,current, previous,rejection) {
    if(rejection === 'not authorized'){
      $location.path('/login');
    }
  }) 
})