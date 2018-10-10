var gulp = require('gulp'),
    watch = require('gulp-watch'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    browserSync = require('browser-sync'),
    cache = require('gulp-cache');

const SYNC = false;

var reload = browserSync.reload;
var dir = {
    css: '_css/',
    js: '_js/',
};
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        js: dir.js,
        css: dir.css,
    },
    src: { //Пути откуда брать исходники
        js: [dir.js + '**/*.js', '!' + dir.js + '**/*.min.js', '!' + dir.js + '**/*-min.js', '!' + dir.js + 'plugins/**/*.js'],//В стилях и скриптах нам понадобятся только main файлы
        style: dir.css + '**/*.scss',
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        js: [dir.js + '**/*.js', '!' + dir.js + '**/*.min.js', '!' + dir.js + '**/*-min.js'],
        style: dir.css + '**/*.scss',
    },
    clean: './build'
};

var pathBX = {
    //Тут мы укажем куда складывать готовые после сборки файлы
    build: {
        css: './local/',
    },
    //Пути откуда брать исходники
    src: {
        style: ['./local/**/*.scss', 'local/**/.default/**/*.scss'],
    },
    //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    watch: {
        style: './local/**/*.scss',
        style2: 'local/**/.default/**/*.scss'
        // style: 'local/templates/.default/**/*.scss'
    },
};

gulp.task('js:build', function (done) {
    gulp.src(path.src.js, {since: gulp.lastRun('js:build')})
        .pipe(uglify()).on("error", function () {
        console.log('FUCK JS')
    })
        .pipe(uglify()).on("error", function () {
        console.log('FUCK JS');
    })
        .pipe(rename(function (path) {
            if (path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest(path.build.js));
    done();
});
gulp.task('style:build', function (done) {
    const pathes = [path, pathBX];
    pathes.map(function (path) {
        gulp.src(path.src.style)
            .pipe(sass()).on("error", sass.logError)
            .pipe(postcss([autoprefixer({browsers: ['last 1616 version']})]))
            .pipe(cssnano({autoprefixer: false, convertValues: false, zindex: false}))
            .pipe(gulp.dest(path.build.css));
    });
    done();
});

gulp.task('build', gulp.series([
    'js:build',
    'style:build',
]));

gulp.task('browserSync', function () {
    browserSync({
        proxy: "vdd/",
        open: true,
        notify: false
    });
});

gulp.task('watch', function () {
    watch([path.watch.style, pathBX.watch.style, pathBX.watch.style2], gulp.series('style:build'));
    watch(path.watch.js, gulp.series('js:build'));
});

var arTask = ['build', 'watch'];

if (SYNC)
    arTask.push('browserSync');

gulp.task('default', gulp.series(arTask));