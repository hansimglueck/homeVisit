var execute = function() {
    this.log("looking for deck for option " + this.param);
    if (typeof this.inlineDecks === "undefined") return;
    var deck = this.inlineDecks[this.param];
    if (typeof deck == "undefined") {
        this.log("no matching option found", true);
        this.step();
    }
    else {
        this.log("inserting deck for option " + this.param, true);
        var oldNext = this.next;
        this.next = null;
        for (var i = 0; i < deck.items.length; i++) {
            this.appendItem(new SequenceItem(null, deck.items[i], this.index + ":" + this.param + ":" + i, true));
        }
        this.appendItem(oldNext);
        this.step();
    }
};

module.exports = execute;
