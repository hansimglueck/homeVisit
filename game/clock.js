(function() {
    'use strict';
    var logger = require('log4js').getLogger("clock");

    function GameClock() {
        this.startTime = null;
    }

    GameClock.prototype = {

        reset: function() {
            logger.info('gameClock reset');
            this.startTime = null;
        },

        start: function() {
            logger.info('gameClock started');
            this.startTime = new Date().getTime();
        },

        getCurrentSeconds: function() {
            logger.debug("startTime "+this.startTime);
            if (this.startTime === null) {
                return 0;
            }
            return Math.floor((new Date().getTime() - this.startTime) / 1000);
        }

    };

    var gameClock = new GameClock();

    module.exports = gameClock;

})();
