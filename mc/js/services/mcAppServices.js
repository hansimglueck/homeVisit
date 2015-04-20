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
                if (typeof data != "undefined") statusFactory.clientId = data;
            });

            Socket.on('status', function (data) {
                if (data.otherPlayers) {
                    statusFactory.otherPlayers = data.otherPlayers;
                }
                if (data.maxPlayers) statusFactory.maxPlayers = data.maxPlayers;
            });
            Socket.on('reload', function () {
                window.location.reload();
                console.log('X')
            });
        };
        statusFactory.reload = function () {
            window.location.reload();
            console.log('X')
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
            })
        };
        return statusFactory;

    })
    .factory('Polls', function () {
        var pollFactory = {};
        pollFactory.polls = [
            {
                question: "Wer am Tisch lebt auch in dieser Gegend?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer an diesem Tisch war einmal Klassensprecher?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer war oder ist Parteimitglied? ",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Und wer engagiert sich in einem Verein?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer am Tisch hat eine Arbeit, von der er oder sie leben kann?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer hat einen Konflikt schon mal körperlich ausgetragen?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer hat eine Nationalflagge bei sich zu Hause?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer hat eine Europaflagge bei sich zu Hause?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer hat im Ausland schon mal bewusst seine nationale Herkunft verleugnet?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer fühlt sich mehr als Europäer denn als Bürger seines Landes?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer findet die Runde hier grundsätzlich vertrauenswürdig?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Wer hat Angst vor der Zukunft?",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Meine Solidaritätsbereitschaft",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Mein diplomatisches Geschick",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Meine Verschwiegenheit",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Meine Durchsetzungskraft",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Mein Vertrauen in die Demokratie",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                question: "Mein Vertrauen in das Spiel der Märkte",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            }
        ];
        return pollFactory;
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
        ];
        return matchFactory;
    })
    .factory('PlayerNames', function () {
        var playerNamesFactory = {};
        playerNamesFactory.names = [
            'player 1',
            'player 2',
            'player 3',
            'player 4',
            'player 5',
            'player 6',
            'player 7',
            'player 8',
            'player 9',
            'player 10',
            'player 11',
            'player 12',
            'player 13',
            'player 14',
        ];
        return playerNamesFactory;
    })
    .factory('Deck', function(Socket, setFactory){
        var playbackStatus = {stepIndex: -1, type:"nix", deckId: null};
        // var deck = null;
        var deckFactory = {};

        deckFactory.start = function() {
            Socket.on("playBackStatus", function(status) {
                playbackStatus = status;
                console.log("got playbackStatus info: "+JSON.stringify(status));
                // deckFactory.deck = setFactory.getDeckById(playbackStatus.deckId);

                var deck = setFactory.getDeckById(playbackStatus.deckId);

                if (!deck) {
                    console.error('No deck set!');
                    return;
                }

                var stepIndex = parseInt(playbackStatus.stepIndex);
                deckFactory.stepIndex = stepIndex;
                console.log('StepId:', stepIndex);

                deckFactory.current = deck.items[stepIndex];

                deckFactory.previous = deck.items[stepIndex - 1];

                deckFactory.next = deck.items[stepIndex + 1];

                // deckFactory.stepIndexArray = (deckFactory.stepIndex + "").split(":");
                // console.log('deckFactory.stepIndexArray');
                // console.dir(deckFactory.stepIndexArray);
                // deckFactory.actItem = deckFactory.deck.items[deckFactory.stepIndexArray[0]];
                // if (deckFactory.stepIndexArray.length > 1) {
                //     console.log(deckFactory.actItem.inlineDecks);
                //     deckFactory.actItem = deckFactory.actItem.inlineDecks[deckFactory.stepIndexArray[1]].items[deckFactory.stepIndexArray[2]];
                // }
                // if (deckFactory.deck.items.length > deckFactory.stepIndexArray[0]+1) {
                //     deckFactory.nextItem = deckFactory.deck.items[deckFactory.stepIndexArray[0]+1];
                //     if (deckFactory.stepIndexArray.length > 1) {
                //         if (deckFactory.actItem.inlineDecks[deckFactory.stepIndexArray[1]].length > deckFactory.stepIndexArray[2]+1) {
                //         deckFactory.nextItem = deckFactory.nextItem.inlineDecks[deckFactory.stepIndexArray[1]].items[deckFactory.stepIndexArray[2]+1];
                //         }
                //     }
                // }
                
            
            });
        };
        return deckFactory;
    })
;
