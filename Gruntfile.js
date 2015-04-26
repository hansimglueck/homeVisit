module.exports = function(grunt) {

    // loads task automatically from package.json
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', 'dev');
    grunt.registerTask('dev', [
        'nggettext_compile',
        'express',
        'watch'
    ]);

    grunt.initConfig({

        express: {
            dev: {
                options: {
                    script: 'server/server.js'
                }
            }
        },

        watch: {
            options: {
                livereload: false
            },
            express: {
                files:  [
                    '**/*.js',
                    '**/*.html'
                ],
                tasks:  [ 'express:dev' ],
                options: {
                    spawn: false
                }
            }
        },

        nggettext_extract: {
            pot: {
                files: {
                    'po/common/template.pot': [
                        'homevisit_components/**/*.html',
                        'homevisit_components/**/*.js'
                    ],
                    'po/admin/template.pot': [
                        'admin/**/*.html',
                        'admin/**/*.js'
                    ],
                    'po/player/template.pot': [
                        'player/**/*.html',
                        'player/**/*.js'
                    ],
                    'po/mc/template.pot': [
                        'mc/**/*.html',
                        'mc/**/*.js'
                    ]
                }
            },
        },

        nggettext_compile: {
            all: {
                files: {
                    'admin/js/translations.js':             ['po/common/*.po', 'po/admin/*.po'],
                    'player/js/translations.js':            ['po/common/*.po', 'po/player/*.po'],
                    'mc/js/translations.js':                ['po/common/*.po', 'po/mc/*.po']
                }
            },
        }

    });
};
