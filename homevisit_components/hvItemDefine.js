(function() {
    'use strict';

    angular.module('hvItemDefine', [])
        .value('itemDefine', {
            standard: {
                fields: {
                    text: {
                        name: 'Text',
                        type: 'string',
                        edit: 'textarea'
                    },
                    mapping: {
                        name: 'Mapping',
                        type: 'array',
                    default: ['default'],
                        edit: 'tags'
                    },
                    trigger: {
                        name: 'Trigger',
                        type: 'string',
                        options: {
                            go: {
                                name: 'Go'
                            },
                            follow: {
                                name: 'Follow'
                            }
                        },
                    default: 'go',
                        edit: 'select'
                    },
                    comment: {
                        name: 'Kommentar',
                        type: 'string',
                        edit: 'select'
                    },
                    mcnote: {
                        name: 'MC Note',
                        type: 'string',
                        edit: 'select'
                    }
                }
            },
            card: {
                name: 'Karte'
            },
            sound: {
                name: 'Sound'
            },
            slideshow: {
                name: 'Slideshow'
            },
            vote: {
                name: 'Abstimmung',
                options: {
                    voteOptions: {
                        name: 'Antworten',
                        type: 'array',
                        subtype: {
                            //TODO
                        }
                    }
                }
            },
            'type': [
                {value: 'card', text: 'Karte', mappable: true},
                {value: 'sound', text: 'Sound', mappable: true},
                {value: 'vote', text: 'Abstimmung', mappable: true},
                {value: 'results', text: 'Results', mappable: true},
                {value: 'deal', text: 'Deal', mappable: true},
                {value: 'switch', text: 'Switch', mappable: false},
                {value: 'inlineSwitch', text: 'Inline Switch', mappable: false},
                {value: 'cmd', text: 'Kommando', mappable: true},
                {value: 'config', text: 'Konfiguartion', mappable: false},
                {value: 'rating', text: 'Bewertung', mappable: true},
                {value: 'eval', text: 'eval', mappable: false},
                {value: 'dummy', text: 'Dummy', mappable: false},
                {value: 'agreement', text: 'Agreement', mappable: true},
                {value: 'roulette', text: 'Roulette', mappable: true},
                {value: 'slideshow', text: 'Slideshow', mappable: true}
            ],
            'color': [
                {value: '0', text: 'Rot'},
                {value: '1', text: 'Grün'},
                {value: '2', text: 'Blau'}
            ],
            'voteType': [
                {value: 'customOptions', text: 'eine der Optionen hier'},
                {value: 'customMultipleOptions', text: 'mehrere der Optionen hier'},
                {value: 'playerChoice', text: 'Spielerwahl'},
                {value: 'countryChoice', text: 'Länderwahl'},
                {value: 'enterNumber', text: 'Zahleingabe'}
            ],
            'ratingType': [
                {value: 'allTeams', text: 'alle Teams'},
                {value: 'oneTeam', text: 'einzelnes Team'}
            ],
            'posNeg': [
                {value: '+1', text: '+1'},
                {value: '-1', text: '-1'}
            ],
            'bestWorst': [
                {value: 'best', text: 'bestes'},
                {value: 'worst', text: 'schlechtestes'},
                {value: 'selected', text: 'selektiertes'}
            ],
            'resultType': [
                {value: 'Pie', text: 'Tortendiagramm'},
                {value: 'Bar', text: 'Balkendiagramm'},
                {value: 'Line', text: 'Kurve'},
                {value: 'seatOrder', text: 'Sitzordnung'},
                {value: 'europeMap', text: 'Europakarte'},
                {value: 'numberStats', text: 'Numerische Auswertung'}
            ],
            'language': [
                {value: 'de', text: 'Deutsch'},
                {value: 'en', text: 'Englisch'}
            ],
            'scoreType': [
                {value: 'noScore', text: 'Kein Score'},
                {value: 'optionScore', text: 'Nach Antwort'},
                {value: 'majorityScore', text: 'Nach Mehrheit'}
            ],
            'sourceType': [
                {value: 'previousStep', text: 'Vorhergehender Step'},
                {value: 'positivePlayerScore', text: 'Scores grösser Null'}
            ],
            'trigger': [{text: "Go", value: "go"}, {text: "Follow", value: "follow"}],
            'configField': [
                {value: 'alertRecipients', text: 'alertRecipients'}
            ],
            'dealType': [
                {value: "insurance", text: "Versicherung"}
            ],
            'agreementType': [
                {value: 'alliance', text: 'Allianz'}

            ],
            'agreementOption': [
                {value: "topTwo", text: "besten zwei"},
                //            {value: "closest", text: "Rangnachbarn"}
            ]
        });

})();
