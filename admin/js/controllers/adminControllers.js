var adminControllers = angular.module('adminControllers', [])

adminControllers.controller('HomeController', function ($scope) {
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
    $scope.newDeck = {items:[]};

    $scope.error = "Null Problemo!";
    $scope.name = "set";
    $scope.$on('decksLoaded', function () {
        console.log("decks changed. new length:" + $scope.decks.length);
        $scope.activateDeck($scope.decks[0]._id);
    });
    $scope.getDeckById = function (id) {
        console.log("trying to find deck with " + id);
        var deckArr = $scope.decks.filter(function (deck) {
            return (deck._id == id);
        });
        return (deckArr.length > 0) ? deckArr[0] : null;
    };
    $scope.getItemById = function (did, id) {
        console.log("trying to find item with " + id);
        var deckArr = $scope.decks.filter(function (deck) {
            return (deck._id == did);
        });
        var deck = (deckArr.length > 0) ? deckArr[0] : null;
        var item = null;
        var itemArr = [];
        if (deck != null) itemArr = deck.items.filter(function (i) {
            return (i._id == id);
        });
        return (itemArr.length > 0) ? itemArr[0] : null;
    };
    $scope.getDeckId = function (deckId) {
        var ret = -1;
        for (var i = 0; i < $scope.decks.length; i++) {
            if ($scope.decks[i]._id == deckId) ret = i;
        }
        return ret;
    };
    $scope.getItemId = function (deckId, id) {
        console.log("getItem-id for" + deckId + "," + id);
        var deck = $scope.getDeckById(deckId);
        console.log(deck);
        var ret = -1;
        for (var i = 0; i < deck.items.length; i++) {
            if (deck.items[i]._id == id) ret = i;
        }
        return ret;
    };
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
            console.log("ret=");
            console.log(ret);
            $scope.decks.push(ret);
            $scope.newDeck = {items:[]}; // clear textbox
        });
    };
    $scope.duplicateDeck = function (deckId) {
        var newName = prompt("Neuer Name?");
        var dupDeck = angular.copy($scope.decks[deckId]);
        delete dupDeck._id;
        dupDeck.items.forEach(function (item) {
            delete item._id;
            item.voteOptions.forEach(function (opt) {
                delete opt._id;
            })
        });
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
    $scope.updateDeck = function (deck) {
        var updatedDeck = angular.copy(deck);
        return setFactory.updateDeck(updatedDeck);
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
    };
    $scope.exportCSV = function (id) {
        var csv = "";
        $scope.decks[id].items.forEach(function (item) {
            var type = "";
            var text = "";
            var comment = item.comments[1] || "";
            switch (item.type) {
                case "card":
                    type = "Karte";
                    text = item.text;
                    break;
                case "vote":
                    type = "Abstimmung";
                    text = item.text;
                    break;
                case "sound":
                    type = "Sound";
                    text = item.text;
                    break;
                case "eval":
                    type = "Sonstige";
                    text = "Besondere Berechnung...";
                    break;
                default:
                    type = "skip";
                    break;
            }
            if (type == "skip") return;
            csv += [type, '"' + text + '"', '"' + comment + '"'].join(",");
            csv += ",";
            csv += item.voteOptions.map(function (opt) {
                return opt.text
            }).join("::");
            csv += "\n";
        });
        console.log(csv);
    }
});

adminControllers.controller('deckCtrl', function ($scope, $modal, $filter) {
    $scope.name = "deck";

    $scope.showFollowUp = function (option) {
        //console.log("showFollowUp");
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
            $scope.updateDeck($scope.deck);
        }
    };
    $scope.moveItem = function (deckId, itemId) {
        if ($scope.decks[deckId]) itemId = $scope.decks[deckId].items[itemId]._id;
        if ($scope.decks[deckId]) deckId = $scope.decks[deckId]._id;
        var modalInstance = $modal.open({
            templateUrl: '/admin/views/admin/move-item.html',
            controller: 'MoveItemController',
            size: 'sm',
            resolve: {
                deckId: function () {
                    return deckId;
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
            var newItem = angular.copy($scope.getItemById(deckId, itemId));
            delete newItem._id;
            newItem.voteOptions.forEach(function (opt) {
                delete opt._id;
            });
            var destDeck = $scope.getDeckById(result.newDeckId);
            var insertId = $scope.getItemId(result.newDeckId, result.newItemId);
            console.log(destDeck);
            destDeck.items.splice(insertId + 1, 0, newItem);
            $scope.updateDeck(destDeck);
            console.log(result.copy);
            if (!result.copy) {
                console.log("delete:" + $scope.getDeckId(deckId) + "," + $scope.getItemId(deckId, itemId));
                $scope.deleteItem($scope.getDeckId(deckId), $scope.getItemId(deckId, itemId));
            }
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

    };
    $scope.addItem = function (itemId) {
        $scope.inserted = {
            wait: 0,
            trigger: 'go',
            type: 'card',
            text: '',
            time: '',
            device: "default"
        };
        if (typeof itemId == "undefined") $scope.deck.items.push($scope.inserted);
        else $scope.deck.items.splice(itemId + 1, 0, $scope.inserted);
    };
    $scope.saveItem = function () {
        if ($scope.deck.inline) {
            $scope.$parent.saveItem();
            return;
        }
        console.log("save item for deck " + $scope.$index);
        return $scope.updateDeck($scope.deck);
    };
    $scope.deleteItem = function (deckId, index) {
        if (!confirm("Wirklich Löschen???")) return;

        $scope.deck.items.splice(index, 1);
        var item = $scope.deck.items[index];
        $scope.updateDeck($scope.deck);
    };
    $scope.updateDeck = function(deck) {
        if ($scope.deck.inline) {
            $scope.$parent.saveItem();
        }
        else {
            $scope.$parent.updateDeck(deck);
        }
    };
    $scope.toggleMarker = function (deckId, index) {
        var item = $scope.deck.items[index];
        if (typeof item.highlight == "undefined") item.highlight = false;
        item.highlight ^= true;
        $scope.saveItem();
    };
    $scope.getTimeForDeck = function () {
        var time = 0;
        angular.forEach($scope.deck.items, function (item, id) {
            time += parseInt(item.time) || 0;
        });
        return time;
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
        $scope.$watch('result.newDeckId', function (oldVal, newVal) {
            $scope.deckChoice = $scope.getDeckById($scope.result.newDeckId);
        });
        $scope.getDeckById = function (id) {
            console.log("trying to find deck with " + id);
            var deckArr = $scope.decks.filter(function (deck) {
                return (deck._id == id);
            });
            return (deckArr.length > 0) ? deckArr[0] : null;
        };
        $scope.move = function () {
            $scope.result.copy = false;
            $modalInstance.close($scope.result);
        };
        $scope.copy = function () {
            $scope.result.copy = true;
            $modalInstance.close($scope.result);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });


adminControllers.controller('itemCtrl', function ($scope, $filter, itemOptions) {
    $scope.itemOptions = itemOptions;
    $scope.showTextForValue = function (item, option) {
        var selected = [];
        if (item[option]) {
            selected = $filter('filter')($scope.itemOptions[option], {value: item[option]}, true);
        }
        return selected.length ? selected[0].text : 'Not set';
    };
    $scope.isMappable = function(option) {
        var selected = [];
        if ($scope.item.type) {
            selected = $filter('filter')($scope.itemOptions.type, {value: $scope.item.type}, true);
        }
        return selected.length ? selected[0].mappable : false;
    };
    $scope.prepareItem = function (type, itemId) {
        console.log("Prepare for " + type);
        console.log($scope.deck);
        console.log(itemId);
        if (type == "playerDirect") {
            $scope.deck.items[itemId].voteOptions = [];
            for (var i = 0; i < 15; i++) {
                $scope.deck.items[itemId].voteOptions.push({text: '/info/denanot.html', value: 'browser'});
            }
        }
    };

    $scope.addVoteOption = function (id) {
        $scope.insertedOption = {
            text: '',
            value: '',
            flags: [false]
        };
        if (!$scope.deck.items[id].voteOptions) $scope.deck.items[id].voteOptions = [];
        $scope.deck.items[id].voteOptions.push($scope.insertedOption);
    };
    $scope.addInlineSwitchOption = function (id) {
        $scope.insertedInlineDeck = {title:'inline', description:'inline-strang', items:[], inline: true};
        if (!$scope.deck.items[id].inlineDecks) $scope.deck.items[id].inlineDecks = [];
        $scope.deck.items[id].inlineDecks.push($scope.insertedInlineDeck);
    };
    $scope.deleteInlineDeck = function(id) {
        $scope.item.inlineDecks.splice(id, 1);
        $scope.updateDeck($scope.deck);
    };
    $scope.saveVoteOption = function () {
        console.log($scope.$parent.$index);
        return $scope.updateDeck($scope.deck);
    };
    $scope.deleteVoteOption = function (deckId, id, i) {
        $scope.deck.items[id].voteOptions.splice(i, 1);
        $scope.updateDeck($scope.deck);
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

    })
    .controller('directItemCtrl', function ($scope, itemOptions, $filter, Socket) {
        $scope.item = {
            type: "card",
            text: ""
        };
        $scope.types = itemOptions.types;
        $scope.showTextForValue = function (item, option) {
            var selected = [];
            if (item[option]) {
                selected = $filter('filter')($scope.itemOptions[option], {value: item[option]}, true);
            }
            return selected.length ? selected[0].text : 'Not set';
        };
        $scope.executeItem = function() {
            Socket.emit({type:"directItem", data:$scope.item}, function() { console.log('directItem emitted'); });
        }

    });