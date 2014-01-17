
legControllers.controller('criDetailCtrl',['$scope','$routeParams',

    function($scope,$routeParams){

      login($scope, function(){ });


      /////// Top Menu //////////////
      // Category Button
      $scope.categories = [];
      $.each(legApp.categories, function(index,element){
        $scope.categories.push({"name":element,"color":getColor(element)});
      });

      //ISSUE
      //This is bad..... After the checkbox has been render, have to call semantic UI
      $scope.flag = true;
      $scope.$watch(function(){
        return document.body.innerHTML
      }, function(val){

        if($scope.flag && ($(".categoryMenu").length===$scope.categories.length+1)){
          $scope.menuReady();//TOP MENU
          $scope.flag = false;
        }
      });

      //Pre-selection

      $scope.categoryPrechoice = $routeParams.category;
      if($scope.categoryPrechoice == null)
        $scope.categoryFilter = "";
      else
        $scope.categoryFilter = $scope.categoryPrechoice;


      $scope.menuReady = function() {

        // Set active category
        if($scope.categoryPrechoice != null){
          $(".categoryMenu").each(function(index,element){
            var current = $(element).attr("value");
            if(current === $scope.categoryPrechoice)
              $(element).addClass('active');
            else
              $(element).removeClass('active');
          });
        }


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


/////////////// TOP MENU END ////////////////////////


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


