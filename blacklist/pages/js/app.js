/* App Module */

var legApp = angular.module("legApp", [
  'ngRoute',
  'legControllers'
]);

legApp.config(['$routeProvider','$locationProvider',
  function($routeProvider,$locationProvider){
    $routeProvider.
      when('/rank',{
      templateUrl: 'partials/rank.html',
      controller: 'rankCtrl'
    }).
      when('/rank/white',{
      templateUrl: 'partials/rank-white.html',
      controller: 'rankCtrl'
    }).
      when('/legislators',{
      templateUrl: 'partials/leg-list.html',
      controller: 'legListCtrl'
    }).
      when('/legislators/:legId',{
      templateUrl: 'partials/leg-detail.html',
      controller: 'legDetailCtrl'
    }).
      when('/legislators/:legId/:category',{
      templateUrl: 'partials/leg-detail.html',
      controller: 'legDetailCtrl'
    }).
      when('/event/:eventId',{
      templateUrl: 'partials/event-detail.html',
      controller: 'eventDetailCtrl'
    }).
      when('/events',{
      templateUrl: 'partials/event-list.html',
      controller: 'eventListCtrl'
    }).
      when('/critiquers',{
      templateUrl: 'partials/cri-list.html',
      controller: 'criListCtrl'
    }).
      when('/critiquers/:criId',{
      templateUrl: 'partials/cri-detail.html',
      controller: 'criDetailCtrl'
    }).
      when('/critiquers/:criId/:category',{
      templateUrl: 'partials/cri-detail.html',
      controller: 'criDetailCtrl'
    }).
      otherwise({
      redirectTo:'/rank'
    });
    //$locationProvider.html5Mode(true);
  }]);


