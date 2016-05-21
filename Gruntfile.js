module.exports = function (grunt) {

    'use strict';

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: require('./package.json'),
        bumpType: 'patch',
        env: 'development',
        appConfig: {
            app: require('./bower.json').appPath || 'app',
            buildFolder: 'build',
            repo: 'git@bitbucket.org:poeyer/aim4profit.git'
        },
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= appConfig.app %>/js/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: {
                        port: 9000
                    }
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            express: {
                files: ['./node/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            build: [
                'imagemin',
                'svgmin'
            ]
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            frontend: {
                expand: true,
                cwd: '<%= appConfig.app %>',
                src: ['img/**', 'views/**'],
                dest: '<%= appConfig.buildFolder %>/app'
            },
            index: {
                expand: true,
                cwd: '<%= appConfig.app %>',
                src: ['index.html'],
                dest: '<%= appConfig.buildFolder %>/app'
            },
            pkg: {
                expand: true,
                src: ['package.json'],
                dest: '<%= appConfig.buildFolder %>'
            }
        },
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= appConfig.buildFolder %>/images'
                }]
            }
        },

        svgmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= appConfig.buildFolder %>/images'
                }]
            }
        },

        htmlmin: {
            build: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.buildFolder %>',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= appConfig.buildFolder %>/app'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            build: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: '<%= appConfig.buildFolder %>/app',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= appConfig.buildFolder %>/{,*/}*.html'],
            css: ['<%= appConfig.buildFolder %>/css/{,*/}*.css'],
            options: {
                assetsDirs: [
                    '<%= appConfig.buildFolder %>',
                    '<%= appConfig.buildFolder %>/images',
                    '<%= appConfig.buildFolder %>/css'
                ]
            }
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                force: true,
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= appConfig.app %>/js/{,*/}*.js'
                ]
            }
        },
        // Empties folders to start fresh
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= appConfig.buildFolder %>/{,*/}*',
                        '!<%= appConfig.buildFolder %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= appConfig.app %>/index.html'],
                ignorePath: /\.\.\//
            }
        },
        cssmin: {
            build: {
                files: {
                    '<%= appConfig.buildFolder %>/app/css/solepics.css': [
                        'app/css/{,*/}*.css'
                    ]
                }
            }
        },
        uglify: {},
        concat: {},
        prompt: {
            bumpType: {
                options: {
                    questions: [
                        {
                            config: 'bumpType', // arbitrary name or config for any other grunt task
                            type: 'list', // list, checkbox, confirm, input, password
                            message: 'Bump the package.json version', // Question to ask the user, function needs to return a string,
                            default: 'patch', // default value if nothing is entered
                            choices: ['patch', 'minor', 'major']
                        }
                    ]
                }
            },
            env: {
                options: {
                    questions: [
                        {
                            config: 'env', // arbitrary name or config for any other grunt task
                            type: 'list', // list, checkbox, confirm, input, password
                            message: 'What environment', // Question to ask the user, function needs to return a string,
                            default: 'development', // default value if nothing is entered
                            choices: ['development', 'staging', 'production']
                        }
                    ]
                }
            }
        },
        bump: {
            options: {
                versionType: '<%= bumpType %>',
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commit: false,
                createTag: false,
                push: false,
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },
        gitcommit: {
            buildPkg: {
                options: {
                    message: 'Updated package.json with bumped version v<%= pkg.version %>'
                },
                files: [
                    {
                        src: ['package.json', 'build/package.json'],
                        expand: true
                    }
                ]
            }
        },
        gittag: {
            buildPkg: {
                options: {
                    tag: 'v<%= pkg.version %>',
                    message: 'Release v<%= pkg.version %>',
                    force: true
                }
            }
        },
        gitpush: {
            buildPkg: {
                options: {
                    remote: 'origin',
                    branch: 'master'
                }
            }
        },
        gitRemoteTag: {
            buildPkg: {
                options: {
                    tag: 'v<%= pkg.version %>',
                    message: 'Release v<%= pkg.version %>',
                    force: true
                }
            }
        },
        express: {
            dev: {
                options: {
                    script: 'node/keystone.js',
                    debug: true
                }
            }
        },
        ngtemplates: {
            app: {
                cwd: './app',
                src: ['./views/**/*.html'], // 'img/icons.svg' sadly not possible. it somehow removes information needed for colors.
                dest: './.tmp/templates.js',
                options: {
                    module: 'app',
                    prefix: '',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: false,
                        removeComments: true
                    },
                    usemin: '/js/solepics.min.js',
                    url: function(url) {
                        return url.slice(1);
                    }
                }
            }
        },
    });

    grunt.registerTask('build', [
        'clean:build',
        //'wiredep',
        'useminPrepare',
        'ngtemplates',
        'concurrent:build',
        'concat',
        'ngAnnotate',
        'copy:frontend',
        'copy:index',
        'cssmin',
        'uglify',
        'usemin',
        'htmlmin',
        'prompt:bumpType',
        'bump',
        //'copy:pkg',
        //'gitcommit:buildPkg',
        //'gitRemoteTag:buildPkg',
        //'gitpush:buildPkg'
    ]);

    grunt.registerTask('deploy', [
        'prompt:env',
        'updateEcoSystem',
        'shell:pm2deploy'
    ]);

    grunt.registerTask('serve', '', function () {
        var taskList = [
            'jshint',
            'express:dev',
            //'watch'
        ];
        grunt.task.run(taskList);
    });

    grunt.registerTask('default', ['serve']);
};