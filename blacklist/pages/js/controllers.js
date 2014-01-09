$(document)
  .ready(function() {
  $('.category')
      .on('click',toggleCategory)
    ;
    $('.eventlist')
      .on('click',toggleList)
    ;

   })
;

/*
 * for eventall.html
 */
function getColor(categoryName){
  var color ="";
  switch(categoryName){
    case '環保': color = 'green';break;
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
var legControllers = angular.module('legControllers',[]);

var eventall={};
legControllers.controller('eventListCtrl', function($scope){
  //Semantic UI
//  $('.ui.checkbox').checkbox();
//  $('.ui.accordion').accordion();

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
 $scope.flag = 0;
 $scope.$watch(function(){
   return document.body.innerHTML
 }, function(val){
   $scope.flag++;
   if($scope.flag==$scope.critiquerSum){
     $('.ui.accordion').accordion();
     $('.ui.checkbox').checkbox();
     $('.critiquerFilter').on('click',$scope.toggleCritiquer);
   }
 });

  //Critiquer filter
  $scope.critiquerFilter = function(n){
    for(var i=0;i<$scope.critiquerSelection.length;i++){
      if(n.ngo === $scope.critiquerSelection[i])
        return n;
    }
  };


  $scope.addEventItem=function($scope, it) {
    setTimeout(function(){$scope.$apply(function() {$scope.events.push(it);});}, 0);
  };

  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/event");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    v.color = getColor(v.category);
    $scope.addEventItem($scope, v);
  });
  $scope.events=[];
});

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
/*
  $scope.dbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");
  $scope.dbRef.on("child_added", function(d) {
    v = d.val();
    addItem($scope, v);
  });
  */$scope.legislators = [{"name":"111"},{"name":"222"}];

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
  console.log(it);
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

legControllers.controller('legDetailCtrl',['$scope','$routeParams',

    function($scope,$routeParams){
      $('.ui.checkbox')
      .checkbox()
      ;
      $('.ui.accordion')
      .accordion()
      ;

      $scope.legId = $routeParams.legId;

       $scope.legEvents=[];
       //first collect the event related to the legislar
       $scope.legdbRef = new Firebase("https://blacklist.firebaseIO.com/legislator");

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
           v.color = getColor(v.category);
           $scope.addEventItem($scope, v);
           console.log(v);
         }

       });
    }
]);

/*
 *     for rank.html (display as index.html)
 */

legControllers.controller('rankCtrl',['$scope','$routeParams',

 function($scope,$routeParams){
  $('.ui.accordion')
  .accordion()
  ;
  $('.ui.checkbox')
  .checkbox()
  ;

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
    //{name: "呂小章", img: "01.jpg", page: "leg01.html", no: "1", committees: wrap([6,5,9,1,0,6,5,1,33]), committee: "經濟", party: "中國國民黨", section: "台北市第一選區"},
    //{name: "王大平", img: "02.jpg", page: "leg02.html", no: "2", committees: wrap([3,4,5,2,4,0,0,6,24]), committee: "教育文化", party: "親民黨", section: "平地原住民"},
    //{name: "陳阿明", img: "03.jpg", page: "leg03.html", no: "3", committees: wrap([1,1,3,0,7,2,3,2,19]), committee: "內政", party: "民主進步黨", section: "全國不分區"}
}]);

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


legControllers.controller('criDetailCtrl',['$scope','$routeParams',

    function($scope,$routeParams){
       $scope.criId = $routeParams.criId;

       $scope.criEvents=[];
       //first collect the event related to the critiquer
       $scope.cridbRef = new Firebase("https://blacklist.firebaseIO.com/critiquer");
       $scope.cridbRef.on("child_added", function(d) {
         v = d.val();
         if(v.id==$scope.criId){
           $scope.cri = v;
           $scope.criEvents = v.event;
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
         var idx = $scope.criEvents.indexOf(v.id);
         if (idx > -1)
         {
           v.color = getColor(v.category);
           $scope.addEventItem($scope, v);
         }

       });
    }
]);


