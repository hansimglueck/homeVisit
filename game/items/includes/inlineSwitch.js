(function() {
    'use strict';

    var SequenceItem = require('../SequenceItem');

    module.exports = {
        executeItem: function () {
            var option = this.param;
            if (this.inlineSwitchSource === 'previousStep') {
                var data = this.previous.getData();
                if (data !== null) {
                    option = data.complete ? data.voteOptions[0].value : -1;
                }
            }
            this.log("looking for deck for option " + option);
            if (typeof this.inlineDecks === "undefined") {
                return;
            }
            var deck = this.inlineDecks[option];
            if (typeof deck === "undefined") {
                this.log("no matching option found", true);
                this.step();
            }
            else {
                this.log("inserting deck for option " + option, true);
                var oldNext = this.next;
                this.next = null;
                for (var i = 0; i < deck.items.length; i++) {
                    this.appendItem(new SequenceItem(null, deck.items[i], this.index + ":" + option + ":" + i, true));
                }
                this.appendItem(oldNext);
                this.step();
            }
        }
    };

})();
