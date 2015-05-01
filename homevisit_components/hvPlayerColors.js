angular.module('hvPlayerColors', [])
    .value('playerColors', [
        '#9e0000',     //rot
        '#2883c3',     //hellblau
        '#0c3669',     //dunkelblau
        '#ff5a00',     //orange
        '#ffc000',     //gelb
        '#2ab200',     //gruen
        '#b27de4',     //lila
        '#ce2460'      //pink
    ])
    .value('playerTextColors', [
        '#FFFFFF',     //rot
        '#000000',     //hellblau
        '#FFFFFF',     //dunkelblau
        '#000000',     //orange
        '#000000',     //gelb
        '#000000',     //gruen
        '#000000',     //lila
        '#000000'      //pink
    ])

    .factory('playerColornamesFactory', ['gettext', function(gettext) {

        var colornames = [
                gettext('red'),
                gettext('light blue'),
                gettext('dark blue'),
                gettext('orange'),
                gettext('yellow'),
                gettext('green'),
                gettext('lilac'),
                gettext('pink')
            ]

        var playerColornamesFactory = {};

        playerColornamesFactory.playercolornames = colornames;

        return playerColornamesFactory;
    }]);