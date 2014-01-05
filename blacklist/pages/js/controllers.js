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
    $('.category')
      .on('click',toggleCategory)
    ;
    $('.eventlist')
      .on('click',toggleList)
    ;

    $('.ui.dropdown')
      .dropdown()
    ;

  })
;

/*
 * for eventall.html
 */
var eventall={};
var eventallApp = angular.module('eventallApp',[]);

eventallApp.controller('eventallCtrl', function($scope){

  $scope.addEventItem=function($scope, it) {
    console.log(it);
    setTimeout(function(){$scope.$apply(function() {$scope.events.push(it);});}, 0);
  };

  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/event");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    console.log(v);

    $scope.addEventItem($scope, v);
  });

  $scope.events=[];
});

/*
 * for add-event.html
 */
var addEvent={};
addEvent.category=[];
function toggleCategory(){
  console.log("in toggleSelection");
  var categoryName = $(this).find("input").attr("name");
  console.log(categoryName);
  var idx = addEvent.category.indexOf(categoryName);
  // is currently selected
  if (idx > -1) {
    addEvent.category.splice(idx, 1);
  }
  // is newly selected
  else {
    addEvent.category.push(categoryName);
  }
  console.log(addEvent.category);
};
addEvent.listChoice="";
function toggleList(){
  console.log("in toggleList");
  addEvent.listChoice = $(this).find("label").text();

  console.log(addEvent.listChoice);
};

var addEventApp = angular.module('addEventApp',[]);
addEventApp.controller('addEventCtrl', function($scope){

  // categories
  $scope.categories = ['環保', '性別', '勞工', '司法','人權','土地','教育','稅賦'];

  // list choices
  $scope.lists =['有疑慮','不推薦','強烈反對'];
  // selected category
  $scope.selection = [];
/* will be override if not eliminate the "ui" class on the checkboxes
  // toggle selection for a given category by name
  $scope.toggleSelection = function toggleSelection(categoryName) {
    console.log("in toggleSelection");
    var idx = $scope.selection.indexOf(categoryName);
    // is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.selection.push(categoryName);
    }
  };
*/
  addEvent.testData = [
    {title:'公職人員利益衝突回避法修正案', link:'www.filelocation.com/law.pdf'},
    {title:'立法院會議記錄',link:'www.filelocation.com/meeting.doc'}
  ]

  //////////////////////////////////////// issue
  $scope.dataHint = addEvent.testData.slice();
  $.map($scope.dataHint,function(element){
      element.title = "例如："+element.title;
      element.link = "例如："+element.link;
  });
  console.log(addEvent.testData);
  ///////////////////////////////////////

  $scope.getData = function(){

    //console.log("in function: getData");
    addEvent.dataList=[];
    var dataList = $(".dataListItem");

    dataList.each(function(index,element){
      //console.log("index:"+index);
      var dataTitle = $(element).find(".dataTitle").val();
      var dataLink = $(element).find(".dataLink").val();
      //console.log(dataTitle + ":" + dataLink);
      if(dataTitle!=""&&dataLink!="")
        addEvent.dataList.push({"title":dataTitle,"link":dataLink});
    });

    //console.log(addEvent.dataList);
  };


  $scope.checkInput = function(n){
     console.log("in check input function, current data:");
     console.log(n);
     if(n.name==null){ console.log("請輸入事件名稱"); return false;}
     if(n.category.length==0){ console.log("請選擇事件類型（至少一項）"); return false;}
     if(n.listChoice==null){ console.log("請選擇所屬表單（有疑慮/不推薦/強烈反對）"); return false;}
     if(n.abstract==null){ console.log("請輸入事件摘要"); return false;}
     if(n.people==null){ console.log("請輸入相關人士"); return false;}
     if(n.content==null){ console.log("請輸入事件名稱"); return false;}
     if(n.data.length==0){ console.log("請輸入相關資料並附原始連結（至少一項）"); return false;}
     return true;


  };
  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/event");
  $scope.newEvent={};

  $scope.addNewEvent = function(){
    $scope.newEvent.category = addEvent.category;
    if(addEvent.listChoice.length>0)
      $scope.newEvent.listChoice = addEvent.listChoice;
    $scope.getData();
    $scope.newEvent.data = addEvent.dataList;

    if($scope.checkInput($scope.newEvent)){
      $scope.dbRef.push($scope.newEvent);
      $scope.newEvent = {};
      $scope.clearData();
      alert("建立事件成功！you can check the console for more detail.");
    }else{
      alert("建立事件失敗。please check the console for more detail.");
    }
  };


  $scope.fillInTestData = function(){
    console.log("in function: fill in test data");
    $scope.newEvent.name = "公職人員利益衝突迴避法第九條及第十五條條文修正草案";
    addEvent.category = ["司法"];
    $(".category").each(function(index,element){
      var current = $(element).find("input");
      var idx = addEvent.category.indexOf(current.attr("name"));
      if(idx > -1)
        current.prop("checked",true);
      else current.prop("checked",false);
    });
    addEvent.listChoice = "強烈反對";
    $(".eventlist").each(function(index,element){
      var current = $(element).find("input");
      if(addEvent.listChoice == $(element).find("label").text())
        current.prop("checked",true);
      else current.prop("checked",false)
    });
    $scope.newEvent.abstract = "放寬利益迴避相關規範，恐將使利益輸送情況加劇。";
	$scope.newEvent.people = "主提案人：呂小章、王小升";
	$scope.newEvent.content = "本法修正重點如下：一、限制公職人員之關係人與機關交易應合乎憲法比例原則【第九條】公職人員得依據透明公開之政府採購機制及交易標的係機關提供，並具公定價格之情形者，排除本法規定之適用。對於本條，監察院認為若將「依政府採購法規定辦理採購者」全面排除，對於公職人員以技術手段（例如切割標案、增設特殊競標條件、規格等），將原應公開招標者，轉變成為限制性招標或選擇性招標之情形勢難以規範，恐成為利益輸送之黑洞。又許多交易行為並無採購法之適用（例如：國有財產之標售），故僅將依採購法辦理採購者，排除於本法適用之外，對人民權益之保障是否完備，允宜慎酌。二、本法裁罰數額與級距應有調整必要【第十五條】公職人員或其關係人如與公職人員服務之機關或其受監督之機關為特定交易行為時，原第十五條規定處以交易行為金額一倍至三倍之罰鍰。然如交易行為金額甚高，科罰一倍至三倍罰鍰，將導致違反行政法上義務之罰鍰較違反刑事違法案件之罰金數額還高，其顯然未符比例原則，導致處罰輕重失衡之現象，故依據不同違法行為之態樣，調整罰鍰基準及級距。（修正條文第十五條）對於本條，法務部認為：本部受理裁罰案件案中，多數為公職人員之關係人與該公職人員服務之機關或監督之機關為交易行為，且尤以工程採購案交易金額動輒上百萬至數千萬元，如裁罰級距最高為500萬元，將造成類此高額工程採購案件關係人存僥倖之心態。而本法第9條已增定多數交易行為禁止之例外，裁罰級距以維持現行規範較宜。";
$scope.dataHint.length = 0;
$scope.dataList = addEvent.testData.slice();

  };



  $scope.clearData = function(){
    console.log("in function: clear data");
    $scope.newEvent = {};
    addEvent.listChoice = "";
    addEvent.category.length = 0;
    $(".category").each(function(index,element){
      $(element).find("input").prop("checked",false);
    });
    $(".eventlist").each(function(index,element){
      $(element).find("input").prop("checked",false);
    });
    $scope.dataList.length = 0;
    $scope.dataHint.length = 0;
    $scope.dataHint = addEvent.testData.slice();
  };

});

/*
 * for people.html
 */

function addItem($scope, it) {
  console.log(it);
  setTimeout(function(){$scope.$apply(function() {$scope.legislators.push(it);});}, 0);
}

var legControllers = angular.module('legControllers',[]);
legControllers.controller('legListCtrl', function($scope) {
  id = 0;
  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");
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
});

legControllers.controller('legDetailCtrl',['$scope','$routeParams',

    function($scope,$routeParams){
       $scope.legId = $routeParams.legId;

       $scope.legEvents=[];
       //first collect the event related to the legislar
       $scope.leg={};
       $scope.legdbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");

       $scope.addLegItem=function($scope, it) {
         console.log(it);
         setTimeout(function(){$scope.$apply(function() {$scope.leg.push(it);});}, 0);
       };

       $scope.legdbRef.on("child_added", function(d) {
         v = d.val();
         if(v.id==$scope.legId){
           $scope.leg = v;
           $scope.legEvents = v.event;
         }
       });

       $scope.event=[];
       //then collect the event list
       $scope.eventdbRef = new Firebase("https://blacklist.firebaseIO.com/event");

       $scope.addEventItem=function($scope, it) {
         //console.log(it);
         setTimeout(function(){$scope.$apply(function() {$scope.event.push(it);});}, 0);
       };

       $scope.eventdbRef.on("child_added", function(d) {
         v = d.val();
         var idx = $scope.legEvents.indexOf(v.id);
         if (idx > -1)
           {
             $scope.addEventItem($scope, v);
             console.log(v);
           }

       });
    }
]);

/*
 *     for rankApp (display as index.html)    
 */
var rankApp = angular.module('rankApp',[]);
rankApp.controller('rankCtrl', function($scope){
  id = 0;
  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");
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
});



