
$(document)
  .ready(function() {

    $('.filter.menu .item')
      .tab()
    ;
    
    $('.ui.accordion')
      .accordion()
    ;
    
    $('.ui.checkbox')
      .checkbox()
    ;
    
    $('.ui.dropdown')
      .dropdown()
    ;
 
    
  })
;

function addItem($scope, it) {
  console.log(it);
  setTimeout(function(){$scope.$apply(function() {$scope.legislators.push(it);});}, 0);
}
var lyCtrl = function($scope) {
  id = 0;
  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    addItem($scope, v);
  });
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
};
