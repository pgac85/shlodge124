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
        // Clean
        clean: {
            beforeBuild:
                [   'application/ui/<%= pkg.name %>.min.js',
                    'application/ui/<%= pkg.name %>.min.css' ],
            intermediate:
                [   'application/ui/shlodge.js' ],
            dev: ['reports/']
        },

        // CSS min
        cssmin:{
            combine:{
                files: {
                    'application/ui/<%= pkg.name %>.min.css' :
                        [	'application/ui/stylesheets/lodge_template.css',
                            'application/ui/stylesheets/style.css']
                }
            }
        },

        // Concat
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['application/ui/javascripts/shl.js'],
                dest: 'application/ui/<%= pkg.name %>.js'
            }
        },

        // Uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'application/ui/<%= pkg.name %>.min.js': ['application/ui/<%= pkg.name %>.js']
                }
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
                    'application/ui/*.jade',
                    'application/ui/stylesheets/*.styl',
                    'application/ui/javascripts/*.js',
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
    grunt.registerTask('prod', ['clean:beforeBuild', 'cssmin', 'concat', 'uglify', 'clean:intermediate']);
    grunt.registerTask('dev', ['concurrent:dev']);

};