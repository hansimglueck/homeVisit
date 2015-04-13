angular.module("gameControllers", [])
    .controller('ScoreController', function ($scope, Socket, Status) {
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
    .controller('DonationController', function ($scope, Socket, $routeParams, Status, colors, $location) {
        $scope.colors = colors;
        $scope.itemId = $routeParams.itemId;
        $scope.status = Status;
        $scope.donate = function (playerId, playerColors, itemId) {
            if (!confirm("Wirklich an Team " + playerColors[0] + "-" + playerColors[1] + " geben?")) return;
            console.log("Donate it!");
            Socket.emit({
                type: "donation",
                recipient: playerId,
                itemId: itemId
            });
            $location.url("/score");
        };

        $scope.getPlayersOrdered = function () {
            var players = $scope.status.otherPlayers.filter(function (p) {
                return p.joined;
            });
            var ordered = [];
            var mySeat = players.map(function (p, id) {
                return {id: id, playerId: p.playerId}
            }).filter(function (pp) {
                return pp.playerId == Status.player.playerId
            })[0].id;
            var oppositeSeat = (mySeat + Math.floor(players.length / 2)) % players.length;
            var seat;
            var p = null;
            for (var i = 0; i < players.length; i++) {
                if (i % 2 == 1) {
                    //rechts rum
                    seat = oppositeSeat + Math.ceil(i / 2);
                } else {
                    //links rum
                    seat = oppositeSeat - Math.floor(i / 2);
                }
                seat += players.length;
                seat %= players.length;
                p = getPlayerForSeat(seat);
                if (p != null) if (p.playerId != Status.player.playerId) ordered.push(p);
            }
            return ordered;
        };
        function getPlayerForSeat(id) {
            var arr = $scope.status.otherPlayers.filter(function (p) {
                return p.joined
            });
            if (arr.length > 0) return arr[id];
            else return null;
        }
    })
    .controller('DealsController', function ($scope, DealFactory, $routeParams) {
        $scope.subject = $routeParams.subject || null;
        $scope.deals = DealFactory.deals;
        $scope.dealStates = ["just opened", "waiting for answer", "have to reply", "confirmed", "denied"];
        $scope.newDeal = {subject: "alliance", playerId: 0, state: 0, messages: []};

        $scope.openDeal = function (deal) {
            console.log(deal);
            DealFactory.active.deal = deal;
        };
        $scope.addDeal = function () {
            DealFactory.addDeal($scope.subject);
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
        $scope.message = {
            value: 0,
            playerId: Status.player.playerId
        };
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

            var ret = "I like to deal " + DealFactory.active.deal.subject + " with you.";
            var balance = getBalance(value, me^!first);
            if (balance < 0) {
                ret += " I offer " + (-1) * balance + " points.";
            }
            if (balance > 0) {
                ret += " I want " + balance + " points.";
            }
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
            if (message.playerId == Status.player.playerId) ret = "Us: ";
            else ret = "Them: ";
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

