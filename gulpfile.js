const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');

function sassTask() {
    return gulp.src('./src/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}

function jsTask() {
    return browserify({
            entries: ['./src/js/app.js'],
            debug: true
        })
        .transform(babelify)
        .bundle()
        .pipe(plumber())
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

function buildJS() {
    return gulp.src('./dist/js/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./dist/js'));
}

function buildCSS() {
    return gulp.src('./dist/css/style.css')
        .pipe(cssnano())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./dist/css'));
}

function browserSyncTask(done) {
    // https://browsersync.io/docs/options
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000,
        open: false
    });
  
//     browserSync.init({
//         proxy: 'local.yourdomain.me',
//         port: 3000,
//         open: false
//     });

    done();
}

function browserSyncReload(done) {
    browserSync.reload();

    done();
}

function watchFiles() {
    gulp.watch('./src/sass/**/*.scss', sassTask);
    gulp.watch('./src/js/**/*.js', jsTask);
    gulp.watch(['./**/*.html', './**/*.php'], browserSyncReload);
}

gulp.task('watch', gulp.parallel(watchFiles, browserSyncTask));
gulp.task('sass', sassTask);
gulp.task('js', jsTask);
gulp.task('production', gulp.series('sass', 'js', gulp.parallel(buildJS, buildCSS)));