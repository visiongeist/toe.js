module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: [
                    'src/toe.js',
                    'src/gestures/*.js'
                ],
                dest: 'dist/toe.js'
            }
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
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            all: ['dist/toe.js', 'src/toe.js', 'src/gestures/*.js']
        },
        uglify: {
            options: {
                preserveComments: 'some'
            },
            jquery: {
                src: ['dist/toe.js'],
                dest: 'dist/toe.min.js'
            },
            zepto: {
                src: ['dist/toe.zepto.js'],
                dest: 'dist/toe.zepto.min.js'
            }
        },
        replace: {
            zepto: {
                src: ['dist/toe.js'],
                dest: 'dist/toe.zepto.js',
                replacements: [{
                    from: 'jQuery',
                    to: 'Zepto'
                }]
            }
        },
        jsdoc : {
            dist : {
                src: ['src/toe.js', 'src/gestures/*.js'],
                options: {
                    destination: 'dist/doc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['concat', 'jshint', 'replace', 'uglify']);
};