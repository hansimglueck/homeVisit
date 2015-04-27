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
                    'po/template.pot': [
                        'homevisit_components/**/*.html',
                        'homevisit_components/**/*.js',
                        'admin/**/*.html',
                        'admin/**/*.js',
                        'player/**/*.html',
                        'player/**/*.js',
                        'mc/**/*.html',
                        'mc/**/*.js'
                    ]
                }
            }
        },

        nggettext_compile: {
            all: {
                files: {
                    'homevisit_components/translations.js': ['po/*.po']
                }
            }
        }

    });
};
