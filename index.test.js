import dirTree from 'directory-tree';
import { unlinkSync, rmdirSync } from 'fs';
import { resolve as _resolve } from 'path';
import spawn from 'spawn-command';

const APP_ENTRY_PATH = require.resolve('./index');
const SAMPLE_DIRECTORY = 'sample-images';

const getInputImages = (dir = SAMPLE_DIRECTORY) => dirTree(dir, { extensions: /\.(png|jpg)/ });

const getOutputImages = (dir = SAMPLE_DIRECTORY) => dirTree(dir, { extensions: /\.webp/ });

const clearOutputs = (dir = SAMPLE_DIRECTORY) => {
  const outputImg = getOutputImages(dir);
  outputImg.children.forEach((img) => {
    unlinkSync(img.path);
  });
};

const runCLI = (args = '', cwd = process.cwd()) => {
  const isRelative = cwd[0] !== '/';
  let workingDir = cwd;
  if (isRelative) {
    workingDir = _resolve(__dirname, cwd);
  }

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const command = `${APP_ENTRY_PATH} ${args}`;
    const child = spawn(command, { cwd: workingDir });

    child.on('error', (error) => {
      reject(error);
    });

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', () => {
      if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

test('webpconvert --help', () => runCLI('--help').then((stdout) => {
  expect(stdout).toMatchSnapshot();
}));

describe('Convert Images', () => {
  beforeEach(() => {
    clearOutputs();
  });
  afterEach(() => {
    clearOutputs();
  });
  test('webpconvert | it convert images in current directory', async () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI('', SAMPLE_DIRECTORY).then((stdout) => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(4);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
    });
  });
  test('webpconvert sample-images | it convert images in specified directory', async () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI(SAMPLE_DIRECTORY).then((stdout) => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(4);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
    });
  });
  test('webpconvert sample-images output | it convert images from input directory to output directory', async () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages('output');
    expect(inputImg.children.length).toBe(4);
    expect(outputImg).toBe(null);
    return runCLI(`${SAMPLE_DIRECTORY} output`).then((stdout) => {
      outputImg = getOutputImages('output');
      expect(outputImg.children.length).toBe(4);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
    }).finally(() => {
      clearOutputs('output');
      rmdirSync('output');
    });
  });
  test('webpconvert sample-images/KittenJPG.jpg | it convert a single image file', async () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI(`${SAMPLE_DIRECTORY}/KittenJPG.jpg`).then((stdout) => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(1);
      expect(stdout.match(/Minified 1 image/g)).toHaveLength(1);
    });
  });
  test('webpconvert sample-images/KittenPNG.jpg | it convert a single image file with quality 50', async () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI(`${SAMPLE_DIRECTORY}/KittenPNG.png -q 50`).then((stdout) => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(1);
      expect(stdout.match(/Minified 1 image/g)).toHaveLength(1);
    });
  });
  test('webpconvert sample-images/KittenPNG.jpg | it convert a single image file with prefix and suffix', async () => {
    const inputImg = getInputImages();
    let outputImg = getOutputImages();
    expect(inputImg.children.length).toBe(4);
    expect(outputImg.children.length).toBe(0);
    return runCLI(`${SAMPLE_DIRECTORY}/KittenPNG.png --prefix="img-" --suffix="-compressed"`).then((stdout) => {
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(1);
      expect(outputImg.children[0].name).toMatch('img-KittenPNG-compressed.png.webp');
      expect(stdout.match(/Minified 1 image/g)).toHaveLength(1);
    });
  });
});
