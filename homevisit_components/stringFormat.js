var sprintf = require('sprintf-js').sprintf;

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(String(this));
        return sprintf.apply(undefined, args);
    };
}
