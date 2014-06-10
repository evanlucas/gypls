var should = require('should')
  , gyp = require('../')
  , path = require('path')
  , dir = path.join(__dirname, 'fixtures')

gyp.log.level = 'silent'

describe('gypls', function() {
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
