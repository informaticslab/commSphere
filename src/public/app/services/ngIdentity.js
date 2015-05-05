angular.module('app').factory('ngIdentity', function($window, ngUser) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new ngUser();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      if (role == 'levelThree') {
        return !!this.currentUser && this.currentUser.roles.levelThree;
      }
      if (role == 'levelTwo') {
        return !!this.currentUser && this.currentUser.roles.levelTwo;
      }
      if (role == 'levelOne') {
        return !!this.currentUser && this.currentUser.roles.levelOne;
      }
      if (role == 'levelTwoOrThree') {
        return !!this.currentUser && (this.currentUser.roles.levelThree || this.currentUser.roles.levelTwo);
      }
    }
  }
})