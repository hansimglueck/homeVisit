module.exports = function (io, game) {
    io.sockets.on('connection', function (socket) {
        console.log('client connected!');
        // der Client ist verbunden
        socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });
        // wenn ein Benutzer einen Text senden
        socket.on('chat', function (data) {
            // so wird dieser Text an alle anderen Benutzer gesendet
            console.log("chat ", data);
            io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
        });

        socket.on('stepUp', function(data, fn) {
            console.log('step up');
            var next = game.step();
            console.log(next.msg);
            fn(true);
            io.sockets.emit('message', next);
        })

        socket.on('play', function(data, fn) {
            console.log('play');
            var next = game.start();
            console.log(next.msg);
            fn(true);
            io.sockets.emit('message', next);
        })

        socket.on('stop', function(data, fn) {
            var next = game.stop();
            fn(true);
            io.sockets.emit('message', next);
        })
    });
}