# gypls

Recursively list all dependencies that have a gypfile

[![build status](https://circleci.com/gh/evanlucas/gypls.png?circle-token=5b7f8a83c905a2b42b48e29cbde08038066fd25b)](https://circleci.com/gh/evanlucas/gypls)

## Install

```bash
$ npm install -g gypls
```

## Cover

```bash
$ npm run cover
```

## Usage

```bash
$ cd <module>
$ gypls
```

## API

### gypls.read(dir, json, cb)

##### Params

- dir {String} the directory to recursively search
- json {Boolean} output in json
- cb {Function} `function(err, res)`

## License

MIT
