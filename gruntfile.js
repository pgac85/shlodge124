module.exports = function(grunt) {

    //Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Concurrent
        concurrent: {
            dev: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },

        // Nodemon
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    env: {
                        "NODE_ENV": "development",
                        "NODE_CONFIG": "dev"
                    },
                    watch: [
                        'application/controllers/*.js',
                        'repos/*.js', 'app.js', 'mongodb.js', 'index.js'
                    ],
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // refresh on server reboot
                        nodemon.on('restart', function () {
                            // delay before server listens on port
                            setTimeout(function () {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },

        // Watch
        watch: {
            dev: {
                files: [
                    'application/ui/**/*.jade',
                    'application/ui/stylesheets/*.styl',
                    'appplication/ui/javascripts/*.js',
                    '.rebooted'
                ],
                options: {
                    livereload: true
                }
            }
        }
    });

    //Load the Plugin(s)
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //Default Task(s)
    grunt.registerTask('dev', ['concurrent:dev']);

};