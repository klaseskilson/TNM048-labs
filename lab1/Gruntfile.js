module.exports = function(grunt) {
  // get rid of annoying grunt task loading
  require('load-grunt-tasks')(grunt);

  var banner = '/*! <%= pkg.name %>\n(c) <%= pkg.author %> 2016\n' +
    'Built <%= grunt.template.today("yyyy-mm-dd") %>\n<%= pkg.homepage%> */\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'http-server': {
      dev: {
        port: 3000,
        runInBackground: true,
        cache: 0
      }
    },
    watch: {
      client: {
        options: {
          interrupt: true,
        },
        files: ['js/**/*.js', 'index.html'],
        tasks: ['build'],
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build', 'build_libs']
      }
    },
    jshint: {
      file: ['js/**/*.js']
    },
    concat: {
      options: {
        separator: ';\n',
        sourceMap: true
      },
      libs: {
        src: ['node_modules/d3/d3.js',
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/bootstrap/dist/js/bootstrap.min.js',
          'node_modules/modernizr/modernizr.js',
          'node_modules/colorbrewer/colorbrewer.js',
          'node_modules/topojson/topojson.min.js',
          'node_modules/underscore/underscore-min.js',
          // 'libs/**/*.js',
        ],
        dest: 'dist/libs.js'
      },
      client: {
        src: ['js/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    concat_css: {
      all: {
        src: ['node_modules/bootstrap/dist/css/bootstrap.min.css',
          'node_modules/colorbrewer/colorbrewer.css',
        ],
        dest: 'dist/libs.css'
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'concat:client']);
  grunt.registerTask('build_libs', ['concat:libs', 'concat_css']);
  grunt.registerTask('dev', ['build', 'build_libs', 'http-server', 'watch']);
  grunt.registerTask('default', ['build', 'build_libs']);
};
