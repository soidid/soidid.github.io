function getColor(categoryName){
  var color ="";
  switch(categoryName){
    case '環保': color = 'green';break;
    case '食品': color = 'black';break;
    case '勞工': color = 'blue';break;
    case '性別': color = 'red';break;
    case '司法': color = 'purple';break;
    case '人權': color = 'black';break;
    case '土地': color = 'black';break;
    case '教育': color = 'teal';break;
    case '稅賦': color = 'orange';break;
  }
  return color;
};

legControllers.controller('eventListCtrl', function($scope){


  login($scope, function(){ });
/////// Top Menu //////////////

// Category Button
    $scope.categories = [];
    $.each(legApp.categories, function(index,element){
      $scope.categories.push({"name":element,"color":getColor(element)});
    });

$scope.categoryFilter = "";
$scope.menuReady = function() {

  // selector cache
  var
    $menuItem = $('.menu a.item, .menu .link.item'),
    $dropdown = $('.main.container .menu .dropdown'),
    // alias
    handler = {

      activate: function() {
        if(!$(this).hasClass('dropdown')) {
          $(this)
            .addClass('active')
            .closest('.ui.menu')
            .find('.item')
              .not($(this))
              .removeClass('active')
          ;
          $scope.categoryFilter = $(this).attr("value");
          $scope.$apply();//refresh the page
        }
      }
    }
  ;

  $dropdown
    .dropdown({
      on: 'hover'
    })
  ;

  $menuItem
    .on('click', handler.activate)
  ;

};
$scope.topMenuFilter = function(n){
  if($scope.categoryFilter ==""){
    return n;
  }else{
    if(n.category === $scope.categoryFilter)
      return n;
  }
};



////// Left Menu Start////////////


  //List Selection Change
  $scope.listSelection = ["有疑慮","不推薦","強烈反對"];
  $scope.toggleList = function(){
    console.log($(this).find("input").val());
    var name = $(this).find("input").val();
    var idx = $scope.listSelection.indexOf(name);
    // is currently selected
    if (idx > -1) {
      $scope.listSelection.splice(idx, 1);
    }
    // is newly selected
    else {
      $scope.listSelection.push(name);
    }
    $scope.$apply();//refresh the page
    console.log($scope.listSelection);
  };

  $('.listFilter').on('click',$scope.toggleList);

  $scope.listFilter = function(n){
    for(var i=0;i<$scope.listSelection.length;i++){
      if(n.list === $scope.listSelection[i])
         return n;
    }
  };
  //Current Group & NGO List

  $scope.ngoList =legApp.ngoList;

  //Group & NGO Selection Change
  $scope.critiquerSelection = ["綠盟","地球公民","環保聯盟","農陣","婦女新知","台女連","公督盟","消基會"];
  $scope.critiquerSum = $scope.critiquerSelection.length;
  $scope.toggleCritiquer = function(){

    var name = $(this).find("input").val();
    var idx = $scope.critiquerSelection.indexOf(name);
    // is currently selected
    if (idx > -1) {
      $scope.critiquerSelection.splice(idx, 1);
      $(".critiquerAllFilter").find("input").prop("checked",false);
      $scope.allCritiquerSelected = false;
    }
    // is newly selected
    else {
      $scope.critiquerSelection.push(name);
      if($scope.critiquerSelection.length == $scope.critiquerSum){
        $(".critiquerAllFilter").find("input").prop("checked",true);
        $scope.allCritiquerSelected = true;
      }
    }
    $scope.$apply();//refresh the page
  };

  $scope.allCritiquerSelected = true;
  $scope.toggleAllCritiquer = function(){
    if($scope.allCritiquerSelected===false){
      $(".critiquerFilter").each(function(index,element){
        var current = $(element).find("input");
        current.prop("checked",true);
      });
      $scope.allCritiquerSelected = true;
      $scope.critiquerSelection = ["綠盟","地球公民","環保聯盟","農陣","婦女新知","台女連","公督盟","消基會"];
    }else{
      $(".critiquerFilter").each(function(index,element){
        var current = $(element).find("input");
        current.prop("checked",false);
      });
      $scope.allCritiquerSelected = false;
      $scope.critiquerSelection = [];
    }
    $scope.$apply();//refresh the page
  };


  $('.critiquerAllFilter').on('click',$scope.toggleAllCritiquer);


  //ISSUE
  //This is bad..... After the checkbox has been render, have to call semantic UI
  $scope.flag = true;
  $scope.$watch(function(){
    return document.body.innerHTML
  }, function(val){

    if($scope.flag && ($(".critiquerFilter").length===$scope.critiquerSum)){
      $('.ui.accordion').accordion();
      $('.ui.checkbox').checkbox();
      $('.critiquerFilter').on('click',$scope.toggleCritiquer);
      $scope.menuReady();//TOP MENU
      $scope.flag = false;
    }
  });


  //Critiquer filter
  $scope.critiquerFilter = function(n){
    for(var i=0;i<$scope.critiquerSelection.length;i++){
      if(n.ngo === $scope.critiquerSelection[i])
        return n;
    }
  };

// Left Menu End ////////////////////////////////////////////////////////






  $scope.addEventItem=function($scope, it) {
    setTimeout(function(){$scope.$apply(function() {$scope.events.push(it);});}, 0);
  };

  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/event");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    v.color = getColor(v.category);
    $scope.addEventItem($scope, v);
    console.log(v);
  });
  $scope.events=[];
});

