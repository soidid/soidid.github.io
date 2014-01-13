/*
 *      for rank.html (display as index.html)
 */

legControllers.controller('rankCtrl',['$scope','$routeParams',

 function($scope,$routeParams){

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
  /*
  $scope.ngoList = [{"groupName":"環保", "groupMember":[{"name":"綠盟"},{"name":"地球公民"},{"name":"環保聯盟"},
                {"groupName":"土地", "groupMember":[{"name":"農陣"}]},
                {"groupName":"性別", "groupMember":[{"name":"婦女新知"},{"name":"台女連"}]},
                {"groupName":"其他", "groupMember":[{"name":"公督盟"}]}]}];
  */
  $scope.ngoList = [{"groupName":"環保", "groupMember":["綠盟","地球公民","環保聯盟"]},
                    {"groupName":"土地", "groupMember":["農陣"]},
                    {"groupName":"性別", "groupMember":["婦女新知","台女連"]},
                    {"groupName":"其他", "groupMember":["公督盟"]}];

  //Group & NGO Selection Change
  $scope.critiquerSelection = ["綠盟","地球公民","環保聯盟","農陣","婦女新知","台女連","公督盟"];
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
      $scope.critiquerSelection = ["綠盟","地球公民","環保聯盟","農陣","婦女新知","台女連","公督盟"];
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




// Display Rank Start //////////////////////////////////////////////////

  //Retrieve Legislator Data --> $scope.legislators

  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    addItem($scope, v);
  });


  //Retrieve Event Data --> $scope.events
  //Retrieve Legislator's Events Data --> $scope.events[legID]
  $scope.addEventItem=function($scope, it, idx_leg, idx_cat) {
    setTimeout(function(){$scope.$apply(function() {$scope.events[idx_leg][idx_cat].push(it);});}, 0);
  };

  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/event");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    v.color = getColor(v.category);
    for(var i=0;i<v.relatedLeg.length;i++){
        $scope.addEventItem($scope, v, v.relatedLeg[i], getCategoryIndex(v.category));
    }
  });
  $scope.events=[];
  var max = 10;
  for(var i = 0;i<= max; i ++){
        $scope.events.push([]);
    for(var j = 0; j<legApp.categories.length;j++){
        $scope.events[i].push([]);
    }
  }
///////////////////////////////////////////////////////////////////////////////////////



// Adding New Legislators

  id = 0;
  function wrap(a) {
    id++;
    return a.map(function(it) { return {id:id, v: it}; });
  }
  $scope.newLy = {}
  $scope.addNewLy = function() {
    no = $scope.legislators.length + 1;
    avatar = CryptoJS.MD5("MLY/"+$scope.newLy.name).toString();
    $scope.newLy.no = no;
    $scope.newLy.committees = wrap([0,0,0,0,0,0,0,0,0]);
    $scope.newLy.page = "na";
    $scope.newLy.img = "http://avatars.io/50a65bb26e293122b0000073/"+avatar+"?size=medium"
    $scope.dbRef.push($scope.newLy);
    $scope.newLy = {};
  }
  $scope.legislators = [
  ];
    //{name: "呂小章", img: "01.jpg", page: "leg01.html", no: "1", committees: wrap([6,5,9,1,0,6,5,1,33]), committee: "經濟", party: "中國國民黨", section: "台北市第一選區"},
    //{name: "王大平", img: "02.jpg", page: "leg02.html", no: "2", committees: wrap([3,4,5,2,4,0,0,6,24]), committee: "教育文化", party: "親民黨", section: "平地原住民"},
    //{name: "陳阿明", img: "03.jpg", page: "leg03.html", no: "3", committees: wrap([1,1,3,0,7,2,3,2,19]), committee: "內政", party: "民主進步黨", section: "全國不分區"}
}]);


