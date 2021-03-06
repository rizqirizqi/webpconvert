#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import webp from 'imagemin-webp';
import { resolve, dirname } from 'path';

const { argv } = yargs(hideBin(process.argv))
  .usage('Convert jpg/png images in specified directory to webp\nUsage: webpconvert [source] [target] [options]')
  .wrap(null)
  .example('webpconvert')
  .example('webpconvert sample-images')
  .example('webpconvert sample-images -q 50')
  .example('webpconvert sample-images output')
  .example('webpconvert sample-images/KittenJPG.jpg')
  .options('q', {
    alias: 'quality',
    demandOption: false,
    default: 80,
    describe: 'Specify the quality of webp image. Lower values yield better compression but the least image quality.',
    type: 'number',
    requiresArg: true,
  })
  .help()
  .alias('help', 'h')
  .version()
  .alias('version', 'v');

// Setup Source and Target

const getExt = (str) => {
  const splitted = str.split('.');
  if (splitted.length < 2) return '';
  if (!splitted[0]) return '';
  return splitted[1];
};
const isFile = (str) => !!getExt(str);

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
  PNGImages = resolve(source, '*.png');
  JPGImages = resolve(source, '*.jpg');
}

let target = argv._[1] || source || '.';

if (isFile(target)) {
  target = dirname(target);
}

// Processing

if (PNGImages) {
  gulp.src(PNGImages)
    .pipe(imagemin([webp({
      quality: argv.quality,
    })], {
      verbose: true,
    }))
    .pipe(rename({ suffix: '.png', extname: '.webp' }))
    .pipe(gulp.dest(target));
}

if (JPGImages) {
  gulp.src(JPGImages)
    .pipe(imagemin([webp({
      quality: argv.quality,
    })], {
      verbose: true,
    }))
    .pipe(rename({ suffix: '.jpg', extname: '.webp' }))
    .pipe(gulp.dest(target));
}
