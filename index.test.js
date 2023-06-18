import dirTree from 'directory-tree';
import { unlink, rm } from 'fs/promises';
import { resolve as _resolve } from 'path';
import spawn from 'spawn-command';

const APP_ENTRY_PATH = require.resolve('./index');
const SAMPLE_DIRECTORY = 'sample-images';

const getInputImages = (dir = SAMPLE_DIRECTORY) => dirTree(dir, { extensions: /\.(png|jpg)/ });

const getOutputImages = (dir = SAMPLE_DIRECTORY) => dirTree(dir, { extensions: /\.webp/ });

const removeFiles = async (dirTreeObj) => {
  if (!('children' in dirTreeObj)) {
    await unlink(dirTreeObj.path);
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const child of dirTreeObj.children) {
      if (!('children' in child)) {
        await unlink(child.path);
      } else {
        await removeFiles(child);
      }
    }
  }
};

const clearOutputs = async (dir = SAMPLE_DIRECTORY) => {
  const outputImg = getOutputImages(dir);
  await removeFiles(outputImg);
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

test('webpconvert --help', async () => {
  const stdout = await runCLI('--help');
  expect(stdout).toMatchSnapshot();
});

describe('Convert Images', () => {
  beforeEach(async () => {
    await clearOutputs();
  });
  afterEach(async () => {
    await clearOutputs();
  });
  describe('Directory', () => {
    test('webpconvert | it convert images in current directory', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages();
      expect(inputImg.children.length).toBe(5);
      expect(outputImg.children.length).toBe(1);
      const stdout = await runCLI('', SAMPLE_DIRECTORY);
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(5);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
    });
    test('webpconvert sample-images | it convert images in specified directory', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages();
      expect(inputImg.children.length).toBe(5);
      expect(outputImg.children.length).toBe(1);
      const stdout = await runCLI(SAMPLE_DIRECTORY);
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(5);
      expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
    });
    test('webpconvert sample-images output | it convert images from input directory to output directory', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages('output');
      expect(inputImg.children.length).toBe(5);
      expect(outputImg).toBe(null);
      try {
        const stdout = await runCLI(`${SAMPLE_DIRECTORY} output`);
        outputImg = getOutputImages('output');
        expect(outputImg.children.length).toBe(4);
        expect(stdout.match(/Minified 2 images/g)).toHaveLength(2);
      } finally {
        await clearOutputs('output');
        await rm('output', { recursive: true, force: true });
      }
    });
  });
  describe('Directory Recursive', () => {
    test('webpconvert -r | it convert images in current directory', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages();
      expect(inputImg.children.length).toBe(5);
      expect(outputImg.children.length).toBe(1);
      const stdout = await runCLI('-r', SAMPLE_DIRECTORY);
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(5);
      expect(stdout.match(/Minified 4 images/g)).toHaveLength(2);
    });
    test('webpconvert -r sample-images | it convert images in specified directory', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages();
      expect(inputImg.children.length).toBe(5);
      expect(outputImg.children.length).toBe(1);
      const stdout = await runCLI(`-r ${SAMPLE_DIRECTORY}`);
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(5);
      expect(stdout.match(/Minified 4 images/g)).toHaveLength(2);
    });
    test('webpconvert -r sample-images output | it convert images from input directory to output directory', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages('output');
      expect(inputImg.children.length).toBe(5);
      expect(outputImg).toBe(null);
      try {
        const stdout = await runCLI(`-r ${SAMPLE_DIRECTORY} output`);
        outputImg = getOutputImages('output');
        expect(outputImg.children.length).toBe(5);
        expect(stdout.match(/Minified 4 images/g)).toHaveLength(2);
      } finally {
        await clearOutputs('output');
        await rm('output', { recursive: true, force: true });
      }
    });
  });
  describe('File', () => {
    test('webpconvert sample-images/KittenJPG.jpg | it convert a single image file', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages();
      expect(inputImg.children.length).toBe(5);
      expect(outputImg.children.length).toBe(1);
      const stdout = await runCLI(`${SAMPLE_DIRECTORY}/KittenJPG.jpg`);
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(2);
      expect(stdout.match(/Minified 1 image/g)).toHaveLength(1);
    });
    test('webpconvert sample-images/KittenPNG.jpg | it convert a single image file with quality 50', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages();
      expect(inputImg.children.length).toBe(5);
      expect(outputImg.children.length).toBe(1);
      const stdout = await runCLI(`${SAMPLE_DIRECTORY}/KittenPNG.png -q 50`);
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(2);
      expect(stdout.match(/Minified 1 image/g)).toHaveLength(1);
    });
    test('webpconvert sample-images/KittenPNG.jpg | it convert a single image file with prefix and suffix', async () => {
      const inputImg = getInputImages();
      let outputImg = getOutputImages();
      expect(inputImg.children.length).toBe(5);
      expect(outputImg.children.length).toBe(1);
      const stdout = await runCLI(`${SAMPLE_DIRECTORY}/KittenPNG.png --prefix="img-" --suffix="-compressed"`);
      outputImg = getOutputImages();
      expect(outputImg.children.length).toBe(2);
      expect(outputImg.children[1].name).toMatch('img-KittenPNG-compressed.png.webp');
      expect(stdout.match(/Minified 1 image/g)).toHaveLength(1);
    });
  });
});
