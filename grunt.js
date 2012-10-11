module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: [
                    'build/intro.js',
                    'src/util.js',
                    'src/calc.js',
                    'src/state.js',
                    'src/gestures.js',
                    'src/toe.js',
                    'src/gestures/*.js',
                    'build/outro.js'
                ],
                dest: 'dist/toe.built.js'
            }
        },
        lint: {
            files: ['dist/toe.built.js']
        },
        jshint: {
            options: {
                curly: true,
                    eqeqeq: true,
                    immed: true,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    sub: true,
                    undef: true,
                    eqnull: true,
                    browser: true
            },
            globals: {
                jQuery: true
            }
        },
        min: {
            dist: {
                src: ['dist/toe.built.js'],
                dest: 'dist/toe.min.js'
            }
        }
    });

    grunt.registerTask('default', 'concat lint min');

};