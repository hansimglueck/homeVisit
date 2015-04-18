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
                answers: new Array(14)
            },
            {
                question: "Wer an diesem Tisch war einmal Klassensprecher?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer war oder ist Parteimitglied? ",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Und wer engagiert sich in einem Verein?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer am Tisch hat eine Arbeit, von der er oder sie leben kann?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer hat einen Konflikt schon mal körperlich ausgetragen?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer hat eine Nationalflagge bei sich zu Hause?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer hat eine Europaflagge bei sich zu Hause?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer hat im Ausland schon mal bewusst seine nationale Herkunft verleugnet?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer fühlt sich mehr als Europäer denn als Bürger seines Landes?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer findet die Runde hier grundsätzlich vertrauenswürdig?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Wer hat Angst vor der Zukunft?",
                type: 'binary',
                answers: new Array(14)
            },
            {
                question: "Meine Solidaritätsbereitschaft",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Mein diplomatisches Geschick",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Meine Verschwiegenheit",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Meine Durchsetzungskraft",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Mein Vertrauen in die Demokratie",
                type: 'fingers',
                answers: new Array(14)
            },
            {
                question: "Mein Vertrauen in das Spiel der Märkte",
                type: 'fingers',
                answers: new Array(14)
            }
        ];
        return pollFactory;
    })
    .factory('Deck', function(Socket, setFactory){
        var playbackStatus = {stepId: -1, type:"nix", deckId: null};
        var deck = null;
        var deckFactory = {};
        Socket.on("playBackStatus", function(status) {
            playbackStatus = status;
            console.log("got playbackStatus info: "+JSON.stringify(status));
            deckFactory.deck = setFactory.getDeckById(playbackStatus.deckId);
            deckFactory.stepId = playbackStatus.stepId;
        });
        return deckFactory;
    })
;
