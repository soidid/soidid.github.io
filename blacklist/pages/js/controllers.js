$(document)
  .ready(function() {
    $('.ui.checkbox').checkbox();
legApp.getData();
legApp.getCriData();

   })
;
//Global Variables
var legApp={};
legApp.categories = ['環保', '勞工', '性別', '司法','人權','土地','教育','稅賦'];
legApp.lists =['有疑慮','不推薦','強烈反對'];
function getCategoryIndex(name){
  var id = 0;
  switch(name){
      case '環保':id = 0; break;
      case '勞工':id = 1; break;
      case '性別':id = 2; break;
      case '司法':id = 3; break;
      case '人權':id = 4; break;
      case '土地':id = 5; break;
      case '教育':id = 6; break;
      case '稅賦':id = 7; break;
  }
  return id;
}

function fetchLegislators($scope){

  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    addItem($scope, v);
  });

}
legApp.getCriData = function(){
    legApp.cridbRef = new Firebase("https://blacklist.firebaseIO.com/critiquer");
    legApp.cridbRef.on("child_added", function(d) {
      v = d.val();
      legApp.addCriItem(v);
    });
  };

legApp.getData=function(){
  //Get Critiquers Data
  legApp.critiquers = [];
  legApp.addCriItem=function(it) {
    setTimeout(function() {legApp.critiquers.push(it)}, 0);
  };
    // Set up Rank Data
  legApp.max = 116;
  legApp.events=[];
  for(var i = 0;i<= legApp.max; i ++){
    legApp.events.push([]);
    for(var j = 0; j<legApp.categories.length;j++){
      legApp.events[i].push([]);
    }
  }
  //Retrieve Event Data --> $scope.events
  //Retrieve Legislator's Events Data --> $scope.events[legID]
  function  addEventItem(it, idx_leg, idx_cat) {
    //setTimeout(function(){$scope.$apply(function() {leg.events[idx_leg][idx_cat].push(it);});}, 0);
    setTimeout(function() {legApp.events[idx_leg][idx_cat].push(it);}, 0);
  }
  legApp.eventdbRef = new Firebase("https://blacklist.firebaseIO.com/event");
  legApp.eventdbRef.on("child_added", function(d) {
    v = d.val();
    v.color = getColor(v.category);
    for(var i=0;i<v.relatedLeg.length;i++){
      addEventItem(v, v.relatedLeg[i].id, getCategoryIndex(v.category));
    }
  });
};
/*----------------------------------------------------------*/

function login($scope,callback){

  ///////// LOGIN
$scope.logined = false;
  $scope.dbRef = new Firebase('https://blacklist.firebaseIO.com/');
  $scope.auth = new FirebaseSimpleLogin($scope.dbRef, function(err, user){
    if (user) {
      $scope.$apply(function(){
        $scope.logined = true;
        return $scope.user = user;
      });
    }
    if (user) {
      setTimeout(callback(), 0);
      console.log(user, user.accessToken, user.id);
    }
    if (err){
      alert("登入失敗，請檢查輸入帳號及密碼是否正確。");
    }
    return $scope.loginPanel(true);
  });
  $scope.loginPanel = function(dismiss){
    dismiss == null && (dismiss = false);
    $('#login-panel').modal(dismiss ? 'hide' : 'show');
    return false;
  };

  $scope.changePwdPanel = function(dismiss){
    dismiss == null && (dismiss = false);
    $('#changePwd-panel').modal(dismiss ? 'hide' : 'show');
    return false;
  };
  $scope.changePwd = function(){
      return $scope.auth.changePassword($scope.account, $scope.oldPassword, $scope.newPassword,
    function(error, success) {
      if (!error) {
        console.log('Password changed successfully');
        alert("密碼修改成功！");
        $('#changePwd-panel').modal('hide');
      }else{
        alert("密碼修改失敗！");
      }
    });
  };

  $scope.signup = function(){
    console.log("add user: " + $scope.account);
    return $scope.auth.createUser($scope.account, $scope.password, function(e, user){
      if (e) {
        alert(e);
      }
      return $scope.loginPanel(true);
    });
  };
  $scope.login = function(){
    return $scope.auth.login('password', {
      email: $scope.account,
      password: $scope.password,
      rememberMe: true
    });
  };
  return $scope.logout = function(){
    $scope.auth.logout();
    return $scope.user = null;
  };





}
/*----------------------------------------------------------*/
var legControllers = angular.module('legControllers',[]);

legControllers.controller('eventDetailCtrl',['$scope','$routeParams',
    function($scope,$routeParams){

      login($scope, function(){ });

      $scope.event={};
      $scope.eventId = $routeParams.eventId;
      console.log($scope.eventId);
      $scope.eventdbRef = new Firebase("https://blacklist.firebaseIO.com/event");

      $scope.eventdbRef.on("child_added", function(d) {
        v = d.val();
        if($scope.eventId==v.id){
          v.color = getColor(v.category);
          $scope.event = v;
        console.log($scope.event);
        }
      });
   }
]);

/*
 * for people.html
 */

function addItem($scope, it) {
  setTimeout(function(){$scope.$apply(function() {$scope.legislators.push(it);});}, 0);
}

legControllers.controller('legListCtrl', function($scope) {

  login($scope, function(){ });

  $('.ui.dropdown').dropdown();

  $scope.legislators = [];
  fetchLegislators($scope);
  $scope.$apply;

});



/* critiquers */

legControllers.controller('criListCtrl', function($scope) {

  login($scope, function(){ });
  id = 0;
  $scope.addCriItem=function($scope, it) {
    //console.log(it);
    setTimeout(function(){$scope.$apply(function() {$scope.critiquers.push(it);});}, 0);
  };

  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/critiquer");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    $scope.addCriItem($scope, v);
  });
  $scope.critiquers=[];
});


