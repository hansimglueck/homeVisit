/* global confirm */

(function () {
    'use strict';

    angular.module('mcAppServices', [])
        .factory('Status', function ($rootScope, Socket, $location) {

            var emptyPlayer = {playerId: -1, colors: ["weiss", "weiss"]};
            var statusFactory = {};
            statusFactory.player = emptyPlayer;
            statusFactory.otherPlayers = [];
            statusFactory.joinedPlayers = [];
            statusFactory.maxPlayers = 0;
            statusFactory.ratingActive = true;
            statusFactory.joined = false;
            statusFactory.server = Socket.server;
            statusFactory.clientId = -1;
            statusFactory.rating = [];

            statusFactory.start = function () {
                Socket.on('registerConfirm', function (data) {
                    if (typeof data !== "undefined") {
                        statusFactory.clientId = data;
                    }
                });

                Socket.on('status', function (data) {
                    if (data.otherPlayers) {
                        statusFactory.otherPlayers = data.otherPlayers;
                        statusFactory.joinedPlayers = data.otherPlayers.filter(function (player) {
                            return player.joined
                        });
                    }
                    if (data.maxPlayers) {
                        statusFactory.maxPlayers = data.maxPlayers;
                    }
                });
                Socket.on('reload', function () {
                    window.location.reload();
                    console.log('X');
                });
            };
            statusFactory.reload = function () {
                window.location.reload();
                console.log('X');
            };
            statusFactory.connected = function () {
                return Socket.connected();
            };
            statusFactory.joinGame = function () {
                Socket.emit({type: "joinGame", data: {}});
            };
            statusFactory.leaveGame = function () {
                Socket.emit({type: "leaveGame", data: {}});
            };
            statusFactory.resetPlayer = function () {
                statusFactory.player = emptyPlayer;
                statusFactory.joined = false;
                $rootScope.$digest();
            };
            statusFactory.deselectAll = function () {
                Socket.emit("setPlayerStatus", {cmd: "deselectAll"});
            };
            statusFactory.toggleSelected = function (id) {
                console.log("select player " + id);
                Socket.emit("setPlayerStatus", {cmd: "toggleSelected", id: id});
            };

            statusFactory.getOtherPlayers = function () {
                return statusFactory.otherPlayers.filter(function (player) {
                    return player.joined && player.playerId !== statusFactory.player.playerId;
                });
            };

            return statusFactory;

        })
        .factory('Polls', function (gettext) {
            var pollFactory = {};
            pollFactory.selectedPoll = 0;
            pollFactory.polls = [
                {
                    // 0
                    rid: 13,
                    question: gettext('Who at this table has been class spokesman?'),
                    note: gettext('class spokesman'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [1,1,-1,1,1,1,1,1,-1,1,1,1,1,1,-1]
                },
                {
                    // 1
                    rid: 14,
                    question: gettext('Who at this table has ever won a lot?'),
                    note: gettext('won a lot'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [1,1,1,1,1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1]
                },
                {
                    // 2
                    rid: 15,
                    question: gettext('Who was or is a member of a political party?'),
                    note: gettext('member of political party'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,-1]
                },
                {
                    // 3
                    rid: 17,
                    question: gettext('Who is involved in a association or in an NGO?'),
                    note: gettext('association/NGO'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [1,1,-1,-1,1,-1,1,1,-1,-1,-1,1,1,1,-1]
                },
                {
                    // 4
                    rid: 18,
                    question: gettext('Who at the table has a job of which he or she can live?'),
                    note: gettext('paid job'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1]
                },
                {
                    // 5
                    rid: 19,
                    question: gettext('Who works regularly outside the country?'),
                    note: gettext('working outside the country'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [-1,-1,-1,-1,1,-1,1,-1,-1,-1,-1,1,-1,-1,-1]
                },
                {
                    // 6
                    rid: 20,
                    question: gettext('Who had a physical conflict in the past 10 years?'),
                    note: gettext('physical conflict'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [-1,-1,0,0,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1]
                },
                {
                    // 7
                    rid: 21,
                    question: gettext('Who has ever consciously denied his national origin?'),
                    note: gettext('denied origin'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [1,1,-1,-1,1,1,1,-1,1,-1,1,-1,-1,-1,-1]
                },
                {
                    // 8
                    rid: 22,
                    question: gettext('Who feels more as an European than a citizens of his country?'),
                    note: gettext('feeling European'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1,-1,1,-1]
                },
                {
                    // 9
                    rid: 23,
                    question: gettext('Who is scared of the future?'),
                    note: gettext('scared of the future'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [-1,1,-1,1,-1,1,1,1,-1,-1,-1,1,-1,1,-1]
                },
                {
                    // 10
                    rid: 27,
                    question: gettext('Who finds the people here in general trustworthy?'),
                    note: gettext('trustworthy'),
                    type: 'binary',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [-1,1,-1,-1,-1,1,-1,1,1,-1,-1,-1,1,1,-1]
                },
                {
                    // 11
                    rid: 29,
                    question: gettext('My willingness of solidarity'),
                    note: gettext('willingness of solidarity'),
                    type: 'fingers',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [-1,3,3,-1,3,-1,-1,-1,3,-1,-1,-1,3,-1,-1]
                },
                {
                    // 12
                    rid: 30,
                    question: gettext('My ambition'),
                    note: gettext('ambition'),
                    type: 'fingers',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [4,5,0,5,4,3,3,2,4,5,3,4,5,4,-1]
                },
                {
                    // 13
                    rid: 31,
                    question: gettext('My confidence in democracy'),
                    note: gettext('confidence in democracy'),
                    type: 'fingers',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [1,2,1,3,2,2,3,2,3,2,4,2,4,2,-1]
                },
                {
                    // 14
                    rid: 32,
                    question: gettext('My earnings from the game of the markets'),
                    note: gettext('earnings'),
                    type: 'fingers',
                    answers: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
                    //answers: [0,0,1,1,1,0,2,0,2,5,5,0,2,2,-1]
                }
            ];
            return pollFactory;
        })
        .factory('Teams', function () {
            var teamFactory = {};
            teamFactory.categories = [
                {
                    category: "Überflieger",
                    questionNr: [12, 0, 1, 5],
                    weight: [1, 1, 1, 1],
                    players: []
                },
                {
                    category: "Politiker",
                    questionNr: [2, 0, 13],
                    weight: [1, 1, 1, 1],
                    players: []
                },
                {
                    category: "Anpacker",
                    questionNr: [6, 3, 12, 4],
                    weight: [1, 1, 1, 1],
                    players: []
                },
                {
                    category: "Angsthasen",
                    questionNr: [9, 10, 6, 12],
                    weight: [1, 1, -1, -1],
                    players: []
                },
                {
                    category: "Nationale",
                    questionNr: [13, 7, 8, 9],
                    weight: [1, -1, -1, 1],
                    players: []
                },
                {
                    category: "Arbeitslos",
                    questionNr: [4, 1, 14, 3],
                    weight: [-1, -1, -1, 1],
                    players: []
                },
                {
                    category: "Nette",
                    questionNr: [11, 6, 13, 8],
                    weight: [1, -1, 1, 1],
                    players: []
                },
                {
                    category: "Vereinsnasen",
                    questionNr: [3, 13, 10],
                    weight: [1, 1, 1, 1],
                    players: []
                },
                {
                    category: "Europäer",
                    questionNr: [8, 5, 13],
                    weight: [1, 1, 1],
                    players: []
                }
            ];
            return teamFactory;
        })
        .factory('TeamCriteria', function () {
            var teamcriteriaFactory = {};
            teamcriteriaFactory.criteria = [
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
            ];
            return teamcriteriaFactory;
        })
        .factory('Matches', function () {
            var matchFactory = {};
            matchFactory.matches = [
                [0, 0],
                [1, 1],
                [2, 2],
                [3, 3],
                [4, 4],
                [5, 5],
                [6, 6],
                [7, 7],
                [8, 8],
                [9, 9],
                [10, 10],
                [11, 11],
                [12, 12],
                [13, 13],
                [14, 14]
            ];
            return matchFactory;
        })
        .factory('PlayerNames', function (gettextCatalog) {
            var playerNamesFactory = {
                customPlayerNames: [],
                getNames: function () {
                    var pn = [];
                    for (var i = 0; i < 15; i++) {
                        pn.push(
                            gettextCatalog.getString(
                                'Player {{ playerNumber }}',
                                {playerNumber: i}
                            )
                        );
                    }
                    return pn;
                }
            };

            playerNamesFactory.getNames().forEach(function () {
                playerNamesFactory.customPlayerNames.push(undefined);
            });

            // When there are less than 15 players, deactivate them to ignore them in matching calc
            // 1 if player is in game, 0 if player is absent
            playerNamesFactory.inGame = [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ]

            playerNamesFactory.getPlayerCount = function () {
                var sum = 0;
                for (var i = 0; i < playerNamesFactory.inGame.length; i++) {
                    sum += playerNamesFactory.inGame[i];
                }
                return sum;
            };

            return playerNamesFactory;
        })
        .factory('Deck', function (Socket, setFactory, $interval, ModalService, Status, gettextCatalog, Polls, PlayerNames, ScriptScroll) {
            var playbackStatus = {stepIndex: -1, type: "nix", deckId: null};
            // var deck = null;
            var deckFactory = {
                deck: {items: []},
                stepIndex: 0,
                stepCount: 0,
                current: null,
                previous: null,
                next: null,
                mcTasks: {
                    go: true,
                    alert: true,
                    select: false
                },
                mcNote: "",
                goList: null
            };
            deckFactory.nextJump = null;

            deckFactory.get = function (index) {
                return deckFactory.deck.items[index];
            };

            var pollDataSent = false;

            deckFactory.start = function () {
                Socket.on("playBackStatus", function (status) {
                    var lang = gettextCatalog.currentLanguage;
                    playbackStatus = status;

                    var deck = setFactory.getDeckById(playbackStatus.deckId);

                    if (!deck) {
                        console.log('No deck set!');
                        return;
                    }

                    deckFactory.deck = deck;
                    deckFactory.index = playbackStatus.stepIndex;
                    var stepIndex = parseInt(playbackStatus.stepIndex);
                    var inlineIndex = playbackStatus.stepIndex.toString().split(":");

                    deckFactory.stepIndex = stepIndex;
                    deckFactory.stepCount = deck.items.length;

                    deckFactory.current = deck.items[stepIndex];
                    deckFactory.currentDetailed = deck.items[stepIndex];

                    if (inlineIndex.length >= 3) {
                        deckFactory.currentDetailed = deckFactory.currentDetailed.inlineDecks[inlineIndex[1]].items[inlineIndex[2]];
                    }
                    if (inlineIndex.length >= 5) {
                        deckFactory.currentDetailed = deckFactory.currentDetailed.inlineDecks[inlineIndex[3]].items[inlineIndex[4]];
                    }
                    if (inlineIndex.length === 7) {
                        deckFactory.currentDetailed = deckFactory.currentDetailed.inlineDecks[inlineIndex[5]].items[inlineIndex[6]];
                    }

                    deckFactory.goList = playbackStatus.goList;
                    deckFactory.goList = deckFactory.goList.map(function (goBlock) {
                        var block = goBlock.map(function (blockItemIndex) {
                            var indexArray = blockItemIndex.toString().split(":");
                            var blockItem = {};
                            for (var i = 0; i < indexArray.length; i++) {
                                if (i === 0) {
                                    blockItem = deck.items[indexArray[i]];
                                } else if (i % 2 === 0) {
                                    blockItem = blockItem.inlineDecks[indexArray[i - 1]].items[indexArray[i]];
                                }
                            }
                            return blockItem;
                        });
                        block.indexBlock = goBlock;
                        return block;
                    });


                    deckFactory.previous = deck.items[stepIndex - 1];
                    deckFactory.next = deck.items[stepIndex + 1];
                    deckFactory.nextJump = status.nextJump;

                    deckFactory.clockSeconds = playbackStatus.clockSeconds;
                    deckFactory.mcTasks.go = deckFactory.currentDetailed.mcGo;
                    deckFactory.mcTasks.alert = deckFactory.currentDetailed.mcAlert;
                    deckFactory.mcTasks.select = deckFactory.currentDetailed.mcSelect;
                    deckFactory.mcTasks.jump = deckFactory.currentDetailed.mcJump;
                    if (deckFactory.mcTasks.select) {
                        Status.deselectAll();
                    }
                    //TODO: ist das die richtige art und weise, rauszufinden, ob es mc-notes (in der aktuellen sprache) gibt?
                    var popUp = false;
                    if (deckFactory.currentDetailed.mcnote) {
                        if (deckFactory.currentDetailed.mcnote[lang]) {
                            if (deckFactory.currentDetailed.mcnote[lang].trim().length > 0) {
                                deckFactory.mcNote = deckFactory.currentDetailed.mcnote[lang];
                                popUp = true;
                            }
                        }
                    }
                    if (deckFactory.mcTasks.select) {
                        popUp = true;
                    }
                    if (popUp) mcPopUp();

                    // send poll data to mc when printer phase is over
                    // 81: last printed card
                    if (!pollDataSent && deckFactory.stepIndex === 81) {
                        pollDataSent = true;
                        var defaultNames = PlayerNames.getNames();
                        var customNames = PlayerNames.customPlayerNames;
                        var playerNames = [];
                        defaultNames.forEach(function (name, i) {
                            playerNames.push(customNames[i] || name);
                        });
                        var data = {
                            playerNames: playerNames,
                            answers: Polls.polls
                        };
                        Socket.emit('pollResults', data);
                    }
                    ScriptScroll.scrollToAct();
                });
            };

            function mcPopUp() {
                ModalService.showModal({
                    templateUrl: "views/notes.html",
                    controller: "NotesController"
                }).then(function (modal) {
                    // The modal object has the element built, if this is a bootstrap modal
                    // you can call 'modal' to show it, if it's a custom modal just show or hide
                    // it as you need to.
                    modal.element.modal({
                        backdrop: 'static'
                    });
                });

            }

            $interval(function () {
                if (deckFactory.stepIndex > 0) {
                    deckFactory.clockSeconds += 1;
                }
            }, 1000);

            return deckFactory;
        })
        .factory('Display', function(Socket, ModalService, gettextCatalog, playerColors, playerColornamesFactory) {
            var displayFactory = {
                displayData: []
            };
            displayFactory.start = function () {
                Socket.on('display', function (data) {
                    if (data) {
                        displayFactory.displayData = data;
                        if (data.type) {
                            if (data.type == "results") {
                                showResults(data);
                            }
                            if (data.type == "vote") {
                                showVote(data);
                            }

                        }
                    }
                });
            };
            displayFactory.vote = function () {
                displayFactory.voteChoiceText = displayFactory.options.filter(function (opt) {
                    return opt.checked;
                }).map(function (opt) {
                    return opt.text;
                });
                displayFactory.voteChoice = displayFactory.options.filter(function (opt) {
                    return opt.checked;
                }).map(function (opt) {
                    return opt.value;
                });
                //displayFactory.confirmVote();
            };
            displayFactory.confirmVote = function () {
                displayFactory.done = true;
                if (typeof displayFactory.voteChoice === "undefined") {
                    displayFactory.voteChoice = [];
                }
                console.log(displayFactory.voteChoice);
                Socket.emit("vote", {
                    choice: displayFactory.voteChoice,
                    text: displayFactory.voteChoiceText,
                    pollId: displayFactory.pollId,
                    playerId: 666
                });
            };

            function showResults(data) {
                var resultType = data.resultType;
                var result = data.data;

                console.log(resultType);
                console.log(result);

                var labels = [];
                var resData = [];
                var labels2 = [];
                displayFactory.correctAnswer = "";
                displayFactory.ratedVote = result.ratedVote;
                //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
                if (resultType == "numberStats") {
                    //send stats as array: [sum, avg]
                    resData = [result.sum, result.average, result.minVal, result.maxVal];
                }
                else result.voteOptions.forEach(function (option) {
                    if (option.correctAnswer) displayFactory.correctAnswer = option.text;
                    if (data.data.dataSource == "positivePlayerScore") {
                        labels.push(option.playercolor + ': ' + option.percent + '% (' + option.result + ' ' + gettextCatalog.getPlural(option.result, 'point', 'points') + ')');
                    } else {
                        var t;
                        if (option.text.length > 20) {
                            t = option.text.substr(0, 20) + '...';
                        }
                        else {
                            t = option.text;
                        }
                        labels.push(t + ': ' + option.percent + '% (' + option.votes + ' ' + gettextCatalog.getPlural(option.votes, 'vote', 'votes') + ')');
                    }
                    if (resultType == "europeMap") resData.push({
                        id: option.value,
                        val: option.percent
                    });
                    else resData.push(option.result);
                });
                if (resultType === "firstVote") {
                    resData = result.votes[0].playerId;
                    console.log(resData);
                }

                displayFactory.resultType = resultType;

                console.log("TYPE: " + displayFactory.resultType);

                (displayFactory.resultType == 'Bar' || displayFactory.resultType == 'Line') ? displayFactory.data = [resData] : displayFactory.data = resData;
                displayFactory.labels = labels;
                displayFactory.votelast = "result";
                displayFactory.type = "result";
                if (data.resultColors) {
                    if (data.resultColors == "playerColors") {
                        displayFactory.resultColors = [];
                        result.voteOptions.forEach(function (option) {
                            displayFactory.resultColors.push(playerColors[option.value]);
                        });
                    }
                }
                showDisplayModal("views/results.html", "ResultsController");
            }

            function showVote(data) {
                displayFactory.text = data.text;
                displayFactory.type = "vote";
                displayFactory.voteType = data.voteType;
                displayFactory.options = data.voteOptions || [{value: 0}];
                if (displayFactory.voteType === "enterNumber" || displayFactory.voteType === "enterText") {
                    displayFactory.options[0].checked = true;
                }
                displayFactory.limit = displayFactory.voteType === "customOptions" ? 1 : data.voteMulti;
                displayFactory.checked = 0;
                displayFactory.pollId = data.pollId;
                displayFactory.ratedVote = data.ratedVote;
                showDisplayModal("views/vote.html", "VoteController");
            }

            function showDisplayModal(view, controller) {
                // Just provide a template url, a controller and call 'showModal'.
                ModalService.showModal({
                    templateUrl: view,
                    controller: controller
                }).then(function (modal) {
                    // The modal object has the element built, if this is a bootstrap modal
                    // you can call 'modal' to show it, if it's a custom modal just show or hide
                    // it as you need to.
                    modal.element.modal();
                });


            }

            return displayFactory;
        })
        .factory('TeamActionInfo', function (Socket, gettext, ModalService, gettextCatalog, playerColors, playerColornamesFactory) {
            var teamActionInfo = {};

            teamActionInfo.actionInfo = [
                '', '', '', '', '', '', '', ''
            ];

            teamActionInfo.start = function () {

                Socket.on("startvote", function (msg) {
                    console.log("STARTVOTE EMPFANGEN");
                    for (var i = 0; i < teamActionInfo.actionInfo.length; i++) {
                        teamActionInfo.actionInfo[i] = gettext("waiting ...");
                    }
                });

                Socket.on("vote", function (msg) {
                    console.log("VOTE EMPFANGEN");
                    //console.log(msg);
                    teamActionInfo.actionInfo[msg.playerId] = gettext("Voted for: ") + msg.text[0];
                });

                Socket.on("score", function (msg) {
                    console.log("SCORE EMPFANGEN");
                    //console.log(msg);
                    teamActionInfo.actionInfo[msg.otherPlayerId] = gettext("Score ") + msg.value + gettext(" to ") + playerColornamesFactory.playercolornames[msg.playerId];
                });

                Socket.on("insurance", function (msg) {
                    console.log("DEAL EMPFANGEN");
                    //console.log(msg);
                    teamActionInfo.actionInfo[msg.playerId] = gettext("Deal with ") + playerColornamesFactory.playercolornames[msg.value];
                });


                Socket.on("playBackStatus", function (msg) {
                    console.log("PLAYBACKstatus EMPFANGEN");
                    for (var i = 0; i < teamActionInfo.actionInfo.length; i++) {
                        teamActionInfo.actionInfo[i] = '';
                    }
                });

            };

            return teamActionInfo;
        })
        .factory('Playback', function (Socket, gettextCatalog, Deck) {
            var playbackFactory = {
                playback: function (cmd, param) {
                    if (cmd == "goto" && !confirm("You are leaving the predefined Sequence. You must have STRONG needs for this!")) {
                        return;
                    }
                    console.log("play clicked");
                    switch (cmd) {
                        case "restart":
                            if (!confirm(gettextCatalog.getString('Really restart?'))) {
                                return;
                            }
                            break;
                        case "jump":
                            if (!confirm(gettextCatalog.getString('Really jump?'))) {
                                return;
                            }
                            Deck.mcTasks.jump = false;
                            break;
                        case "go":
                            Deck.mcTasks.go = false;
                            break;
                    }
                    Socket.emit("playbackAction", {
                        cmd: cmd,
                        param: param
                    });
                },
                alert: function () {
                    console.log("Alarm clicked");
                    Socket.emit("alert");
                }
            };
            return playbackFactory;
        })
        .factory('Clock', function (Deck) {

            var clockFactory = {

                getClock: function () {
                    var secs = Deck.clockSeconds, minutes, hours;

                    // test values here:
                    // secs = 0; // 0:10h
                    // secs = 59; // 0:00h
                    // secs = 60; // 0:01h
                    // secs = 10 * 60; // 0:10h
                    // secs = 60 * 60; // 1:00h
                    // secs = 61 * 60; // 1:01h
                    // secs = 119 * 60; // 1:59h
                    // secs = 120 * 60; // 2:00h
                    // secs = 121 * 60; // 2:01h

                    if (typeof secs !== 'number') {
                        minutes = 0;
                        hours = 0;
                        secs = 0;
                    }
                    else {
                        minutes = Math.floor(secs / 60 % 60);
                        hours = Math.floor((secs / 60 - minutes) / 60);
                    }

                    return String(hours) + ':' +
                        (String(minutes).length < 2 ? '0' : '') +
                        String(minutes) + ':' +
                        (String(secs % 60).length < 2 ? '0' : '') +
                        String(secs % 60);
                }

            };

            return clockFactory;
        })
        .factory('Recordings', function ($resource) {
            return $resource('/recordings/', null, {
                'get': {method: 'GET', isArray: true}
            });
        })

        .factory('ScriptScroll', function ($location, $anchorScroll) {
            var scriptScroll = {};
            scriptScroll.scrollToAct = function () {
                var newHash = "script-list-active";
                if ($location.hash() !== newHash) {
                    // set the $location.hash to `newHash` and
                    // $anchorScroll will automatically scroll to it
                    $location.hash(newHash);
                } else {
                    // call $anchorScroll() explicitly,
                    // since $location.hash hasn't changed
                    $anchorScroll();
                }
            };
            return scriptScroll;

        });

})();
