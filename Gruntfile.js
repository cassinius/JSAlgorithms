module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: 'src/**/*.js',
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
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('mocha', 'shell:mocha');
    grunt.registerTask('compileTS', 'shell:compileTS');

};