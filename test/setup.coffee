global.chai = require('chai')
global.assert = chai.assert
global.expect = chai.expect
chai.should()

beforeEach -> global.sinon = require('sinon').sandbox.create()
afterEach  -> global.sinon.restore()

global.hours = 3600000

global.capture = (fn) ->
  out = ''
  err = ''
  sinon.stub console, 'log',   (s) => out += "#{s}\n"
  sinon.stub console, 'error', (s) => err += "#{s}\n"
  try
    fn()
    return [out, err]
  finally
    console.log.restore()
    console.error.restore()
