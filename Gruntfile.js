module.exports = function(grunt){
    //load all dep grunt-plugins
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        concat: {
            js: {
                src: 'app/src/**',
                dest: 'public/javascripts/app.js',
                filter: function(path){
                    return /.js$/.test(path);
                }
            },
            css: {
                src: 'app/src/**',
                dest: 'public/stylesheets/style.css',
                filter: function(path){
                    return /.css$/.test(path);
                }
            }
        },
        copy: {
            html: {
                expand: true,
//                flatten: true,
                cwd: "app/src/",
                src: "**",
                dest: "public/templates/",
                filter: function(path){
                    return /.html$/.test(path);
                }
            }
        },
        express: {
            dev: {
                options: {
                    script: "app.js"
                }
            }
        }
    });

    grunt.registerTask('build', ['copy', 'concat']);
    grunt.registerTask('server', ['build', 'express:dev']);
}
