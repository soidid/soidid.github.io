/* App Module */

var legApp = angular.module("legApp", [
  'ngRoute',
  'legControllers'
]);

legApp.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/legislators',{
      templateUrl: 'partials/leg-list.html',
      controller: 'legListCtrl'
    }).
      when('/legislators/:legId',{
      templateUrl: 'partials/leg-detail.html',
      controller: 'legDetailCtrl'
    }).
      otherwise({
      redirectTo:'/legislators'

    });

  }]);
