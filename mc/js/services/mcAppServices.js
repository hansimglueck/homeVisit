/* global confirm */

(function() {
    'use strict';

    angular.module('mcAppServices', [])
        .factory('Status', function ($rootScope, Socket, $location) {

            var emptyPlayer = {playerId: -1, colors: ["weiss", "weiss"]};
            var statusFactory = {};
            statusFactory.player = emptyPlayer;
            statusFactory.otherPlayers = [];
            statusFactory.maxPlayers = 0;
            statusFactory.ratingActive = true;
            statusFactory.joined = false;
            statusFactory.server = Socket.server;
            statusFactory.clientId = -1;
            statusFactory.rating = [];

            statusFactory.start = function(){
                Socket.on('registerConfirm', function (data) {
                    if (typeof data !== "undefined") {
                        statusFactory.clientId = data;
                    }
                });

                Socket.on('status', function (data) {
                    if (data.otherPlayers) {
                        statusFactory.otherPlayers = data.otherPlayers;
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
            statusFactory.getOtherPlayers = function () {
                return statusFactory.otherPlayers.filter(function (player) {
                    return player.joined && player.playerId !== statusFactory.player.playerId;
                });
            };
            return statusFactory;

        })
        .factory('Polls', function(gettext) {
            var pollFactory = {};
            pollFactory.selectedPoll = 0;
            pollFactory.polls = [
                {
                    // 0
                    question: gettext('Who at this table has been class spokesman?'),
                    note: gettext('class spokesman'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [1,1,-1,1,1,1,1,1,-1,1,1,1,1,1,-1]
                },
                {
                    // 1
                    question: gettext('Who at this table has ever won a lot?'),
                    note: gettext('won a lot'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [1,1,1,1,1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1]
                },
                {
                    // 2
                    question: gettext('Who was or is a member of a political party?'),
                    note: gettext('member of political party'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,-1]
                },
                {
                    // 3
                    question: gettext('Who is involved in a association or in an NGO?'),
                    note: gettext('association/NGO'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [1,1,-1,-1,1,-1,1,1,-1,-1,-1,1,1,1,-1]
                },
                {
                    // 4
                    question: gettext('Who at the table has a job of which he or she can live?'),
                    note: gettext('paid job'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1]
                },
                {
                    // 5
                    question: gettext('Who works regularly outside the country?'),
                    note: gettext('working outside the country'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [-1,-1,-1,-1,1,-1,1,-1,-1,-1,-1,1,-1,-1,-1]
                },
                {
                    // 6
                    question: gettext('Who had a physical conflict in the past 10 years?'),
                    note: gettext('physical conflict'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [-1,-1,0,0,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1]
                },
                {
                    // 7
                    question: gettext('Who has ever consciously denied his national origin?'),
                    note: gettext('denied origin'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [1,1,-1,-1,1,1,1,-1,1,-1,1,-1,-1,-1,-1]
                },
                {
                    // 8
                    question: gettext('Who feels more as an European than a citizens of his country?'),
                    note: gettext('feeling European'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1,-1,1,-1]
                },
                {
                    // 9
                    question: gettext('Who is scared of the future?'),
                    note: gettext('scared of the future'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [-1,1,-1,1,-1,1,1,1,-1,-1,-1,1,-1,1,-1]
                },
                {
                    // 10
                    question: gettext('Who finds the people here in general trustworthy?'),
                    note: gettext('trustworthy'),
                    type: 'binary',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [-1,1,-1,-1,-1,1,-1,1,1,-1,-1,-1,1,1,-1]
                },
                {
                    // 11
                    question: gettext('My willingness of solidarity'),
                    note: gettext('willingness of solidarity'),
                    type: 'fingers',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [-1,3,3,-1,3,-1,-1,-1,3,-1,-1,-1,3,-1,-1]
                },
                {
                    // 12
                    question: gettext('My ambition'),
                    note: gettext('ambition'),
                    type: 'fingers',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [4,5,0,5,4,3,3,2,4,5,3,4,5,4,-1]
                },
                {
                    // 13
                    question: gettext('My confidence in democracy'),
                    note: gettext('confidence in democracy'),
                    type: 'fingers',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                    //answers: [1,2,1,3,2,2,3,2,3,2,4,2,4,2,-1]
                },
                {
                    // 14
                    question: gettext('My earnings from the game of the markets'),
                    note: gettext('earnings'),
                    type: 'fingers',
                    answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
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
                    -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
            ];
            return teamcriteriaFactory;
        })
        .factory('Matches', function () {
            var matchFactory = {};
            matchFactory.matches = [
                [0,0],
                [1,1],
                [2,2],
                [3,3],
                [4,4],
                [5,5],
                [6,6],
                [7,7],
                [8,8],
                [9,9],
                [10,10],
                [11,11],
                [12,12],
                [13,13],
                [14,14]
            ];
            return matchFactory;
        })
        .factory('PlayerNames', function (gettextCatalog) {
            var playerNamesFactory = {
                customPlayerNames: [],
                getNames: function() {
                    var pn = [];
                    for(var i = 0; i < 15; i++) {
                        pn.push(
                            gettextCatalog.getString(
                                'Player {{ playerNumber }}',
                                { playerNumber: i }
                            )
                        );
                    }
                    return pn;
                }
            };

            playerNamesFactory.getNames().forEach(function() {
                playerNamesFactory.customPlayerNames.push(undefined);
            });

            return playerNamesFactory;
        })
        .factory('Deck', function(Socket, setFactory, $interval){
            var playbackStatus = {stepIndex: -1, type:"nix", deckId: null};
            // var deck = null;
            var deckFactory = {
                deck: { items: [] },
                stepIndex: 0,
                stepCount: 0,
                current: null,
                previous: null,
                next: null
            };

            deckFactory.get = function(index) {
                return deckFactory.deck.items[index];
            };

            deckFactory.start = function() {
                Socket.on("playBackStatus", function(status) {
                    playbackStatus = status;
                    console.log("got playbackStatus info: "+JSON.stringify(status));

                    var deck = setFactory.getDeckById(playbackStatus.deckId);

                    if (!deck) {
                        console.log('No deck set!');
                        return;
                    }

                    deckFactory.deck = deck;
                    var stepIndex = parseInt(playbackStatus.stepIndex);
                    deckFactory.stepIndex = stepIndex;
                    deckFactory.stepCount = deck.items.length;

                    deckFactory.current = deck.items[stepIndex];
                    deckFactory.previous = deck.items[stepIndex - 1];
                    deckFactory.next = deck.items[stepIndex + 1];

                    deckFactory.clockSeconds = playbackStatus.clockSeconds;
                });
            };

            $interval(function() {
                if (deckFactory.stepIndex > 0) {
                    deckFactory.clockSeconds += 1;
                }
            }, 1000);

            return deckFactory;
        })

    .factory('TeamActionInfo', function(Socket, gettext, ModalService, gettextCatalog, playerColors) {
        var teamActionInfo = {};
        
        teamActionInfo.actionInfo = [
            '','','','','','','',''
        ];
        
        teamActionInfo.start = function () {
            Socket.on('display', function (data) {
                //teamActionInfo.labels = [];
                if (data) {
                    teamActionInfo.displayData = data;
                    if (data.type) {
                        if (data.type == "results") {
                            
                            showResults(data);
                        }
                        //$location.path('/home');

                    }
                }
            });
            
            Socket.on("startvote", function(msg) {
                console.log("STARTVOTE EMPFANGEN");
                for (var i = 0; i < teamActionInfo.actionInfo.length; i++) {
                    teamActionInfo.actionInfo[i] = gettext("waiting ...");
                }
            });
            
            Socket.on("vote", function(msg) {
                console.log("VOTE EMPFANGEN");
                //console.log(msg);
                teamActionInfo.actionInfo[msg.playerId] = gettext("Voted for: ") + msg.text[0];
            });
            
            Socket.on("card", function(msg) {
                console.log("CARD EMPFANGEN");
                for (var i = 0; i < teamActionInfo.actionInfo.length; i++) {
                    teamActionInfo.actionInfo[i] = '';
                }
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
            teamActionInfo.correctAnswer = "";
            teamActionInfo.ratedVote = result.ratedVote;
            //"::::" erzeugt zwei Zeilenumbrüche in der Darstellung in der playerApp
            if (resultType == "numberStats") {
                //send stats as array: [sum, avg]
                resData = [result.sum, result.average, result.minVal, result.maxVal];
            }
            else result.voteOptions.forEach(function (option) {
                if (option.correctAnswer) teamActionInfo.correctAnswer = option.text;
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
            
            teamActionInfo.resultType = resultType;
            
            console.log("TYPE: " + teamActionInfo.resultType);
            
            (teamActionInfo.resultType == 'Bar' || teamActionInfo.resultType == 'Line') ? teamActionInfo.data = [resData] : teamActionInfo.data = resData;
            teamActionInfo.labels = labels;
            teamActionInfo.votelast = "result";
            teamActionInfo.type = "result";
            if (data.resultColors) {
                if (data.resultColors == "playerColors") {
                    teamActionInfo.resultColors = [];
                    result.voteOptions.forEach(function (option) {
                        teamActionInfo.resultColors.push(playerColors[option.value]);
                    });
                }
            }
            
            // Just provide a template url, a controller and call 'showModal'.
            ModalService.showModal({
                templateUrl: "views/results.html",
                controller: "ResultsController"
            }).then(function (modal) {
                // The modal object has the element built, if this is a bootstrap modal
                // you can call 'modal' to show it, if it's a custom modal just show or hide
                // it as you need to.
                modal.element.modal();
            });

        };
        
        return teamActionInfo;
    })
    
    .factory('Playback', function(Socket, gettextCatalog) {
        var playbackFactory = {
            playback: function(cmd, param) {
                console.log("play clicked");
                if (cmd === "restart") {
                    if (!confirm(gettextCatalog.getString('Really restart?'))) {
                        return;
                    }
                }
                Socket.emit("playbackAction", {
                    cmd: cmd,
                    param: param
                });
            },
            alert: function() {
                console.log("Alarm clicked");
                Socket.emit("alert");
            }
        };
        return playbackFactory;
    })

    .factory('Clock', function(Deck) {

        var clockFactory = {

            getClock: function() {
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

    .factory('gameSessionsFactory', function(Socket) {

        Socket.on('gameSessions', function(sessions) {
            gameSessionsFactory.sessions = sessions;
        });

        var gameSessionsFactory = {
            sessions: [],
            currentSession: null,
            currentSessionName: null
        };

        gameSessionsFactory.getSessionName = function(id) {
            for (var i = 0; i < gameSessionsFactory.sessions.length; i++) {
                var s = gameSessionsFactory.sessions[i];
                if (s._id === id) {
                    return s.date + ' ' + s.time + ' ' + s.bezirk + ' ' + s.city;
                }
            }
        };

        return gameSessionsFactory;
    });

})();
