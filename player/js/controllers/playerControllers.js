angular.module("playerControllers", [])
    .controller('MainController', function ($scope, colors, borderColors, Status) {
        $scope.status = Status;


        $scope.col1 = function () {
            return colors[$scope.status.player.colors[0]];
        };
        $scope.col2 = function () {
            return colors[$scope.status.player.colors[1]];
        };
        $scope.col1border = function () {
            return borderColors[$scope.status.player.colors[0]];
        };
        $scope.col2border = function () {
            return borderColors[$scope.status.player.colors[1]];
        };

    })
    .controller('HomeController', function ($scope, $location, Status, Home, Rating, Socket, colors, playerColors, ngAudio, europeSvgData) {
        $scope.europeSVG = europeSvgData;
        $scope.europeSVG.forEach(function(c){
            c.rgb = [96,96,96];
        });
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.status = Status;
        $scope.home = Home;
        $scope.text = $scope.home.text;
        $scope.type = $scope.home.type;
        $scope.limit = Home.limit;
        $scope.checked = $scope.home.checked;
        $scope.sound = ngAudio.load("sounds/tiny-01.mp3");
        $scope.data = {
            voteNumber: 0
        };
        $scope.options = {
            scaleOverlay : false,
            scaleOverride : false,
            scaleSteps : null,
            scaleStepWidth : null,
            scaleStartValue : null,
            scaleLineColor : "rgba(0,0,0,.1)",
            scaleLineWidth : 1,
            scaleShowLabels : true,
            scaleLabel : "<%=value%>",
            scaleFontFamily : "'proxima-nova'",
            scaleFontSize : 10,
            scaleFontStyle : "normal",
            scaleFontColor : "#909090",
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            bezierCurve : true,
            pointDot : true,
            pointDotRadius : 3,
            pointDotStrokeWidth : 1,
            datasetStroke : true,
            datasetStrokeWidth : 2,
            datasetFill : true,
            animation : true,
            animationSteps : 60,
            animationEasing : "easeOutQuart",
            onAnimationComplete : null
        };
        $scope.playSound = function() {
            console.log("play sound");
            $scope.sound.play();
        };
        /*
        $scope.$watch('home.type', function(newVal, oldVal) {
            console.log(oldVal+"->"+newVal);
            if (oldVal !="vote" && newVal == "vote") $scope.playSound();
        });
        */
        $scope.getPathCSS = function(index) {
            var id = $scope.europeSVG[index].id;
            var grey = 200;
            //console.log("get css for "+id);
            var x = $scope.home.data.filter(function(a){return a.id == id});
            if (x.length == 0) return "rgb(200,200,200)";
            var sat = x[0].val/100;
            var col0 = Math.round(grey - grey*sat);
            var col1 = Math.round(grey + (255-grey)*sat);
            var rgb = [col0,col0,col0];
            rgb[$scope.home.resultColor] = col1;
            return "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
        };
         $scope.go = function() {
            Socket.emit({type:"playbackAction", data:"go"}, function() { console.log('go emitted'); });
       }
       
    })
    .controller('VoteController', function($scope, Home, $location) {
        $scope.home = Home;
        $scope.checkChanged = function (option) {
            if (option.checked) $scope.home.checked++;
            else $scope.home.checked--;
            console.log("now "+$scope.home.checked+" checked. home.limit="+$scope.home.limit);
        };
        $scope.vote = function (id) {
            if (Home.voteType=="enterNumber" && (isNaN($scope.home.options[id].value) || $scope.home.options[id].value.indexOf(",")!=-1)) return;
            var text = "";
            //bei multiple-choice werden die checked direkt in der homeFactory gesetzt... und die funktion hier wird ohne argument aufgerufen
            if (id != undefined) {
                text = $scope.home.options[id].text;
                $scope.home.options[id].checked = true;
                if ($scope.home.voteType=="enterNumber") text = $scope.home.options[id].value;
                //if (!confirm("Vote for: "+text)) return;
                if ($scope.home.voteType=="enterNumber") {
                    $scope.home.options[id].text = $scope.home.options[id].value;
                }
            }
            $scope.home.vote();
        };
        $scope.confirmVote = function() {
            $scope.home.confirmVote();
        };
        $scope.cancelVote = function() {
            $scope.home.options.forEach(function(opt){opt.checked=false});
            $scope.home.checked = 0;
            $location.path("/vote");
        }

    })
    .controller('MenuController', function ($scope, Status, Socket) {
        $scope.status = Status;
        $scope.socket = Socket;
        $scope.pingpong = Socket.getPingPong();
        $scope.joinGame = function () {
            Status.joinGame();
        };
        $scope.leaveGame = function () {
            Status.leaveGame();
        };
        $scope.reload = function () {
            //window.location.reload();
            console.log('X')

        };
        $scope.$on("disconnected", function () {
            console.log("MenuController got 'disconnected'");
            $scope.status.resetPlayer();
        });
        $scope.$on("pingpong", function (event, pongTime, pingTimeouts) {
            //console.log("pingpong: "+pongTime+", "+ pingTimeouts);
            $scope.pingTime = pongTime;
            $scope.pingTimeouts = pingTimeouts;
            $scope.$digest();
        })
        //$scope.gmaps = function () {
        //    window.plugins.webintent.startActivity({
        //        action: window.plugins.webintent.ACTION_VIEW,
        //        url: 'geo:0,0?q=' + "berlin"
        //    }, function () {
        //    }, function () {
        //        alert('Failed to open URL via Android Intent');
        //    });
        //};
        //$scope.radio = function () {
        //    navigator.startApp.start("com.sonyericsson.fmradio", function (message) {  /* success */
        //            console.log(message); // => OK
        //        },
        //        function (error) { /* error */
        //            console.log(error);
        //        });
        //};
    })
    .controller('NavbarController', function ($scope, $location, Status, Rating, Chat, Home, colors, fxService) {
        $scope.status = Status;
        $scope.chat = Chat;
        $scope.rating = Rating;
        $scope.newMessages = 0;
        $scope.test = "test aus navbar controller";
        $scope.$on("newChatMessage", function (event, count) {
            $scope.newMessages = count
        });
        $scope.$on("disconnected", function () {
            $scope.status.resetPlayer();
        });
        $scope.go = function (path) {
            $location.path(path);
        };
        $scope.startCountdown = function(val) {
            fxService.startCountdown(val, cb);
        };
        function cb() {
            alert($scope.test);
        }
        $scope.playSound = function(id) {
            fxService.playSound(id);
        }

    })
    .controller('EuropeController', function ($scope, europeSvgData) {
        $scope.europeSVG = europeSvgData;
        $scope.black = true;
        $scope.europeSVG.forEach(function(c){
            c.rgb = [96,96,96];
        });
        $scope.select = function (i) {
            console.log("select " + i);
            if (typeof $scope.europeSVG[i].selected == "undefined") $scope.europeSVG[i].selected = false;
            $scope.europeSVG[i].selected ^= true;
        };
        $scope.getPathCSS = function(id) {
            var x = $scope.europeSVG[id];
            if (x.selected) return "rgb(0,200,0)";
            else return "rgb(200,200,200)";
        };
    })
    .controller('MotionController', function ($scope, $cordovaDeviceMotion) {
        $scope.X = 0;
        $scope.Y = 0;
        $scope.Z = 0;
        $scope.lastX = [];
        $scope.lastY = [];
        $scope.lastZ = [];
        $scope.smoothing = 2;
        $scope.angle = 60;
        $scope.maxXVal = 9;
        $scope.minXVal = -9;
        var options = {frequency: 100};

        $scope.rotateCSS = function () {
            return "{'-webkit-transform':'rotate(" + Math.round($scope.angle) + "deg)'}";
        };

        function avg(array) {
            var sum = 0;
            for (var i = 0; i < array.length; i++) {
                sum += array[i];
            }
            return sum / array.length;
        }
        function map_range(value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        }
        document.addEventListener("deviceready", function () {
            $scope.watch = $cordovaDeviceMotion.watchAcceleration(options);
            $scope.watch.then(
                null,
                function (error) {
                    console.log(error);
                    // An error occurred
                },
                function (result) {
                    $scope.lastX.push(result.x);
                    $scope.lastY.push(result.y);
                    $scope.lastZ.push(result.z);
                    if ($scope.lastX.length > $scope.smoothing) $scope.lastX.shift();
                    if ($scope.lastY.length > $scope.smoothing) $scope.lastY.shift();
                    if ($scope.lastZ.length > $scope.smoothing) $scope.lastZ.shift();
                    $scope.X = avg($scope.lastX);
                    $scope.Y = avg($scope.lastY);
                    $scope.Z = avg($scope.lastZ);
                    //if ($scope.X > $scope.maxXVal) $scope.maxXVal = $scope.X;
                    //if ($scope.X < $scope.minXVal) $scope.minXVal = $scope.X;
                    //var timeStamp = result.timestamp;
                    //var x = map_range($scope.X, $scope.minXVal, $scope.maxXVal, -1, 1);
                    var x = map_range($scope.X, -9.9, 9.9, -1, 1);
                    if (x > 1) x = 1;
                    if (x < -1) x = -1;
                    $scope.angle = Math.round(Math.asin(x) / Math.PI * 180);
                    if ($scope.Y < 0 && $scope.angle >0) $scope.angle = 180 - $scope.angle;
                    if ($scope.Y < 0 && $scope.angle <0) $scope.angle = -180 - $scope.angle;
                    //$scope.angle -= 90;
                    //$scope.angle %= 360;
                    setCol($scope.angle);
                });
        }, false);
        function setCol(angle) {
            var r = map_range(angle, -70, 70, 0, 127);
            if (r < 0) r = 0;
            if (r > 127) r = 127;
            btSerial.sendData([128, r, 0, (127-r)]);
        }
        $scope.$on("$destroy", function() {
            $scope.watch.clearWatch();
        });
    })
    .controller('ArduinoController', function ($scope) {
        $scope.btConnected = btSerial.getConnected();
        $scope.send = function (x) {
            console.log("sending " + x);
            serial.write(
                '1',
                function (successMessage) {
                    alert(successMessage);
                },
                errorCallback
            );

        };
        $scope.setColor = function (r, g, b) {
            btSerial.sendData([128, r, g, b]);
        };
        $scope.setServo = function(deg) {
            if (deg > 90) deg = 90;
            btSerial.sendData([129, 2*deg]);
        };

        $scope.btConnect = function () {
            var deviceid = "00:06:66:03:17:85";
            btSerial.connectById(deviceid);

        };
        var errorCallback = function (message) {
            alert('Error in Serial: ' + message);
        };

        //serial.requestPermission(
        //    function (successMessage) {
        //        serial.open(
        //            {baudRate: 9600},
        //            function (successMessage) {
        //                serial.write(
        //                    '1',
        //                    function (successMessage) {
        //                        alert(successMessage);
        //                    },
        //                    errorCallback
        //                );
        //            },
        //            errorCallback
        //        );
        //    },
        //    errorCallback
        //);

    })
    .controller('InfoController', function ($scope) {
        $scope.template = {
            url: "/info/denanot.html"
        }
    })
    .controller('ChatController', function ($scope, Status, Chat, colors, playerColors, $location, $anchorScroll, $routeParams) {
        $scope.chat = Chat;
        $scope.newCntPerPlayer = Chat.newCntPerPlayer;
        $scope.status = Status;
        $scope.$routeParams = $routeParams;
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.scrollToItem = function (itemName) {
            //now scroll to it.
            $location.hash(itemName);
            $anchorScroll();
            $location.hash();
        };

    })
    .controller('PlayerChatController', function ($scope, Status, Chat, colors, playerColors, $routeParams) {
        $scope.status = Status;
        $scope.$routeParams = $routeParams;
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.messages = Chat.messages;
        $scope.data = {};
        $scope.data.newMessage = "";
        $scope.$on('$viewContentLoaded', function (event) {
            console.log(event);
            Chat.messagesRead($scope.$routeParams.playerId);
        });
        $scope.chat = function (pid) {
            Chat.chat(pid, $scope.data.newMessage[pid]);
            $scope.data.newMessage[pid] = "";
        };
    })
    .controller('RatingController', function ($scope, Status, Rating, colors, playerColors) {
        $scope.status = Status;
        $scope.rating = Rating;
        $scope.colors = colors;
        $scope.playerColors = playerColors;
        $scope.rate = function (id, val) {
            $scope.rating.rate(id, val);
        };
    })
    .filter('isOtherPlayerThan', function () {
        return function (players, self) {
            return players.filter(function (p) {
                if (!p.joined) return false;
                return p.playerId != self.playerId;
            });
        }
    });
