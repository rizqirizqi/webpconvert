const dirTree = require("directory-tree");
const fs = require('fs');
const path = require('path');
const spawn = require('spawn-command');

const APP_ENTRY_PATH = require.resolve('./index');
const SAMPLE_DIRECTORY = 'sample-images';

test('webpconvert --help', () => {
  return runCLI('--help').then(stdout => {
    expect(stdout).toMatchSnapshot()
  });
});

describe('Convert Images', () => {
  beforeEach(() => {
    clearOutputs();
  });
  afterEach(() => {
    clearOutputs();
  });
  test('webpconvert | it convert images in current directory', () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI('', SAMPLE_DIRECTORY).then(stdout => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(4);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
    })
  });
  test('webpconvert sample-images | it convert images in specified directory', () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI(SAMPLE_DIRECTORY).then(stdout => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(4);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
    })
  });
  test('webpconvert sample-images output | it convert images from input directory to output directory', () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages('output');
    expect(inputImg.children.length).toBe(4);
    expect(outputImg).toBe(null);
    return runCLI(`${SAMPLE_DIRECTORY} output`).then(stdout => {
      outputImg = getOutputImages('output');
      expect(outputImg.children.length).toBe(4);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
      clearOutputs('output');
      fs.rmdirSync('output');
    })
  });
  test('webpconvert sample-images/KittenJPG.jpg | it convert a single image file', () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI(`${SAMPLE_DIRECTORY}/KittenJPG.jpg`).then(stdout => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(1);
      expect(stdout.match(/Minified 1 image/g)).toHaveLength(1);
    })
  });
});

const clearOutputs = (dir = SAMPLE_DIRECTORY) => {
  const outputImg = getOutputImages(dir);
  for (img of outputImg.children) {
    fs.unlinkSync(img.path);
  }
}

const getInputImages = (dir = SAMPLE_DIRECTORY,) => {
  return dirTree(dir, { extensions: /\.(png|jpg)/ });
}

const getOutputImages = (dir = SAMPLE_DIRECTORY,) => {
  return dirTree(dir, { extensions: /\.webp/ });
}

const runCLI = (args = '', cwd = process.cwd()) => {
  const isRelative = cwd[0] !== '/'
  if (isRelative) {
    cwd = path.resolve(__dirname, cwd)
  }

  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    const command = `${APP_ENTRY_PATH} ${args}`
    const child = spawn(command, {cwd})

    child.on('error', error => {
      reject(error)
    })

    child.stdout.on('data', data => {
      stdout += data.toString()
    })

    child.stderr.on('data', data => {
      stderr += data.toString()
    })

    child.on('close', () => {
      if (stderr) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}
