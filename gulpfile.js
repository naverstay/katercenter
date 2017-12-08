var prod = false;
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var newer = require('gulp-newer');
var jadeInheritance = require('gulp-jade-inheritance');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var filter = require('gulp-filter');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task('jade', function () {
    gulp.src(['app/jade/*.jade', '!app/jade/_*.jade'])
        .pipe(plumber())

        //only pass unchanged *main* files and *all* the partials
        .pipe(changed('dist', {extension: '.html'}))

        //filter out unchanged partials, but it only works when watching
        .pipe(gulpif(global.isWatching, cached('pug')))

        //find files that depend on the files that have changed
        .pipe(jadeInheritance({basedir: 'app/jade'}))

        //filter out partials (folders and files starting with "_" )
        .pipe(filter(function (file) {
            return !/\/_/.test(file.path) && !/^_/.test(file.relative);
        }))

        .pipe(pug({
            pretty: true,
            locals: {
                'production': prod
            }
        }))
        .pipe(gulp.dest('app/'))
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }));
});

gulp.task('sass', function () {
    return gulp.src('app/scss/main_global.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(plumber())
        .pipe(sass()) // Passes it through a gulp-sass
        .pipe(gulp.dest('app/css')) // Outputs it in the css folder
        .pipe(browserSync.reload({ // Reloading with Browser Sync
            stream: true
        }));
});

gulp.task('setWatch', function () {
    global.isWatching = true;
});

// Watchers
gulp.task('watch', ['setWatch', 'jade'], function () {
    gulp.watch('app/**/*.scss', ['sass']);
    gulp.watch(['app/**/*.jade', 'app/**/*.pug'], ['jade']);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(plumber())
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssnano()))
        //.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

// Optimizing Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(plumber())
        //.pipe(newer('dist/images'))
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

// Copying fonts
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// Cleaning
gulp.task('clean', function () {
    return del.sync('dist').then(function (cb) {
        return cache.clearAll(cb);
    });
});

gulp.task('clean:dist', function () {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function (callback) {
    runSequence(['sass', 'jade', 'browserSync', 'watch'],
        callback
    )
});

gulp.task('build', function (callback) {
    prod = true;
    runSequence(
        'clean:dist',
        'sass',
        'jade',
        ['useref', 'images', 'fonts'],
        callback
    )
});
