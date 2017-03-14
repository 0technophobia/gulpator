var gulp         = require('gulp'), // gulp lib
    image        = require('gulp-image'), // compress images -> comment if error
    rename       = require('gulp-rename'), // rename files
    uglify       = require('gulp-uglify'), // compress js
    autoprefixer = require('autoprefixer'), // add prefix to css
    sourcemaps   = require('gulp-sourcemaps'), // make source maps
    postcss      = require('gulp-postcss'), // autoprefixer deb
    pug          = require('gulp-pug'), // compile pug
    sass         = require('gulp-sass'), // compile sass
    del          = require('del'), // delete folders and files
    runSequence  = require('run-sequence'), // run tasks in series
    browserSync  = require('browser-sync').create(); // another browser refresh for linux

// paths
var image_path = 'assets/imgs', // your image path
    css_path   = 'assets/css', // your css path
    sass_path  = 'assets/sass', // your sass path
    js_path    = 'assets/js', // your js path
    pug_path   = 'assets/pug'; // your pug path
    php_path   = 'assets/php'; // your php path
    fonts_path = 'assets/fonts', // your fonts path
    html_path  = '', // your html path

// creat project folders
gulp.task('folders', function(){
  'use strict';
 return gulp
        .src('my_files/*.st')
        .pipe(gulp.dest(image_path))
        .pipe(gulp.dest(css_path))
        .pipe(gulp.dest(sass_path))
        .pipe(gulp.dest(js_path))
        .pipe(gulp.dest(fonts_path))
        .pipe(gulp.dest(html_path))
        .pipe(gulp.dest(php_path))
        .pipe(gulp.dest(pug_path));
});


// delete starting folders and files
gulp.task('delete', function() {
  'use strict';
    del.sync(['assets/**/*.st']);
    del.sync(['*.st']);
});


// copy lib files
gulp.task('copy', function() {
  'use strict';
  gulp.src('my_files/*.css').pipe(gulp.dest(css_path));
  gulp.src('my_files/*.js').pipe(gulp.dest(js_path));
  gulp.src('my_files/sass/**/*.sass').pipe(gulp.dest(sass_path));
  gulp.src('my_files/sass/**/*.scss').pipe(gulp.dest(sass_path));
  gulp.src('my_files/pug/**/*.pug').pipe(gulp.dest(pug_path));
  gulp.src('my_files/php/**/*.php').pipe(gulp.dest(php_path));
  gulp.src('my_files/fonts/*').pipe(gulp.dest(fonts_path));
});


// keep watch running after errors
function errorcheck(err) {
  'use strict';
  console.error(err);
  this.emit('end');
}


// image task
gulp.task('image', function(){
  'use strict';
  gulp.src(image_path + '/**')
      .pipe(image())
      .pipe(gulp.dest(image_path));
});


// js task
gulp.task('js', function(){
  'use strict';
   return gulp
            .src(js_path + '/*.js')
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .on('error', errorcheck)
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(js_path + '/min'));
});



// pug task
// pug options
var pug0ptions = {
  pretty: true
};
// pug function
gulp.task('pug', function(){
  'use strict';
   return gulp
            .src(pug_path + '/*.pug')
            .pipe(sourcemaps.init())
            .pipe(pug(pug0ptions))
            .on('error', errorcheck)
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(html_path));
});


// sass options
var sassOptions = {
  // compressed -> get a compressed css file
  // compact -> get a compact css file
  // nested -> get a nested css file
  // expanded -> get a expanded css file
  outputStyle    :'compressed',
  errLogToConsole: true
};
// sass function
gulp.task('sass', function() {
  'use strict';
   return gulp
          .src(sass_path + '/*.sass')
          .pipe(sourcemaps.init())
          .pipe(sass(sassOptions).on('error', sass.logError)) // errorcheck
          .pipe(postcss([autoprefixer({browsers:['last 20 versions', 'IE 7']})]))
          .pipe(rename({suffix: '.min'}))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(css_path));
});
// scss function
gulp.task('scss', function() {
  'use strict';
    return gulp
          .src(sass_path + '/*.scss')
          .pipe(sourcemaps.init())
          .pipe(sass(sassOptions).on('error', sass.logError)) // errorcheck
          .pipe(postcss([autoprefixer({browsers:['last 20 versions', 'IE 6']})]))
          .pipe(rename({suffix: '.min'}))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(css_path));
});



// start browser-sync
gulp.task('reload', function(done){
  'use strict';
  browserSync.reload();
  done();
});

gulp.task('server', function(){
  'use strict';
  browserSync.init({
    server: {baseDir: "./"},
    injectChanges: true,
    port: 80,
    ui: {port: 80},
    logPrefix: "0technophobia",
    notify: {
      styles: {
        top: 'auto',
        bottom: '0'
      }
    }
  });
  watch_folders();
});

// start watch function
function watch_folders() {
  gulp.watch(js_path + '/*.js', function(){runSequence('js','reload');});
  gulp.watch(pug_path  + '/**/*.pug', function(){runSequence('pug','reload');});
  gulp.watch(sass_path + '/**/*.sass', function(){runSequence('sass','reload');});
  gulp.watch(sass_path + '/**/*.scss', function(){runSequence('scss','reload');});
}


// creat the first time essential folders and move frameworks to it's distenation
gulp.task('start', function() {
    runSequence('folders', 'delete', 'copy');
});


// default task
gulp.task('default', [
  'js',
  'pug',
  'sass',
  'scss',
  'server'
]);
