#!/usr/bin/env node
const yargs = require('yargs');
const imagemin = require("imagemin");
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

imagemin([PNGImages], {
  destination: targetDir,
  plugins: [webp({
    lossless: true // Losslessly encode images
  })]
}).then(files => {
  if (files.length <= 0) return;
  console.log(files.map(file => file.destinationPath));
  console.log('PNG Images optimized');
});

imagemin([JPEGImages], {
  destination: targetDir,
  plugins: [webp({
    quality: 65 // Quality setting from 0 to 100
  })]
}).then(files => {
  if (files.length <= 0) return;
  console.log(files.map(file => file.destinationPath));
  console.log('JPG Images optimized');
});
