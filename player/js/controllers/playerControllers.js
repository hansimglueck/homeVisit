(function() {
    'use strict';

    angular.module("playerControllers", [])
        .controller('MainController', function ($scope, Status, playerColors, fxService) {
            $scope.status = Status;
            $scope.fxService = fxService;
            $scope.player = Status.player;
            $scope.playerColors = playerColors;
            $scope.turn = navigator.platform.indexOf("arm")>-1;
            console.log("onAndroid=");
            console.log($scope.turn);
            $scope.$on("disconnected", function () {
                console.log("MainController got 'disconnected'");
                $scope.status.resetPlayer();
            });
        })
        .controller('HomeController', function ($scope, $location, Status, Home, Rating, Socket, playerColors, ngAudio, europeSvgData) {
            $scope.europeSVG = europeSvgData;
            $scope.europeSVG.forEach(function (c) {
                c.rgb = [96, 96, 96];
            });
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
            $scope.playSound = function () {
                console.log("play sound");
                $scope.sound.play();
            };
            $scope.getPathCSS = function (index) {
                var id = $scope.europeSVG[index].id;
                var grey = 200;
                //console.log("get css for "+id);
                var x = $scope.home.data.filter(function (a) {
                    return a.id === id;
                });
                if (x.length === 0) {
                    return "rgb(200,200,200)";
                }
                var sat = x[0].val / 100;
                var col0 = Math.round(grey - grey * sat);
                var col1 = Math.round(grey + (255 - grey) * sat);
                var rgb = [col0, col0, col0];
                rgb[$scope.home.resultColor] = col1;
                return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
            };
            $scope.go = function () {
                Socket.emit("playbackAction", {cmd: "go"});
            };

        })
        .controller('VoteController', function ($scope, Home, $location) {
            $scope.home = Home;
            $scope.checkChanged = function (option) {
                if (option.checked) {
                    $scope.home.checked++;
                }
                else {
                    $scope.home.checked--;
                }
                console.log("now " + $scope.home.checked + " checked. home.limit=" + $scope.home.limit);
            };
            $scope.vote = function (id) {
                //bei multiple-choice werden die checked direkt in der homeFactory gesetzt... und die funktion hier wird ohne argument aufgerufen
                if (typeof id !== 'undefined') {
                    $scope.home.options[id].checked = true;
                    if ($scope.home.voteType === "enterNumber") {
                        $scope.home.options[id].text = $scope.home.options[id].value;
                    }
                }
                $scope.home.vote();
            };
            $scope.confirmVote = function () {
                $scope.home.confirmVote();
            };
            $scope.cancelVote = function () {
                $scope.home.options.forEach(function (opt) {
                    opt.checked = false;
                });
                $scope.home.checked = 0;
                $location.path("/vote");
            };

            $scope.smaller = false;
            if ($scope.home.voteType === 'customOptions') {
                var totalLength = 0;
                if (typeof Home.text !== "undefined") {
                    totalLength += Home.text.length;
                }
                Home.options.forEach(function(o) {
                    totalLength += o.text.length;
                });
                if (totalLength > 400) {
                    console.log('lot of text: making it smaller!');
                    console.log('totalLength', totalLength);
                    $scope.smaller = true;
                }
            }

        })
        .controller('ResultsController', function($scope, Home, playerColors){
            $scope.playerColors = playerColors;
            $scope.home = Home;
            $scope.pieChartOptions = {
                scaleOverlay: false,
                scaleOverride: false,
                scaleSteps: null,
                scaleStepWidth: null,
                scaleStartValue: null,
                scaleLineColor: "rgba(0,0,0,.1)",
                scaleLineWidth: 1,
                scaleShowLabels: true,
                scaleLabel: "<%=value%>",
                scaleFontFamily: "'proxima-nova'",
                scaleFontSize: 10,
                scaleFontStyle: "normal",
                scaleFontColor: "#909090",
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                bezierCurve: true,
                pointDot: true,
                pointDotRadius: 3,
                pointDotStrokeWidth: 1,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true,
                animation: true,
                animationSteps: 60,
                //animationEasing: "easeOutQuart",
                onAnimationComplete: null,
                responsive: true,
                colours: playerColors
            };

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
                window.location.reload();
            };
            $scope.$on("disconnected", function () {
                console.log("MenuController got 'disconnected'");
                $scope.status.resetPlayer();
            });
            $scope.$on("pingpong", function (event, pongTime, pingTimeouts) {
                $scope.pingTime = pongTime;
                $scope.pingTimeouts = pingTimeouts;
                $scope.$digest();
            });
        })
        .controller('NavbarController', function ($scope, $location, Status, Rating, Home, fxService) {
            $scope.status = Status;
            $scope.rating = Rating;
            $scope.newMessages = 0;
            $scope.test = "test aus navbar controller";
            $scope.$on("newChatMessage", function (event, count) {
                $scope.newMessages = count;
            });
            $scope.$on("disconnected", function () {
                $scope.status.resetPlayer();
            });
            $scope.go = function (path) {
                $location.path(path);
            };
            $scope.startCountdown = function (val) {
                fxService.startCountdown(val, cb);
            };
            function cb() {
                console.log($scope.test);
            }
            $scope.playSound = function (id) {
                fxService.playSound(id);
            };
        })
        .controller('EuropeController', function ($scope, europeSvgData) {
            $scope.europeSVG = europeSvgData;
            $scope.black = true;
            $scope.europeSVG.forEach(function (c) {
                c.rgb = [96, 96, 96];
            });
            $scope.select = function (i) {
                console.log("select " + i);
                if (typeof $scope.europeSVG[i].selected === "undefined") {
                    $scope.europeSVG[i].selected = false;
                }
                $scope.europeSVG[i].selected ^= true;
            };
            $scope.getPathCSS = function (id) {
                var x = $scope.europeSVG[id];
                if (x.selected) {
                    return "rgb(0,200,0)";
                }
                return "rgb(200,200,200)";
            };
        })
        .controller("SoundController", function($scope, fxService){
            fxService.playSound(0);
        })
        .controller("BlackController", function($scope, Status){
            $scope.status = Status;
        })
        .controller('CardController', function($scope, Home){
            $scope.home = Home;
        })
        .filter('isOtherPlayerThan', function () {
            return function (players, self) {
                return players.filter(function (p) {
                    if (!p.joined) {
                        return false;
                    }
                    return p.playerId !== self.playerId;
                });
            };
        });

})();
