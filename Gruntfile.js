module.exports = function(grunt){
    //load all dep grunt-plugins
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        concat: {
            js: {
                src: 'app/src/**/*.js',
                dest: 'public/javascripts/app.js'
            },
            css: {
                src: 'app/src/**/*.css',
                dest: 'public/stylesheets/style.css'
            }
        },
        copy: {
            //build template
            html: {
                expand: true,
//                flatten: true,
                cwd: "app/src/",
                src: "**/*.html",
                dest: "public/templates/"
            },
            //build public folder
            public: {
                expand: true,
                cwd: "app/public/",
                src: "**",
                dest: "public/",
                filter: function(path){
                    //exclude angular-mocks
                    return path.indexOf('mock') <= -1;
                }
            }
        },
        express: {
            dev: {
                options: {
                    script: "app.js"
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
            js: {
                files: [ 'app/src/**/*.js' ],
                tasks: [ 'build' ]
            }
        }
    });

    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('build', ['copy', 'concat']);
    grunt.registerTask('server', ['build', 'express:dev']);
}
