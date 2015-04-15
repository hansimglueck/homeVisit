angular.module("gameControllers", [])
    .controller('ScoreController', function ($scope, Socket, Status, colors) {
        $scope.socket = Socket;
        $scope.test = "HALLO WELT";
        $scope.status = {};
        $scope.minScore = 0;
        $scope.maxScore = 0;
        $scope.status.otherPlayers = [
            {
                playerId: 1,
                score: -10
            },
            {
                playerId: 2,
                score: 50
            },
            {
                playerId: 3,
                score: 80
            },
            {
                playerId: 4,
                score: 30
            }
        ];
        $scope.status.player = {
            playerId: 1,
            score: 60
        };
        $scope.status = Status;
        //$scope.color = "green";
        $scope.myColor = function () {
            return colors[$scope.status.player.colors[0]];
        };

        $scope.baromaterHeight = 350;
        $scope.getBaroHeight = function () {
            return $scope.baromaterHeight.toString() + "px";
        }

        $scope.getLinePos = function (index) {
            $scope.minScore = $scope.status.otherPlayers[0].score;
            $scope.maxScore = $scope.status.otherPlayers[0].score;
            for (var i = 0; i < $scope.status.otherPlayers.length; i++) {
                if ($scope.status.otherPlayers[i].score < $scope.minScore) {
                    $scope.minScore = $scope.status.otherPlayers[i].score;
                }
                if ($scope.status.otherPlayers[i].score > $scope.maxScore) {
                    $scope.maxScore = $scope.status.otherPlayers[i].score;
                }
            }
            if ($scope.status.player.score < $scope.minScore) {
                $scope.minScore = $scope.status.player.score;
            }
            if ($scope.status.player.score > $scope.maxScore) {
                $scope.maxScore = $scope.status.player.score;
            }
            var myScore = $scope.status.otherPlayers[index].score;
            return ($scope.linePosFromScore(myScore)).toString() + "px";
        }
        $scope.getMyLinePos = function () {
            var myScore = $scope.status.player.score;
            return ($scope.linePosFromScore(myScore)).toString() + "px";
        }
        $scope.linePosFromScore = function (myScore) {
            var linePos = $scope.baromaterHeight - ((myScore - $scope.minScore) * $scope.baromaterHeight / ($scope.maxScore - $scope.minScore));
            return linePos;
        }

        $scope.getPosHeight = function () {
            return ($scope.linePosFromScore(0)).toString() + "px";
        }
        $scope.getNegHeight = function () {
            return ($scope.baromaterHeight - $scope.linePosFromScore(0)).toString() + "px";
        }
    })
    .controller('DealsController', function ($scope, DealFactory, $routeParams, Status) {
        $scope.subject = $routeParams.subject || null;
        $scope.deals = DealFactory.deals;
        if (DealFactory.active.deal == null) DealFactory.addDeal($scope.subject || "xyz");
        $scope.dealStates = ["just opened", "waiting for answer", "have to reply", "confirmed", "denied"];
        $scope.newDeal = {subject: "alliance", playerId: 0, state: 0, messages: []};
        $scope.message = {
            value: 0,
            playerId: Status.player.playerId
        };

        $scope.openDeal = function (deal) {
            console.log(deal);
            DealFactory.active.deal = deal;
        };
        $scope.addDeal = function (subject) {
            $scope.message.value = 0;
            if (typeof subject === "undefined") subject = $scope.subject;
            DealFactory.addDeal(subject);
        };
        $scope.cancelDeal = function(deal) {
            DealFactory.cancelDeal(deal);
            $scope.addDeal("insurance");
        };
        $scope.getMyDealState = function (deal) {
            return DealFactory.getMyDealState(deal);
        };
        $scope.getDealStateText = function (deal) {
            return $scope.dealStates[DealFactory.getMyDealState(deal)];
        };
    })
    .controller('DealDetailsController', function ($scope, DealFactory, $routeParams, Status) {
        $scope.active = DealFactory.active;
        $scope.status = Status;
        $scope.choosePlayerForDeal = function (player) {
            DealFactory.active.deal.player1Id = player.playerId;
        };
        $scope.decreaseValue = function () {
            $scope.message.value -= 1;
        };
        $scope.increaseValue = function () {
            $scope.message.value += 1;
        };
        $scope.getRequestMessage = function (message) {
            var value = message.value;
            //console.log("getMessage for "+value);
            var me = (message.playerId == Status.player.playerId);
            var first = (Status.player.playerId == DealFactory.active.deal.player0Id);

            var ret = ["I like to deal " + DealFactory.active.deal.subject + " with you!"];
            var balance = getBalance(value, me^!first);
            if (balance < 0) {
                ret.push(" I offer " + (-1) * balance + " points.");
            }
            if (balance > 0) {
                ret.push(" I want " + balance + " points.");
            }
            if (balance === 0) ret.push(" For 0 points.");
            return ret;
        };
        function getBalance(value, x) {
            var balance = value;
            if (x) balance *= -1;
            //if (DealFactory.active.deal.player0Id === Status.player.playerId) balance *= -1;
            return balance;
        }

        $scope.getMessageText = function (message) {
            var ret = "";
            switch (message.type) {
                case "request":
                    ret += $scope.getRequestMessage(message);
                    break;
                case "deny":
                    ret += " denied";
                    break;
                case "confirm":
                    ret += "confirmed";
                    break;
            }
            return ret;
        };
        $scope.sendMessageForDeal = function (type) {
            DealFactory.sendMessage(type, $scope.message.value);
        }
    })
;

