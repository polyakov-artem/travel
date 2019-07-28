const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require("gulp-imagemin");
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const gulpPngquant = require('gulp-pngquant');
const run = require("run-sequence");
const del = require("del");
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const pug = require('gulp-pug');
const jsbeautifier = require('gulp-jsbeautifier');
const html2pug = require('gulp-html2pug');
const svg2Sprite = require('gulp-svg-sprites');
const fs = require("fs");
const cssBase64 = require('gulp-css-base64');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require("gulp-cssnano");


const jsFiles = [
  'src/vendor/lightbox2-master/dist/js/lightbox.min.js',
  "src/vendor/fotorama-4.6.4/fotorama.js",
  "src/vendor/jquery-datepicker/jquery-ui.js",
  "src/vendor/slick-1.8.1/slick/slick.js",
  'src/js/_js.js'
];

/* ================================= */
/* Development -> */
/* ================================= */

gulp.task('sass', function() {
  return gulp.src('src/sass/dev/styles.scss')
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 15 version']
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('pug', function() {
  return gulp.src('src/pug/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(jsbeautifier({ config: './JS Beautifier html config.json' }))
    .pipe(gulp.dest('src'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function() {
  return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('html2Pug', function() {
  return gulp.src('src/temp/html2pug/*.html')
    .pipe(html2pug())
    .pipe(replace('  ', '\t'))
    .pipe(gulp.dest('src/temp/html2pug/'))
});

gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: "src"
    },
    browser: "chrome",
    notify: false
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });

  gulp.watch("src/js/**/_js.js", gulp.series("js"));
  gulp.watch("src/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("src/pug/**/*.pug", gulp.series("pug"));
  gulp.watch("src/temp/html2pug/*.html", gulp.series("html2Pug"));

});

gulp.task('compile',
  gulp.series(
    'sass',
    'pug',
    'js',
  )
);


gulp.task('start', gulp.series("compile", 'watch'));

/* ================================= */
/* <- Development */
/* ================================= */


/* ================================= */
/* Production -> */
/* ================================= */

gulp.task('sassProd', function() {
  return gulp.src('src/sass/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 15 version']
    }))
    // .pipe(cssnano())
    .pipe(gulp.dest('build/css'))
});


gulp.task('pugProd', function() {
  return gulp.src('src/pug/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(jsbeautifier({ config: './JS Beautifier html config.json' }))
    .pipe(gulp.dest('build'))
});

gulp.task('jsProd', function() {
  return gulp.src(jsFiles)
    .pipe(concat('script.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('build/js'))
});


gulp.task('copy', function() {
  return gulp.src([
      'src/img/**',
      'src/fonts/**',
    ], {
      base: './src/'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('build',
  gulp.series(
    'clean',
    'copy',
    'sassProd',
    'pugProd',
    'jsProd'
  )
);

/* ================================= */
/* <- Production */
/* ================================= */


/* ================================= */
/* SVG спрайт -> */
/* ================================= */

/*
  1. Запустить makeSvg
  2. Подключить symbol_sprite.svg в html
  3. Подключить стили _svg_sprite.scss к основному Sass файлу
  4. Использовать в html через конструкцию:
    svg.icon.icon-application
      use(xlink:href="#icon-application")
*/
gulp.task('svg', function() {
  return gulp.src('app/img/svg/all/*.svg')
    // .pipe(svgmin({
    //   js2svg: {
    //     pretty: true
    //   }
    // }))
    .pipe(cheerio({
      run: function($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(replace('&gt;', '>'))

    .pipe(svg2Sprite({
      mode: "symbols",
      preview: false,
      selector: "icon-%f",
      svg: {
        symbols: 'symbol_sprite.svg'
      }
    }))
    .pipe(gulp.dest('app/img/svg'));
});

gulp.task('svgSvgSass', function() {
  return gulp.src('app/img/svg/all/*.svg')
    .pipe(svg2Sprite({
      preview: false,
      selector: "icon-%f",
      cssFile: '_svg_sprite.scss',
      templates: {
        css: fs.readFileSync('app/sass/_svg-sprite-template.scss', "utf-8")
      }
    }))
    .pipe(gulp.dest('app/sass/'))
});

gulp.task('delSvg', function() {
  return del('app/sass/svg/');
});


gulp.task('makeSvg', gulp.series('svg', 'svgSvgSass', 'delSvg'));

/* ================================= */
/* <- SVG спрайт */
/* ================================= */

/* ================================= */
/* СSS спрайт -> */
/* ================================= */

/*
  1. Запустить iconsToCss
  2. Записать в _png_icons.css пути до картинок
  3. Запустить iconsToCss
  4. Подключить _png_icons.scss  основному файлу
*/

gulp.task('iconsToCss', function() {
  return gulp.src('app/css/_png_icons.css')
    .pipe(plumber())
    .pipe(cssBase64({
      extensionsAllowed: ['.png']
    }))
    .pipe(rename(function(path) {
      path.extname = ".scss";
    }))
    .pipe(gulp.dest('app/sass/'))
});

/* ================================= */
/* <- СSS спрайт */
/* ================================= */

/* ================================= */
/* Оптимизация картинок -> */
/* ================================= */

gulp.task('compressImages', function() {
  return gulp.src('app/img/**/*.{png,jpg, jpeg}')
    .pipe(imagemin([
      imagemin.jpegtran({ progressive: true }),
      imageminJpegRecompress({
        loops: 5,
        min: 70,
        max: 80,
        quality: 'medium'
      }),
      imagemin.optipng({ optimizationLevel: 3 })
    ]))
    // .pipe(gulpPngquant({
    //             quality: '65-80', 
    //             speed: 5
    //         }))
    .pipe(gulp.dest('app/img/compressed'));
});

/* ================================= */
/* <- Оптимизация картинок */
/* ================================= */