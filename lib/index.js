var readdirp = require('readdirp')
  , path = require('path')
  , fs = require('fs')
  , chalk = require('chalk')
  , log = require('npmlog')
  , gypls = exports

gypls.log = log

/**
 * Reads the given _dir_ looking for gypfiles
 *
 * @param {String} dir The directory path (optional)
 * @param {Boolean} json Return json (optional)
 * @param {Function} cb function(err, res)
 * @api public
 */
gypls.read = function(dir, json, cb) {
  if ('function' === typeof dir) cb = dir, dir = process.cwd(), json = false
  if ('function' === typeof json) cb = json, json = false
  var data = []
  var pkg = {}
  try {
    pkg = require(dir + '/package.json')
  }
  catch (err) {
    // no package.json
  }
  if (!json)
    log.info('[scan]', dir)
  readdirp({
    root: dir
  , fileFilter: ['*package.json']
  , lstat: true
  , directoryFilter: function(d) {
      return d.name === 'node_modules' ||
        d.parentDir.split('/').pop() === 'node_modules'
    }
  })
  .on('error', function(err) {
    return cb && cb(err)
  })
  .on('data', function(entry) {
    var fp = entry.fullPath
    var f = require(fp)
    var mod = entry.parentDir.split('/').pop()
    if (f.gypfile) {
      log.verbose('[gypfile]', chalk.yellow(mod), 'in', chalk.grey(entry.parentDir))
      data.push({
        name: mod
      , path: entry.parentDir
      })
    }
  })
  .on('end', function() {
    var out = data.reduce(function(set, item) {
      var mod = item.name
      var parent = item.path
      parent = parent.replace(/node_modules\//g, '')
      var parents = parent.split('/')
      var root = parents.shift()
      if (root) {
        set[root] = {}
      }
      var t = set[root]
      var last
      while (i = parents.shift()) {
        t[i] = {}
        t = t[i]
      }
      return set
    }, {})
    if (!Object.keys(out).length) {
      if (json) return cb && cb(null, JSON.stringify([], null, 2))
      return cb && cb()
    }
    if (json) return cb && cb(null, JSON.stringify(data, null, 2))
    cb && cb(null, fixup(out, pkg.name))
  })
}

function fixup(data, label) {
  var out = {
    label: label || ''
  }
  out.nodes = Object.keys(data).map(function(d) {
    return fixup(data[d], d)
  })
  if (!out.nodes.length) {
    out.label = chalk.green(out.label)
  }
  return out
}
