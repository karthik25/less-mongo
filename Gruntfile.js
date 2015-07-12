// Gruntfile.js

// our wrapper function (required by grunt and its plugins)
// all configuration goes inside this function
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		// Task configuration.
		concat: {
			options: {
				stripBanners: false
			},
			dist: {
				src: [
					'src/less.mongo.js',
                    'lib/underscore.js',
					'src/less.helpers.js',
                    'src/less.iterables.js'
				],
				dest: 'less.mongo.js'
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
				unused: true,
				boss: true,
				eqnull: true,
				globals: {
					jQuery: true
				},
				node: true
			},
			gruntfile: {
				src: 'Gruntfile.js'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-text-replace');

	// Default task.
	grunt.registerTask('default', ['jshint', 'concat']);
};
