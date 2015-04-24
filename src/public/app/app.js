var commSphereApp = angular.module('app', [
  'ngRoute'
  ,'ngResource'
  ,'ngAnimate'
  ,'ngSanitize'
  ,'LocalStorageModule'
  ,'ui.bootstrap'
  // ,'chieffancypants.loadingBar'
  // ,'angulartics'
  // ,'angulartics.google.analytics'
]);


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
])

commSphereApp.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider.
    when('/dashboard', {
        templateUrl : '/partials/dashboard',
        controller  : 'dashCtrl'
    }).
      when('/dashboard/drafts', {
        templateUrl : '/partials/dashboard',
        controller  : 'dashCtrl'
    }).
    otherwise({
        redirectTo: '/dashboard'
      });
}]);

angular.module('app').run(function($rootScope,$location) {
  $rootScope.$on('$routeChangeError', function(evt,current, previous,rejection) {
    if(rejection === 'not authorized'){
      $location.path('/main');
    }
  }) 
})