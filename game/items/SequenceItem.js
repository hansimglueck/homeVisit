SequenceItem = function(item, id) {
    for (var attr in item) {
        if (item.hasOwnProperty(attr)) this[attr] = item[attr];
    }
    this.next = null;
    this.done = false;
    this.id = -1;
    if (typeof id != "undefined") this.id = id;
};

SequenceItem.prototype = {
    setId: function(id) {
        this.id = id;
    },
    appendItem: function(item) {
        if (this.next == null) this.next = item;
        else this.next.appendItem(item);
    },
    setNext: function(nextItem) {
        this.next = nextItem;
    },
    getNext: function() {
        return this.next;
    },
    execute: function() {
        console.log("executing step "+this.id);
        this.done = true;
    },
    step: function() {
        if (this.done) this.execute();
        else if (this.next != null) this.next.step();
    }
};

module.exports = SequenceItem;
