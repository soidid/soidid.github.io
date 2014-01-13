$(document)
  .ready(function() {
    $('.ui.checkbox').checkbox();

    $('.category')
    .on('click',toggleCategory)
    ;
    $('.eventlist')
    .on('click',toggleList)
    ;

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



/*----------------------------------------------------------*/


var legControllers = angular.module('legControllers',[]);

legControllers.controller('eventDetailCtrl',['$scope','$routeParams',
    function($scope,$routeParams){
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
 * for add-event.html
 */
var addEvent={};
addEvent.categoryChoice="";
function toggleCategory(){
  console.log("in toggleCategory");
  addEvent.categoryChoice = $(this).find("label").text();

  console.log(addEvent.categoryChoice);
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
  $scope.categories = legApp.categories;

  // list choices
  $scope.lists = legApp.lists;
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
/*
  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    addItem($scope, v);
  });
  */$scope.legislators = [];

  addEvent.testData = [
    {title:'公職人員利益衝突回避法修正案', link:'www.filelocation.com/law.pdf'},
    {title:'立法院會議記錄',link:'www.filelocation.com/meeting.doc'}
  ]

  $scope.setDataHint = function(){
    $scope.dataHint = $.extend(true,[],addEvent.testData);

    $.map($scope.dataHint,function(element){
      element.title = "例如："+element.title;
      element.link = "例如："+element.link;
    });
  };
  $scope.setDataHint();
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

  $scope.getDate = function(){
     var d = new Date();
     var month = d.getMonth()+1;
     var day = d.getDate();
     var output = d.getFullYear()+"-"+((''+month).length<2?'0':'')+month+"-"+((''+day).length<2?'0':'')+day;
     return output;

  }
  $scope.checkInput = function(n){
     console.log("in check input function, current data:");
     console.log(n);
     if(n.name==null){ console.log("請輸入事件名稱"); return false;}
     if(n.category==null){ console.log("請選擇事件類型"); return false;}
     if(n.list==null){ console.log("請選擇所屬表單（有疑慮/不推薦/強烈反對）"); return false;}
     if(n.abstract==null){ console.log("請輸入事件摘要"); return false;}
     if(n.people==null){ console.log("請輸入相關人士"); return false;}
     if(n.content==null){ console.log("請輸入事件名稱"); return false;}
     if(n.data.length==0){ console.log("請輸入相關資料並附原始連結（至少一項）"); return false;}
     return true;


  };
  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/event");
  $scope.newEvent={};

  $scope.addNewEvent = function(){
    $scope.newEvent.category = addEvent.categoryChoice;
    if(addEvent.listChoice.length>0)
      $scope.newEvent.list = addEvent.listChoice;
    $scope.getData();
    $scope.newEvent.data = addEvent.dataList;
    $scope.newEvent.date = $scope.getDate();
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
    addEvent.categoryChoice = "司法";
    $(".category").each(function(index,element){
      var current = $(element).find("input");
      if(addEvent.categoryChoice == $(element).find("label").text())
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
    addEvent.categoryChoice = "";
    $(".category").each(function(index,element){
      $(element).find("input").prop("checked",false);
    });
    $(".eventlist").each(function(index,element){
      $(element).find("input").prop("checked",false);
    });
    $scope.dataList.length = 0;
    $scope.dataHint.length = 0;
    $scope.setDataHint();
  };

});

/*
 * for people.html
 */

function addItem($scope, it) {
  setTimeout(function(){$scope.$apply(function() {$scope.legislators.push(it);});}, 0);
}

legControllers.controller('legListCtrl', function($scope) {

  $('.ui.dropdown')
  .dropdown()
  ;
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



/* critiquers */

legControllers.controller('criListCtrl', function($scope) {

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


