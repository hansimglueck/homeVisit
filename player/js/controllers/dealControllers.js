angular.module("dealControllers", [])
    .controller('DealsController', function ($scope, DealFactory, $routeParams, Status) {
        $scope.deals = DealFactory.deals;
    })
    .controller('DealMessageController', function ($scope, DealFactory) {
        function getBalance(value, x) {
            var balance = value;
            if (x) balance *= -1;
            return balance;
        }

        $scope.changeValue = function (val) {
            $scope.message.value += val;
        };
        $scope.getMessageText = function () {
            var ret = [];
            switch ($scope.message.type) {
                case "request":
                    ret = $scope.getRequestMessage();
                    break;
                case "deny":
                    ret = ["Deny"];
                    break;
                case "confirm":
                    ret = ["Confirm"];
                    break;
                case "cancel":
                    ret = ["Cancel"];
                    break;
            }
            return ret;
        };
        $scope.getRequestMessage = function () {
            var message = $scope.message;
            var value = message.value;
            //console.log("getMessage for "+value);
            var me = (message.playerId == $scope.status.player.playerId);
            if (typeof message.playerId == "undefined") me = true;
            var first = ($scope.status.player.playerId == $scope.deal.player0Id);

            var ret = ["I like to deal!"];
            var balance = getBalance(value, me ^ !first);
            if (balance < 0) {
                ret.push(" I offer " + (-1) * balance + " points.");
            }
            if (balance > 0) {
                ret.push(" I want " + balance + " points.");
            }
            if (balance === 0) ret.push(" For 0 points.");
            return ret;
        };
        $scope.sendMessage = function () {
            DealFactory.sendMessage($scope.deal, $scope.message);
        }


    })
    .controller('DealDetailsController', function ($scope, DealFactory, $routeParams, Status) {
        $scope.dealId = $routeParams.id;
        $scope.deal = DealFactory.deals[$scope.dealId];
        $scope.dealFactory = DealFactory;
        console.log("DetailsController");
        $scope.getMyDealState = function () {
            return DealFactory.getMyDealState($scope.deal);
        };
        //die optionen für jeden schritt...
        $scope.messageOptions = [
            [
                {type: "request", value: 0},
                {type: "cancel"}
            ],
            [{
                type: "cancel"
            }],
            [
                {type: "confirm"},
                {type: "deny"}
            ]
        ];
        $scope.lastMessageOptions = [
            {type: "confirm"},
            {type: "deny"}
        ];
        $scope.getMessageOptions = function () {
            var myState = $scope.getMyDealState();
            if ($scope.deal.messages.length > $scope.deal.maxMessages - 1 && myState === 2) return $scope.lastMessageOptions;
            return $scope.messageOptions[myState];
        };
    })
    .controller('ChooseDealSubjectController', function ($scope) {
        $scope.subjects = [
            {value: "insurance", text: "Insurance"}
//            {value: "alliance", text: "Alliance"}
        ];
    })
    .controller('ChooseDealPlayerController', function ($scope, Status, $routeParams) {
        $scope.subject = $routeParams.subject || null;
        $scope.players = Status.getAvailablePlayers();
        $scope.status = Status;
    })
    .controller('NewDealController', function ($scope, DealFactory, $routeParams, $location) {
        $scope.subject = $routeParams.subject || null;
        $scope.player1Id = $routeParams.playerId || null;
        $scope.confirm = function () {
            var newId = DealFactory.addDeal($scope.subject, $scope.player1Id);
            $location.path("/deals/" + newId);
        };
    })
;

