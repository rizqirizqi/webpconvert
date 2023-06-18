# WebpConvert

CLI Converter from png/jpg images to webp

[![Build Status][build-badge]][build-url]
[![version][version-badge]][version-url]
[![downloads][downloads-badge]][downloads-url]
[![MIT License][license-badge]][license-url]

[![contributions welcome][contrib-badge]][contrib-url]
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## Usage
1. Install webpconvert
   ```bash
   npm install -g webpconvert
   ```
2. Run this command
   ```bash
   webpconvert [source] [target] [options]

   # Example
   webpconvert
   webpconvert sample-images
   webpconvert sample-images -q 50
   webpconvert sample-images output
   webpconvert sample-images -m
   webpconvert sample-images/KittenJPG.jpg
   ```

### Help
```bash
webpconvert --help
```

### Use npx for one time usage
```bash
npx webpconvert [source] [target] [options]
```

### Options

| Option | Option alias | Description                                                                                           | Type    | Default |
|--------|--------------|-------------------------------------------------------------------------------------------------------|---------|---------|
| -p     | --prefix     | Specify the prefix of output filename.                                                                | string  | ""      |
| -s     | --suffix     | Specify the suffix of output filename.                                                                | string  | ""      |
| -q     | --quality    | Specify the quality of webp image. Lower values yield better compression but the least image quality. | number  | 80      |
| -r     | --recursive  | Include files in sub-folders. Will be ignored if the [source] is a file.                              | boolean |         |
| -m     | --mute       | Disable output messages.                                                                              | boolean |         |
| -h     | --help       | Show help.                                                                                            | boolean |         |
| -v     | --version    | Show version number.                                                                                  | boolean |         |

## Contributing
1. Fork this repo
2. Develop
3. Create pull request
4. Tag [@rizqirizqi](https://github.com/rizqirizqi) for review
5. Merge~~

### Start
```
yarn start [source] [target] [options]
```

### Test
```
# Run test:
yarn test
# Update snapshot files:
yarn test -u
```

### Lint
```
yarn lint
```

## License

MIT

[build-badge]: https://img.shields.io/github/actions/workflow/status/rizqirizqi/webpconvert/.github/workflows/test.yml?branch=master&style=flat-square
[build-url]: https://github.com/rizqirizqi/webpconvert/actions
[version-badge]: https://img.shields.io/npm/v/webpconvert.svg?style=flat-square
[version-url]: https://www.npmjs.com/package/webpconvert
[downloads-badge]: https://img.shields.io/npm/dm/webpconvert.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=webpconvert&from=2019-01-01
[license-badge]: https://img.shields.io/npm/l/webpconvert.svg?style=flat-square
[license-url]: https://github.com/rizqirizqi/webpconvert/blob/master/LICENSE

[contrib-badge]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square
[contrib-url]: https://github.com/rizqirizqi/webpconvert/issues
[github-watch-badge]: https://img.shields.io/github/watchers/rizqirizqi/webpconvert.svg?style=social
[github-watch]: https://github.com/rizqirizqi/webpconvert/watchers
[github-star-badge]: https://img.shields.io/github/stars/rizqirizqi/webpconvert.svg?style=social
[github-star]: https://github.com/rizqirizqi/webpconvert/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20this%20CLI%20converter%20from%20png%2Fjpg%20images%20to%20webp!%20https%3A%2F%2Fgithub.com%2Frizqirizqi%2Fwebpconvert
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/rizqirizqi/webpconvert.svg?style=social
