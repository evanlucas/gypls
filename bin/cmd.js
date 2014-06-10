#!/usr/bin/env node

var fs = require('fs')
  , log = require('npmlog')
  , archy = require('archy')
  , nopt = require('nopt')
  , knownOpts = { loglevel: ['verbose', 'info', 'error', 'silent']
                , help: Boolean
                , version: Boolean
                , json: Boolean
                }
  , shortHand = { verbose: ['--loglevel', 'verbose']
                , silent: ['--loglevel', 'silent']
                , h: ['--help']
                , v: ['--version']
                , l: ['--loglevel']
                , j: ['--json']
                }
  , parsed = nopt(knownOpts, shortHand)

var gypls = require('../')

log.heading = 'gypls'

if (parsed.loglevel) gypls.log.level = parsed.loglevel

if (parsed.help) {
  usage(0)
  return
}

if (parsed.version) {
  console.log('gypls', 'v'+require('../package').version)
  return
}

var dir = parsed.argv.remain.shift() || process.cwd()

gypls.read(dir, parsed.json, function(err, results) {
  if (err) {
    log.error('[read]', err)
    process.exit(1)
  }
  if (!results) {
    if (parsed.json) console.log(results)
    else log.info('[read]', 'no dependencies contain gypfiles')
  } else {
    if (parsed.json) console.log(results)
    else {
      console.log()
      console.log(archy(results))
    }
  }
})

function usage(code) {
  var rs = fs.createReadStream(__dirname + '/usage.txt')
  rs.pipe(process.stdout)
  rs.on('close', function() {
    if (code) process.exit(code)
  })
}
