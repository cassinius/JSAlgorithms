module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: 'build/JSAlgorithms.js',
                dest: 'build/JSAlgorithms.min.js'
            }
        },
        watch: {
            typescript: {
                files: ['**/*.ts'],
                tasks: ['compileTS']
            },
            tests: {
                files: ['**/*.js'],
                tasks: ['mocha']
            }
        },
        shell: {
            mocha: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'mocha'
            },
            compileTS: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'tsc **/*.ts'
            },
            copyMin: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'cp build/JSAlgorithms.min.js /var/www/html/imgextract/js/'
            }
        },
        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: ['src/Helper.js', 'src/Matrix.js', 'src/Images.js',                                'src/Graphs.js', 'src/Region.js',
                      'test/browsertest.js'],
                dest: 'build/JSAlgorithms.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    // grunt.registerTask('default', ['uglify']);
    grunt.registerTask('mocha', 'shell:mocha');
    grunt.registerTask('compileTS', 'shell:compileTS');
    grunt.registerTask('build', ['concat', 'uglify', 'shell:copyMin']);

};