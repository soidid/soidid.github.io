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

var eventApp = angular.module("eventApp", [
  'ngRoute',
  'eventControllers'
]);

eventApp.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/list',{
      templateUrl: 'partials/event-list.html',
      controller: 'eventListCtrl'
    }).
      when('/list/:eventId',{
      templateUrl: 'partials/event-detail.html',
      controller: 'eventDetailCtrl'
    }).
      otherwise({
      redirectTo:'/list'

    });

  }]);
