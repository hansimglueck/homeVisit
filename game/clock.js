(function() {
    'use strict';

    function GameClock() {
        this.startTime = null;
    }

    GameClock.prototype = {

        reset: function() {
            console.log('gameClock reset');
            this.startTime = null;
        },

        start: function() {
            console.log('gameClock started');
            this.startTime = new Date().getTime();
        },

        getCurrentSeconds: function() {
            if (this.startTime === null) {
                return 0;
            }
            return Math.floor((new Date().getTime() - this.startTime) / 1000);
        }

    };

    var gameClock = new GameClock();

    module.exports = gameClock;

})();
