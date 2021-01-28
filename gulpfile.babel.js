import gulp from 'gulp';
import del from 'del';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import csso from 'gulp-csso';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import babel from 'rollup-plugin-babel';
import normalize from 'node-normalize-scss';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import pug from 'gulp-pug';
import prettyHtml from 'gulp-pretty-html';

const imagemin = require('gulp-imagemin');

const rollup = require('rollup');

const server = browserSync.create();

gulp.task('html', () => gulp
  .src('source/pages/*.pug')
  .pipe(pug({}))
  .pipe(gulp.dest('build'))
  .pipe(
    browserSync.stream({
      once: true,
    }),
  ));

gulp.task('pretty-html', () => gulp.src('build/**/*.html')
  .pipe(prettyHtml({
    indent_size: 2,
  }))
  .pipe(gulp.dest('build')));

gulp.task('css', () => gulp.src('source/scss/style.scss')
  .pipe(plumber())
  .pipe(sass({
    includePaths: normalize.includePaths,
  }))
  .pipe(postcss([
    autoprefixer(),
  ]))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream()));

gulp.task('css-build', () => gulp.src('source/scss/style.scss')
  .pipe(plumber())
  .pipe(sass({
    includePaths: normalize.includePaths,
  }))
  .pipe(postcss([
    autoprefixer(),
  ]))
  .pipe(csso())
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream()));

gulp.task('clean', () => del('build'));

gulp.task('copy', () => gulp.src([
  'source/fonts/**/*.{woff,woff2}',
  'source/img/**/*',
  '!source/img/sprite',
  '!source/img/sprite/*',
  'source/video/**/*',
], {
  base: 'source',
})
  .pipe(gulp.dest('build')));

gulp.task('copy-build', () => gulp.src([
  'source/fonts/**/*.{woff,woff2}',
  'source/img/**/*.webp',
  '!source/img/sprite',
  '!source/img/sprite/*',
  'source/video/**/*',
], {
  base: 'source',
})
  .pipe(gulp.dest('build')));

gulp.task('json', () => gulp.src([
  'source/json/**/*',
], {
  base: 'source',
})
  .pipe(gulp.dest('build')));

gulp.task('images', () => gulp.src(['source/img/**/*.{png,jpg,svg}', '!source/img/sprite/*.svg'])
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.mozjpeg({ progressive: true }),
    imagemin.svgo({
      plugins: [
        { removeViewBox: false },
      ],
    }),
  ]))
  .pipe(gulp.dest('build/img')));

gulp.task('sprite', () => gulp.src('source/img/sprite/*.svg') // todo check if directory empty
  .pipe(svgstore({
    inlineSvg: true,
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img')));

// Без uglify.
gulp.task('js', () => rollup.rollup({
  input: './source/js/main.js',
  plugins: [
    resolve({
      mainFields: ['jsnext', 'main'],
      browser: true,
    }),
    commonjs(),
    babel(),
  ],
}).then((bundle) => bundle.write({
  file: './build/js/main.js',
  format: 'iife',
  name: 'main',
  sourcemap: true,
})));

// С uglify.
gulp.task('js-build', () => rollup.rollup({
  input: './source/js/main.js',
  plugins: [
    resolve({
      mainFields: ['jsnext', 'main'],
      browser: true,
    }),
    commonjs(),
    babel(),
    uglify(),
  ],
}).then((bundle) => bundle.write({
  file: './build/js/main.js',
  format: 'iife',
  name: 'main',
  // sourcemap: true,
})));

gulp.task('server', () => {
  server.init({
    server: 'build/',
  });

  gulp.watch(['source/scss/**/*.{scss,sass}', 'source/blocks/**/*.{scss,sass}'], gulp.series('css'));
  gulp.watch('source/img/sprite/*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/**/*.pug', gulp.series('html', 'refresh'));
  gulp.watch('source/json/**/*.json', gulp.series('json', 'refresh'));
  gulp.watch(['source/img/*', 'source/img/*/**', '!source/img/sprite/*.svg'], gulp.series('copy', 'refresh'));
  gulp.watch(['source/js/**/*.js', 'source/blocks/**/*.js'], gulp.series('js', 'refresh'));
});

gulp.task('refresh', (done) => {
  server.reload();
  done();
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'copy-build',
    'json',
    'images',
    'css-build',
    'html',
    'js-build',
    'sprite',
  ),
  'pretty-html',
  'server',
));

gulp.task('start', gulp.series(
  'clean',
  gulp.parallel(
    'copy',
    'json',
    'css',
    'html',
    'js',
    'sprite',
  ),
  'server',
));
