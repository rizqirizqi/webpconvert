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
  .usage('Convert jpg/png images in specified directory to webp\nUsage: webpconvert [source] [target] [options]')
  .example('webpconvert')
  .example('webpconvert sample-images')
  .example('webpconvert sample-images output')
  .example('webpconvert sample-images/KittenJPG.jpg')
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

// Setup Source and Target

const getExt = str => {
  const splitted = str.split('.');
  if (splitted.length < 2) return '';
  if (!splitted[0]) return '';
  return splitted[1];
}
const isFile = str => {
  return !!getExt(str);
}

const source = argv._[0] || '.';

let PNGImages = '';
let JPGImages = '';

if (isFile(source)) {
  if (getExt(source) === 'png') {
    PNGImages = source;
  } else if (getExt(source) === 'jpg' || getExt(source) === 'jpeg') {
    JPGImages = source;
  }
} else {
  PNGImages = path.resolve(source, '*.png');
  JPGImages = path.resolve(source, '*.jpg');
}

let target = argv._[1] || source || '.';

if (isFile(target)) {
  target = path.dirname(target);
}

// Processing

if (PNGImages) {
  gulp.src(PNGImages)
    .pipe(imagemin([webp({
      lossless: true // Losslessly encode images
    })], {
      verbose: true
    }))
    .pipe(rename({ suffix: ".png", extname: '.webp' }))
    .pipe(gulp.dest(target));
}

if (JPGImages) {
  gulp.src(JPGImages)
    .pipe(imagemin([webp({
      quality: 65 // Quality setting from 0 to 100
    })], {
      verbose: true
    }))
    .pipe(rename({ suffix: ".jpg", extname: '.webp' }))
    .pipe(gulp.dest(target));
}
