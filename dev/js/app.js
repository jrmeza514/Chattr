let Chattr = (() => {
  let __self = {
    messages : []
  };
  let app = angular.module('Chattr', []);

  let server = {
    connected: false,
    protocol:'http://',
    host:'localhost',
    port: 8000
  };

  app.controller('ChattrController', function( $scope ){
    $scope.username = "";
    $scope.connected = false;
    $scope.users = [];
    let scoket = null;
    $scope.connect = () => {
      socket = io.connect( server.protocol + server.host + ':' + server.port );
      socket.on('connected', () => {
        socket.emit('joined', $scope.username );
      });

      socket.on('roster_update', ( users ) => {
        $scope.users = users;
        console.log($scope.users);
      });
      $scope.connected = true;
    };
  });

  return __self;
})();
