var imagemin = require("imagemin"),    // The imagemin module.
  webp = require("imagemin-webp"),   // imagemin's WebP plugin.
  outputFolder = "images",            // Output folder
  PNGImages = "images/*.png",         // PNG images
  JPEGImages = "images/*.jpg";        // JPEG images

imagemin([PNGImages], outputFolder, {
  plugins: [webp({
    lossless: true // Losslessly encode images
  })]
}).then(() => {
  console.log('PNG Images optimized');
});

imagemin([JPEGImages], outputFolder, {
  plugins: [webp({
    quality: 65 // Quality setting from 0 to 100
  })]
}).then(() => {
  console.log('JPG Images optimized');
});
