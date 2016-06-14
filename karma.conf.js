// Karma configuration
// Generated on Sun Feb 28 2016 23:19:24 GMT+0200 (Jerusalem Standard Time)

module.exports = function(config) {
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-*/angular-*.js',
      'node_modules/angular-translate/dist/angular-translate.js',
      'node_modules/angular-ui-router/release/angular-ui-router.min.js',
      'node_modules/ui-router-extras/release/ct-ui-router-extras.min.js',
      'node_modules/angular-ui-calendar/src/calendar.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
      'node_modules/angular-gridster/dist/angular-gridster.min.js',
      'node_modules/javascript-detect-element-resize/jquery.resize.js',
      'node_modules/moment/min/moment.min.js',
      'node_modules/fullcalendar/dist/fullcalendar.min.js',
      'node_modules/fullcalendar/dist/gcal.js',
      'client/**/*.module.js',
      'client/**/*.js',
      'client/test/*.test.js'
    ],
      
      reporters: ['mocha'],
      
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
	  'karma-firefox-launcher',
      'karma-mocha-reporter'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    
      
      
      


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  };
    
  config.set(configuration);
};
