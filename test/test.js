var should = require('should')
  , gyp = require('../')
  , path = require('path')
  , dir = path.join(__dirname, 'fixtures')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')

gyp.log.level = 'silent'

describe('gypls', function() {
  before(function() {
    rimraf.sync(path.join(dir, 'node_modules'))
    mkdirp.sync(path.join(dir, 'node_modules', 'test', 'node_modules', 'test_with_gypfile'))
    fs.writeFileSync(path.join(dir, 'node_modules', 'test', 'package.json'),
      JSON.stringify({
        name: 'test'
      , dependencies: {}
      , version: '0.0.0'
      }, null, 2))
    var p = path.join(dir, 'node_modules', 'test', 'node_modules',
      'test_with_gypfile', 'package.json')
    fs.writeFileSync(p, JSON.stringify({
      name: 'test_with_gypfile'
    , version: '0.1.0'
    , gypfile: true
    , dependencies: {}
    }, null, 2))
  })

  after(function() {
    rimraf.sync(path.join(dir, 'node_modules'))
  })
  describe('read', function() {
    it('should work with just a callback', function(done) {
      gyp.read(function(err, results) {
        if (err) return done(err)
        should.not.exist(results)
        done()
      })
    })

    it('should work with a dir', function(done) {
      gyp.read(dir, function(err, results) {
        if (err) return done(err)
        results.should.be.type('object')
        done()
      })
    })

    it('should work with json', function(done) {
      gyp.read(dir, true, function(err, results) {
        if (err) return done(err)
        should.exist(results)
        results.should.be.type('string').equal(
          '[\n  {\n    "name": "test_with_gypfile",\n    "path": '+
          '"node_modules/test/node_modules/test_with_gypfile"\n  }\n]'
        )
        done()
      })
    })
  })
})
