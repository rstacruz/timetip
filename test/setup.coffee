global.chai = require('chai')
global.assert = chai.assert
global.expect = chai.expect
chai.should()

beforeEach -> global.sinon = require('sinon').sandbox.create()
afterEach  -> global.sinon.restore()

global.hours = 3600000

global.capture = (fn) ->
  out = ''
  aspect = 'log'
  sinon.stub console, aspect, (s) => out += "#{s}\n"
  try
    fn()
    return out
  finally
    console[aspect].restore()
