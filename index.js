#!/usr/bin/env node
const yargs = require('yargs');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const webp = require("imagemin-webp");

const argv = yargs
  .usage('Convert jpg/png images in specified directory to webp\nUsage: webpconvert [options]')
  .example('webpconvert')
  .example('webpconvert -s ./sourceImg -t ./targetImg')
  .options('source', {
    alias: 's',
    type: 'string',
    describe: 'source directory',
    default: '.',
  })
  .options('target', {
    alias: 't',
    type: 'string',
    describe: 'target directory',
    default: '.',
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .argv;

const sourceDir = argv.sourceDir || '.';
const targetDir = argv.targetDir || '.';
const PNGImages = `${sourceDir}/*.png`;
const JPEGImages = `${sourceDir}/*.jpg`;

gulp.src(PNGImages)
  .pipe(imagemin([webp({
    lossless: true // Losslessly encode images
  })], {
    verbose: true
  }))
  .pipe(rename({ suffix: ".png", extname: '.webp' }))
  .pipe(gulp.dest(targetDir))
  .on("finish", () => {
    console.log('PNG Images optimized');
  });

gulp.src(JPEGImages)
  .pipe(imagemin([webp({
    quality: 65 // Quality setting from 0 to 100
  })], {
    verbose: true
  }))
  .pipe(rename({ suffix: ".jpg", extname: '.webp' }))
  .pipe(gulp.dest(targetDir))
  .on("finish", () => {
    console.log('JPG Images optimized');
  });
