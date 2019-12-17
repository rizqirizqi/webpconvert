#!/usr/bin/env node
const yargs = require('yargs');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const webp = require('imagemin-webp');
const path = require('path');

const DEFAULT_SOURCE = '.';
const DEFAULT_TARGET = 'same as source directory';
const argv = yargs
  .usage('Convert jpg/png images in specified directory to webp\nUsage: webpconvert [options]')
  .example('webpconvert')
  .example('webpconvert -s sample-images')
  .example('webpconvert -s sample-images -t sample-images')
  .options('source', {
    alias: 's',
    type: 'string',
    describe: 'source directory',
    default: DEFAULT_SOURCE,
  })
  .options('target', {
    alias: 't',
    type: 'string',
    describe: 'target directory',
    default: DEFAULT_TARGET,
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

const sourceDir = argv.source || '.';
const targetDir = argv.target !== DEFAULT_TARGET ? argv.target : sourceDir;
const PNGImages = path.resolve(sourceDir, '*.png');
const JPEGImages = path.resolve(sourceDir, '*.jpg');

gulp.src(PNGImages)
  .pipe(imagemin([webp({
    lossless: true // Losslessly encode images
  })], {
    verbose: true
  }))
  .pipe(rename({ suffix: ".png", extname: '.webp' }))
  .pipe(gulp.dest(targetDir));

gulp.src(JPEGImages)
  .pipe(imagemin([webp({
    quality: 65 // Quality setting from 0 to 100
  })], {
    verbose: true
  }))
  .pipe(rename({ suffix: ".jpg", extname: '.webp' }))
  .pipe(gulp.dest(targetDir));
