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
    .factory('Polls', function() {
        var pollFactory = {};
        pollFactory.selectedPoll = 0;
        pollFactory.polls = [
            {
                // 0
                question: "Wer an diesem Tisch war einmal Klassensprecher?",
                note: "Klassensprecher",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [1,1,-1,1,1,1,1,1,-1,1,1,1,1,1,-1]
            },
            {
                // 1
                question: "Wer an diesem Tisch hat schon mal viel gewonnen? ",
                note: "viel gewonnen",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [1,1,1,1,1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1]
            },
            {
                // 2
                question: "Wer war oder ist Parteimitglied?",
                note: "Parteimitglied",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,-1]
            },
            {
                // 3
                question: "Wer engagiert sich in einem Verein oder in einer NGO?",
                note: "Verein/NGO",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [1,1,-1,-1,1,-1,1,1,-1,-1,-1,1,1,1,-1]
            },
            {
                // 4
                question: "Wer am Tisch hat eine Arbeit, von der er oder sie leben kann?",
                note: "bezahlte Arbeit",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1]
            },
            {
                // 5
                question: "Wer arbeitet regelmäßig außerhalb des Landes?",
                note: "arbeitet im Ausland",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [-1,-1,-1,-1,1,-1,1,-1,-1,-1,-1,1,-1,-1,-1]
            },
            {
                // 6
                question: "Wer hat in den vergangenen 10 Jahren einen Konflikt schon mal körperlich ausgetragen?",
                note: "körperlicher Konflikt",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [-1,-1,0,0,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1]
            },
            {
                // 7
                question: "Wer hat schon mal bewusst seine nationale Herkunft verleugnet?",
                note: "Herkunft verleugnet",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [1,1,-1,-1,1,1,1,-1,1,-1,1,-1,-1,-1,-1]
            },
            {
                // 8
                question: "Wer fühlt sich mehr als Europäer denn als Bürger seines Landes?",
                note: "gefühlter Europäer",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,-1,-1,1,-1]
            },
            {
                // 9
                question: "Wer hat Angst vor der Zukunft?",
                note: "Angst vor Zukunft",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [-1,1,-1,1,-1,1,1,1,-1,-1,-1,1,-1,1,-1]
            },
            {
                // 10
                question: "Wer findet die Menschen hier grundsätzlich vertrauenswürdig?",
                note: "vertrauenswürdig",
                type: 'binary',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [-1,1,-1,-1,-1,1,-1,1,1,-1,-1,-1,1,1,-1]
            },
            {
                // 11
                question: "Meine Solidaritätsbereitschaft",
                note: "Solidaritätsbereitschaft",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [-1,3,3,-1,3,-1,-1,-1,3,-1,-1,-1,3,-1,-1]
            },
            {
                // 12
                question: "Mein Ehrgeiz",
                note: "Ehrgeiz",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [4,5,0,5,4,3,3,2,4,5,3,4,5,4,-1]
            },
            {
                // 13
                question: "Mein Vertrauen in die Demokratie",
                note: "Vertrauen in Demokratie",
                type: 'fingers',
                answers: [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
                //answers: [1,2,1,3,2,2,3,2,3,2,4,2,4,2,-1]
            },
            {
                // 14
                question: "Mein Gewinn aus dem Spiel der Märkte",
                note: "Gewinn aus Spiel der Märkte",
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
        var playerNamesFactory = {};
        playerNamesFactory.names = [
            gettextCatalog.getString('player') + ' 1',
            gettextCatalog.getString('player') + ' 2',
            gettextCatalog.getString('player') + ' 3',
            gettextCatalog.getString('player') + ' 4',
            gettextCatalog.getString('player') + ' 5',
            gettextCatalog.getString('player') + ' 6',
            gettextCatalog.getString('player') + ' 7',
            gettextCatalog.getString('player') + ' 8',
            gettextCatalog.getString('player') + ' 9',
            gettextCatalog.getString('player') + ' 10',
            gettextCatalog.getString('player') + ' 11',
            gettextCatalog.getString('player') + ' 12',
            gettextCatalog.getString('player') + ' 13',
            gettextCatalog.getString('player') + ' 14',
            gettextCatalog.getString('player') + ' 15'
        ];
        
        //playerNamesFactory.names = [
        //    'Soren',
        //    'Anna 1',
        //    'Max',
        //    'Wilke',
        //    'Fara',
        //    'Mona',
        //    'Amelie',
        //    'Annika',
        //    'Julia',
        //    'Anna 2',
        //    'Lukas',
        //    'Philine',
        //    'Imanuel',
        //    'Jasmin',
        //    'X'
        //];
        
        return playerNamesFactory;
    })
    .factory('Deck', function(Socket, setFactory){
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
        return deckFactory;
    })
    .factory('Playback', function(Socket, gettextCatalog) {

        var playbackFactory = {
            playback: function(cmd, param) {
                console.log("play clicked");
                if (cmd == "restart") {
                    if (!confirm(gettextCatalog.getString('Really restart?'))) {
                        return;
                    }
                }
                Socket.emit("playbackAction", {cmd:cmd, param:param});
            },
            alert: function() {
                console.log("Alarm clicked");
                Socket.emit("alert");
            }
        };
        return playbackFactory;
    })
;
