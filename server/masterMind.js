(function() {
    'use strict';

    // Master control server mode

    require('../homevisit_components/stringFormat');
    var exec = require('child_process').exec,
        Q = require('q'),
        CMD = 'netstat -ltn',
        re = /0\.0\.0\.0:(110\d{2})/;

    function MasterMind() {}

    MasterMind.prototype = {

        getNodes: function() {
            var deferred = Q.defer();
            exec(CMD, function(error, stdout, stderr) {
                if (error !== null) {
                    deferred.reject(error);
                }
                else {
                    deferred.resolve(stdout);
                }
            });
            return deferred.promise.then(function(output) {
                var lines = output.split(/\n/g), nodes = [];
                for (var i = 0; i < lines.length; i++) {
                    var m = lines[i].match(re);
                    if (m !== null) {
                        var port = parseInt(m[1]), index = port - 11000;
                        nodes.push({
                            index: index,
                            name: 'homevisitpi%d'.format(index),
                            port: port
                        });
                    }
                }
                return nodes;
            });
        }

    };

    var masterMind = new MasterMind();

    module.exports = masterMind;

})();
