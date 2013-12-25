adminCtrl = ($scope) ->
  $scope.logined = false
  $scope.db-ref = new Firebase \https://blacklist.firebaseIO.com/
  $scope.auth = new FirebaseSimpleLogin $scope.db-ref,(err,user) ->
    if user => $scope.$apply ->
      $scope.logined = true
      $scope.user = user
    if user => console.log user, user.accessToken, user.id
    $scope.login-panel true
  $scope.login-panel = (dismiss=false) ->
    $(\#login-panel)modal if dismiss => \hide else \show
    false
  $scope.signup = ->
    console.log "add user: #{$scope.account}"
    $scope.auth.create-user $scope.account, $scope.password, (e,user) ->
      if e => alert e
      $scope.login-panel true
  $scope.login = -> $scope.auth.login \password, do
    email: $scope.account
    password: $scope.password
    rememberMe: true
  $scope.logout = ->
    $scope.auth.logout!
    $scope.user = null
