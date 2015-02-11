var adminControllers = angular.module('adminControllers', [])

adminControllers.controller('setCtrl', function ($scope, setFactory) {
        //$scope.decks = Game.query(function () {
        //    angular.forEach($scope.decks, function (deck, id) {
        //        deck.newItem = {type: "card"};
        //    })
        //});

        $scope.decks = setFactory.decks;

        $scope.newDeck = {};

        $scope.error = "Null Problemo!";
        $scope.currentDeck = 0;
        $scope.addDeck = function () {
            if (!$scope.newDeck || $scope.newDeck.title.length < 1) {
                console.log("retrun");
                return;
            }
            if ($scope.newDeck.import) {
                $scope.newDeck.items = $scope.textToItems($scope.newDeck.import);
            }
            setFactory.addDeck($scope.newDeck, function (ret) {
                console.log("cb: "+ret);
                $scope.decks.push(ret);
                $scope.newDeck = {}; // clear textbox
            });
            return;
            var deck = new Game($scope.newDeck);

            deck.$save(function (ret) {
                console.log(ret);
                $scope.decks.push(deck);
                $scope.newDeck = {}; // clear textbox
            });

        };

        $scope.deleteDeck = function (index) {
            if (!confirm("Wirklich Löschen???")) return;
            setFactory.deleteDeck(index);
        };

        $scope.textToItems = function (text) {
            var textArray = text.split("\n\n");
            var itemArray = [];
            console.log(textArray.length+" cards");
            angular.forEach(textArray, function (text){
                itemArray.push({type:"card", text:text, trigger:'go', wait:0});
            });
            return itemArray;
        };

        $scope.getTimeForDeck = function (deckId) {
            var time = 0;
            angular.forEach($scope.decks[deckId].items, function (item, id) {
                time += parseInt(item.time) || 0;
            })
            return time;
        };

        $scope.updateDeck = function (deckId) {
            var updatedDeck = angular.copy($scope.decks[deckId]);
            setFactory.updateDeck(deckId, updatedDeck);
        };
        $scope.updateDeckOld = function (deckId) {
            var updatedDeck = angular.copy($scope.decks[deckId]);
            delete updatedDeck._id;   //sonst macht mongoDB auf dem raspi stunk
            console.log(updatedDeck);
            Game.update({id: $scope.decks[deckId]._id}, updatedDeck, function (err) {
                if (err) {
                    $scope.error = err;
                }
            });
        }
    });

adminControllers.controller('deckCtrl', function ($scope, itemTypes, $filter) {
        $scope.types = itemTypes;
        $scope.trigger = [{text:"Go", value:"go"},{text:"Follow", value:"follow"}];
        $scope.showType = function (item) {
            var selected = [];
            if (item.type) {
                selected = $filter('filter')($scope.types, {value: item.type}, true);
            }
            return selected.length ? selected[0].text : 'Not set';
        };
        $scope.showTrigger = function (item) {
            var selected = [];
            if (item.trigger) {
                selected = $filter('filter')($scope.trigger, {value: item.trigger}, true);
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.showFollowUp = function (option) {
            var selected = [];
            if (option.followUp) {
                selected = $filter('filter')($scope.decks, {_id: option.followUp}, true);
            }
            return selected.length ? selected[0].title : 'Not set';
        };
        $scope.sortOptions = {
            containment: "parent",//Dont let the user drag outside the parent
            cursor: "move",//Change the cursor icon on drag
            tolerance: "pointer",//Read http://api.jqueryui.com/sortable/#option-tolerance
            stop: function (event, ui) {
                var x = ui.item.context.parentElement.id.split("-");
                var deckId = x[2];
                $scope.updateDeck(deckId);
            }
        };

        $scope.addItem = function (deckId) {
            $scope.inserted = {
                wait: 0,
                trigger: 'go',
                type: 'card',
                text: '',
                time: '',
                voteMulti: 1
            };
            $scope.decks[deckId].items.push($scope.inserted);
            //angular.forEach($scope.decks[deckId].items, function(item,id) {
            //    console.log(id+" "+item._id);
            //})
        };
        $scope.saveItem = function (deckId) {
            $scope.updateDeck(deckId);
        };

        $scope.deleteItem = function (deckId, index) {
            $scope.decks[deckId].items.splice(index, 1);
            var item = $scope.decks[deckId].items[index];
            $scope.updateDeck(deckId);
        };
    });

adminControllers.controller('itemCtrl', function ($scope) {
        $scope.addVoteOption = function (deckId, id) {
            $scope.insertedOption = {
                text: '',
                followUp: ''
            };
            if (!$scope.decks[deckId].items[id].voteOptions) $scope.decks[deckId].items[id].voteOptions = [];
            $scope.decks[deckId].items[id].voteOptions.push($scope.insertedOption);
        };

        $scope.saveVoteOption = function (deckId, id) {
            $scope.updateDeck(deckId);
        };

        $scope.deleteVoteOption = function (deckId, id, i) {
            $scope.decks[deckId].items[id].voteOptions.splice(i, 1);
            $scope.updateDeck(deckId);
        };

        $scope.newVoteOption = function (deckId, id) {
            console.log($scope.decks[deckId].items[id].voteOptions);
            if (!$scope.decks[deckId].items[id].voteOptions) $scope.decks[deckId].items[id].voteOptions = [];
            $scope.decks[deckId].items[id].voteOptions.push($scope.decks[deckId].items[id].newVoteOpt);
            console.log($scope.decks[deckId].items[id].voteOptions);
        };
    })
