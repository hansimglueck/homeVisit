angular.module("playerControllers", [])
    .controller('ctrl', function ($scope, Socket, $cookies) {
        $scope.cookie = $cookies['connect.sid'];
        $scope.messages = ["waiting..."];
        $scope.text = [".oO"];
        $scope.options = null;
        $scope.limit = 1;
        $scope.checked = 0;
        $scope.player = {};
        $scope.$on('$viewContentLoaded', function(){
            console.log("$viewContentLoaded");
            //$scope.register();
        });
        $scope.register = function() {
            //register
            //Socket.emit({type: "register", data: {role:'player', sid:$scope.cookie}});
            //Socket.connect();
        };
        $scope.vote = function (id) {
            console.log(id);
            if (id != undefined) {
                console.log("no");
                $scope.options[id].checked = true;
            }
            Socket.emit({type: "vote", data: $scope.options});
        };

        $scope.checkChanged = function (option) {
            if (option.checked) $scope.checked++;
            else $scope.checked--;
        };

        Socket.on('registerConfirm', function(event) {
            $scope.player = JSON.parse(event.data).data;
        });

        Socket.on('display', function (event) {
            var data = JSON.parse(event.data).data;
            console.log("new display: " + data.type);
            if (data) {
                $scope.text = data.text.split("::");
                $scope.type = "card";
                $scope.labels = [];
                $scope.data = [];
                if (data.type == "vote") {
                    $scope.type = "vote";
                    $scope.options = data.voteOptions;
                    $scope.limit = data.voteMulti;
                    $scope.checked = 0;
                }
                else $scope.options = null;
                if (data.type == "result") {
                    $scope.type = "result";
                    $scope.text = "";
                    $scope.labels = data.labels;
                    $scope.data = data.data;
                }

            }
        });

    })
;
