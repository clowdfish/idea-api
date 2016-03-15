// include gulp
var gulp = require('gulp');

// include core modules
var path = require('path'),
      fs = require('fs'),
    exec = require('child_process').exec;

// include gulp plug-ins
var ts      = require('gulp-typescript'),
    notify  = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    shell   = require('gulp-shell'),
    concat  = require('gulp-concat'),
    data    = require('gulp-data'),
    replace = require('gulp-replace'),
    typson  = require('typson'),
    yaml    = require('yamljs'),
    mkdirp  = require('mkdirp');

/****************************************************************************************************/
/* SETTING UP DEVELOPMENT ENVIRONMENT                                                               */
/****************************************************************************************************/

// the title and icon that will be used for notifications
var notifyInfo = {
  title: 'Gulp',
  icon: path.join(__dirname, 'gulp.png')
};

// error notification settings for plumber
var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: notifyInfo.title,
    icon: notifyInfo.icon,
    message: "Error: <%= error.message %>"
  })
};

// typescript compiler configuration
var tsConfig = {
  target: 'es5',
  module: 'commonjs',
  declaration: true,
  noImplicitAny: false,
  noExternalResolve: true,
  removeComments: true,
  preserveConstEnums: true,
  suppressImplicitAnyIndexErrors: true,
  sourceMap: true
};

// port that is used for serving swagger definition file
// WATCH OUT:
// When changing the port number, you also must change the $ref fields in the swagger file!
var fileLoaderPort = 8088;

/****************************************************************************************************/
/* DEVELOPMENT TASKS                                                                                */
/****************************************************************************************************/

// typescript based tasks
gulp.task('typescript', function() {

  var tsResult = gulp.src([
      'typings/main/**/*.d.ts',
      'api/contracts/**/*.ts',
      'api/controllers/**/*.ts',
      'api/helpers/**/*.ts',
      'api/mocks/**/*.ts',
      'test/**/*.ts'
    ], { base: "." })
    .pipe(plumber(plumberErrorHandler))
    .pipe(ts(tsConfig));

  return tsResult.js
    .pipe(gulp.dest('dist/'));
});

// create the JSON definition file from the TypeScript contracts
gulp.task('typson', function() {

  gulp.src('./api/contracts/*.contract.ts')
    .pipe(concat('contract.ts'))
    .pipe(gulp.dest('./api/swagger'))
    .pipe(data(function(file) {
      return typson.schema(file.path)
        .done(function (schema) {
          fs.writeFileSync('./api/swagger/definitions.yaml', yaml.stringify(schema, 10, 2));
          fs.unlink('./api/swagger/contract.ts', function() {});
        });
    }));
});

// create necessary folders to be able to upload files
gulp.task('create-upload-folders', function() {
  mkdirp('static/images/uploaded');
  mkdirp('api/temp');
});

// start file loader to deliver swagger definition file to client
gulp.task('file-loader', function() {
  exec('node loader.js -p ' + fileLoaderPort, function (err, out) {
    if(out) console.log(out);
    if(err) console.error(err);
  });

  console.log("The file loader is now active on port " + fileLoaderPort + ".");
});

// start the swagger edit user interface
gulp.task('swagger-edit', shell.task([
    'swagger project edit'
  ])
);

// start the API provided by swagger
gulp.task('swagger-start', shell.task([
    'swagger project start'
  ])
);

/****************************************************************************************************/
/* GULP TASK SUITES                                                                                 */
/****************************************************************************************************/

gulp.task('edit', ['file-loader', 'swagger-edit'], function() { });

gulp.task('live', ['create-upload-folders', 'typescript', 'typson'], function() {

  // watch for code changes
  gulp.watch(['./api/**/*.ts', '!./api/contracts/*.ts'], ['typescript'], function(event) {
    onModification(event);
  });

  gulp.watch('./api/contracts/*.ts', ['typson'], function(event) {
    onModification(event);
  });

  function onModification (event) {
    gulp.src(event.path)
      .pipe(plumber())
      .pipe(notify({
        title: notifyInfo.title,
        icon: notifyInfo.icon,
        message: event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + '.'
      }));
  }
});

gulp.task('start', ['file-loader', 'swagger-start'], function() { });

// build swagger file
gulp.task('swagger-build', function() {

  gulp.src([
    'api/swagger/swagger.yaml',
    'api/swagger/definitions.yaml'
  ])
    .pipe(replace('http://localhost:' + fileLoaderPort + '/definitions.yaml', ''))
    .pipe(replace('$schema: \'http://json-schema.org/draft-04/schema#\'', ''))
    .pipe(concat('swagger.yaml'))
    .pipe(gulp.dest('build/'));
});