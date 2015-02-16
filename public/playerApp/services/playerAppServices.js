angular.module('playerAppServices', [])
    .factory('colors', function () {
        return {
            rot: {'background-color': '#FF0000', 'color': '#555555'},
            gelb: {'background-color': '#FFFF00', 'color': '#555555'},
            blau: {'background-color': '#0000FF', 'color': '#BBBBBB'},
            weiss: {'background-color': '#FFFFFF', 'color': '#555555'},
            gruen: {'background-color': '#00FF00', 'color': '#555555'},
            pink: {'background-color': '#FF88FF', 'color': '#555555'},
            schwarz: {'background-color': '#000000', 'color': '#BBBBBB'}
        }
    })
    .factory('playerColors', function () {
        return [
            ["rot", "gelb"],
            ["rot", "blau"],
            ["rot", "weiss"],
            ["rot", "gruen"],
            ["rot", "pink"],
            ["gelb", "blau"],
            ["gelb", "weiss"],
            ["gelb", "gruen"],
            ["gelb", "pink"],
            ["blau", "weiss"],
            ["blau", "gruen"],
            ["blau", "pink"],
            ["weiss", "gruen"],
            ["weiss", "pink"],
            ["pink", "schwarz"]
        ];
    })
    .factory('itemTypes', function() {
        return {
            'card': 'Card',
            'vote': 'Vote',
            'rating': 'Rating',
            'result': 'Result'
        }
    });