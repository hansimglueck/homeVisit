var adminControllers = angular.module('adminControllers', [])

adminControllers.controller('HomeController', function($scope) {
    $scope.name = "homE";
});

adminControllers.controller('setCtrl', function ($scope, setFactory, $location, $anchorScroll, $timeout) {
    //$scope.decks = Game.query(function () {
    //    angular.forEach($scope.decks, function (deck, id) {
    //        deck.newItem = {type: "card"};
    //    })
    //});

    $scope.activeDeck = {};
    $scope.activeDeck.id = 0;
    $scope.decks = setFactory.decks;
    $scope.newDeck = {};

    $scope.error = "Null Problemo!";
    $scope.name = "set";
    $scope.$on('decksLoaded', function () {
        console.log("decks changed. new length:" + $scope.decks.length);
        $scope.activateDeck($scope.decks[2]._id);
    });
    $scope.activateDeck = function (deckId) {
        //now scroll to it.
        $scope.activeDeck.id = deckId;
        $scope.name += "x";
        console.log("activate " + $scope.activeDeck.id + "in scope " + $scope.name);
        console.log($scope.name);
        console.log($scope.$parent.name);
        //console.log($scope.$parent.$digest());
        var old = $location.hash();
        //$location.hash('deck'+deckId);
        //$location.hash('set');
        //$anchorScroll();
    };
    $scope.setNewDeck = function (deck) {
        $scope.newDeck = deck;
    };
    $scope.addDeck = function () {
        console.log($scope.newDeck);
        if (!$scope.newDeck || $scope.newDeck.title.length < 1) {
            console.log("retrun");
            return;
        }
        if ($scope.newDeck.import) {
            $scope.newDeck.items = $scope.textToItems($scope.newDeck.import);
        }
        setFactory.addDeck($scope.newDeck, function (ret) {
            console.log("cb: " + ret);
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
    $scope.duplicateDeck = function (deckId) {
        var newName = prompt("Neuer Name?");
        var dupDeck = angular.copy($scope.decks[deckId]);
        delete dupDeck._id;
        dupDeck.title = newName;
        setFactory.addDeck(dupDeck, function (ret) {
            console.log("cb: " + ret);
            $scope.decks.push(ret);
        });
    };
    $scope.deleteDeck = function (index) {
        if (!confirm("Wirklich Löschen???")) return;
        setFactory.deleteDeck(index);
    };
    $scope.renameDeck = function (deckId) {
        var newName = prompt("Neuer Name?");
    };

    $scope.textToItems = function (text) {
        var textArray = text.split("\n\n");
        var itemArray = [];
        console.log(textArray.length + " cards");
        angular.forEach(textArray, function (text) {
            itemArray.push({type: "card", text: text, trigger: 'go', wait: 0});
        });
        return itemArray;
    };

    $scope.getTimeForDeck = function (deckId) {
        var time = 0;
        angular.forEach($scope.decks[deckId].items, function (item, id) {
            time += parseInt(item.time) || 0;
        });
        return time;
    };

    $scope.updateDeck = function (deckId) {
        var updatedDeck = angular.copy($scope.decks[deckId]);
        return setFactory.updateDeck(deckId, updatedDeck);
    };
    $scope.updateDeckOld = function (deckId) {
        var updatedDeck = angular.copy($scope.decks[deckId]);
        delete updatedDeck._id;   //sonst macht mongoDB auf dem raspi stunk
        console.log(updatedDeck);
        return Game.update({id: $scope.decks[deckId]._id}, updatedDeck, function (err) {
            if (err) {
                $scope.error = err;
            }
        });
    }
});

adminControllers.controller('deckCtrl', function ($scope, itemTypes, $filter, $modal) {
    $scope.name = "deck";
    $scope.types = itemTypes;
    $scope.trigger = [{text: "Go", value: "go"}, {text: "Follow", value: "follow"}];
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

    $scope.moveItem = function (deckId, itemId) {
        var xDeckId = -1;
        if ($scope.decks[deckId]) xDeckId = $scope.decks[deckId]._id;
        if ($scope.decks[deckId]) itemId = $scope.decks[deckId].items[itemId]._id;
        var modalInstance = $modal.open({
            templateUrl: 'app/views/admin/move-item.html',
            controller: 'MoveItemController',
            size: 'sm',
            resolve: {
                deckId: function () {
                    return xDeckId;
                },
                itemId: function () {
                    return itemId;
                },
                decks: function () {
                    return $scope.decks;
                }
            }
        });

        modalInstance.result.then(function (result) {
            console.log("Move " + deckId + "/" + itemId + " to " + result.newDeckId + "/" + result.newItemId);
            $scope.activeDeck.id = result.newDeckId;
            $scope.activateDeck(result.newDeckId);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

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
    $scope.saveItem = function () {
        console.log("save item for deck " + $scope.$index);
        return $scope.updateDeck($scope.$index);
    };

    $scope.deleteItem = function (deckId, index) {
        $scope.decks[deckId].items.splice(index, 1);
        var item = $scope.decks[deckId].items[index];
        $scope.updateDeck(deckId);
    };
})
    .controller('MoveItemController', function ($scope, $modalInstance, deckId, itemId, decks) {
        $scope.name = "moveI";
        $scope.deckId = deckId;
        $scope.itemId = itemId;
        $scope.decks = decks;
        $scope.result = {
            newDeckId: deckId,
            newItemId: itemId
        };
        $scope.deckChoice = $scope.getDeckById($scope.result.newDeckId);
        $scope.getDeckById = function(id) {
            console.log("trying to find deck with "+id);
            var deckArr = $scope.decks.filter(function(deck){
                return (deck._id == id);
            });
            return (deckArr.length > 0) ? deckArr[0] : null;
        };
        $scope.ok = function () {
            $modalInstance.close($scope.result);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
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

    $scope.saveVoteOption = function () {
        console.log($scope.$parent.$index);
        return $scope.updateDeck($scope.$parent.$parent.$index);
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
    .controller('ImportJsonController', function ($scope) {
        $scope.processedJson = [];
        $scope.process = function () {
            $scope.processedJson = JSON.parse($scope.json);
            $scope.processedJson.forEach(function (item) {
                item.newTitle = item.title;
            });
        };
        $scope.import = function (itemId) {
            var importDeck = $scope.processedJson[itemId];
            importDeck.title = importDeck.newTitle;
            delete importDeck.newTitle;
            delete importDeck._id;
            $scope.setNewDeck(importDeck);
            $scope.addDeck();
        }

    });
