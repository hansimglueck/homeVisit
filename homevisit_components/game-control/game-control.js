(function () {
    'use strict';

    angular.module('hvGameControl', [])
        .directive('gameControl', function () {
            return {
                restrict: 'AE',
                replace: 'true',
                templateUrl: '/homevisit_components/game-control/views/game-control.html',
                controller: function ($scope, Socket, gettextCatalog, GameControlFactory, ModalService) {
                    $scope.socket = Socket;
                    $scope.gameControl = GameControlFactory;

                    $scope.start = function () {
                        showGameSettingsModal();
                    };
                    $scope.restart = function () {
                        showGameRestartModal();
                    };
                    $scope.stop = function () {
                        showGameStopModal();
                    };

                    function showGameStopModal() {
                        // Just provide a template url, a controller and call 'showModal'.
                        ModalService.showModal({
                            templateUrl: "/homevisit_components/game-control/views/game-stop-modal.html",
                            controller: function ($scope, close, $element, GameControlFactory) {
                                $scope.stop = function () {
                                    GameControlFactory.playback('stop');
                                    $scope.closeModal();
                                };
                                $scope.closeModal = function () {
                                    $element.modal('hide');
                                    //  Now close as normal, but give 500ms for bootstrap to animate
                                    close(500);
                                };
                            },
                            inputs: {}
                        }).then(function (modal) {
                            // The modal object has the element built, if this is a bootstrap modal
                            // you can call 'modal' to show it, if it's a custom modal just show or hide
                            // it as you need to.
                            modal.element.modal();
                            modal.close.then(function (result) {
                            });
                        });


                    }
                    function showGameRestartModal() {
                        // Just provide a template url, a controller and call 'showModal'.
                        ModalService.showModal({
                            templateUrl: "/homevisit_components/game-control/views/game-restart-modal.html",
                            controller: function ($scope, close, $element, GameControlFactory) {
                                $scope.restart = function () {
                                    GameControlFactory.playback('restart');
                                    $scope.closeModal();
                                };
                                $scope.closeModal = function () {
                                    $element.modal('hide');
                                    //  Now close as normal, but give 500ms for bootstrap to animate
                                    close(500);
                                };
                            },
                            inputs: {}
                        }).then(function (modal) {
                            // The modal object has the element built, if this is a bootstrap modal
                            // you can call 'modal' to show it, if it's a custom modal just show or hide
                            // it as you need to.
                            modal.element.modal();
                            modal.close.then(function (result) {
                            });
                        });


                    }

                    function showGameSettingsModal() {
                        // Just provide a template url, a controller and call 'showModal'.
                        ModalService.showModal({
                            templateUrl: "/homevisit_components/game-control/views/game-settings-modal.html",
                            controller: function ($scope, close, $element, GameControlFactory) {
                                $scope.start = function () {
                                    GameControlFactory.playback("start");
                                    $scope.closeModal();
                                };
                                $scope.closeModal = function () {
                                    $element.modal('hide');
                                    //  Now close as normal, but give 500ms for bootstrap to animate
                                    close({}, 500);
                                };
                            },
                            inputs: {}
                        }).then(function (modal) {
                            // The modal object has the element built, if this is a bootstrap modal
                            // you can call 'modal' to show it, if it's a custom modal just show or hide
                            // it as you need to.
                            modal.element.modal();
                            modal.close.then(function (result) {
                            });
                        });


                    }

                }
            };
        })
        .directive('gameSessionChooser', function () {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/homevisit_components/game-control/views/game-session-chooser.html',
                controller: function ($scope, gameSessionsFactory) {
                    $scope.sessions = gameSessionsFactory;
                    $scope.setSession = function () {
                        gameSessionsFactory.setSession();
                    };
                },
                scope: {
                }
            };
        })
        .directive('gameSessionDisplay', function () {
            return {
                restrict: 'E',
                replace: 'true',
                templateUrl: '/homevisit_components/game-control/views/game-session-display.html',
                controller: function ($scope, gameSessionsFactory) {
                    $scope.sessions = gameSessionsFactory;
                },
                scope: {
                }
            };
        })
        .factory('GameControlFactory', function (Socket) {
            var gameFactory = {
                stepIndex: -1,
                intIndex: -1,
                type: ""
            };
            gameFactory.start = function () {
                Socket.on("playBackStatus", function (status) {
                    gameFactory.stepIndex = status.stepIndex;
                    gameFactory.intIndex = parseInt(status.stepIndex);
                    gameFactory.type = status.type;
                });
            };
            gameFactory.playback = function (cmd) {
                Socket.emit("playbackAction", {
                    cmd: cmd
                });
            };
            return gameFactory;
        })
        .factory('gameSessionsFactory', function (Socket, $rootScope) {

            var gameSessionsFactory = {
                sessions: [],
                currentSession: null,
                sessionSet: false
            };

            gameSessionsFactory.getSessionName = function (id) {
                for (var i = 0; i < gameSessionsFactory.sessions.length; i++) {
                    var s = gameSessionsFactory.sessions[i];
                    if (s.sessionId === id) {
                        if (typeof s.uhrzeit == "undefined") {
                            s.uhrzeit = "";
                        }
                        var name = id + ': '+s.date + ' ' + s.uhrzeit + ' ' + s.city;
                        if (typeof s.schule !== 'undefined' && s.schule.trim().length > 0) {
                            name += ' - ' + s.schule;
                        }
                        if (typeof s.adresse !== 'undefined' && s.adresse.trim().length > 0) {
                            name += ' - ' + s.adresse;
                        }
                        return name;
                    }
                }
            };

            gameSessionsFactory.start = function () {
                Socket.on('gameSessions', function (data) {
                    gameSessionsFactory.sessions = data.sessions;
                    if (typeof data.currentSession !== 'undefined' && data.currentSession !== null) {
                        gameSessionsFactory.currentSession = data.currentSession;
                    }
                });
            };

            gameSessionsFactory.setSession = function () {
                Socket.emit('setGameSession', gameSessionsFactory.currentSession);
                $rootScope.$broadcast('sessionChange');
                gameSessionsFactory.sessionSet = true;
            };
            return gameSessionsFactory;
        })
    ;

})();
