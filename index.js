var imagemin = require("imagemin"),    // The imagemin module.
  webp = require("imagemin-webp"),   // imagemin's WebP plugin.
  outputFolder = "images",            // Output folder
  PNGImages = "images/*.png",         // PNG images
  JPEGImages = "images/*.jpg";        // JPEG images

imagemin([PNGImages], {
  destination: outputFolder,
  plugins: [webp({
    lossless: true // Losslessly encode images
  })]
}).then(files => {
  if (files.length <= 0) return;
  console.log(files.map(file => file.destinationPath));
  console.log('PNG Images optimized');
});

imagemin([JPEGImages], {
  destination: outputFolder,
  plugins: [webp({
    quality: 65 // Quality setting from 0 to 100
  })]
}).then(files => {
  if (files.length <= 0) return;
  console.log(files.map(file => file.destinationPath));
  console.log('JPG Images optimized');
});
