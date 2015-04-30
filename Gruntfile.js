module.exports = function(grunt) {

    // loads task automatically from package.json
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', 'dev');
    grunt.registerTask('dev', [
        'express:dev',
        'watch:express'
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
                    'game/*.js',
                    'game/**/*.js',
                    'server/*.js',
                    'server/**/*.js',
                    'homevisit_components/*.js',
                    'homevisit_components/**/*.js',
                    'homevisitConf.js',
                    'homevisitConf.local.js'
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
                        'mc/**/*.js',
                        'game/**/*.js'
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
