require('./setup')

describe 'TimeLog basics', ->
  TimeLog = require('../lib/time_log')

  beforeEach ->
    @log = new TimeLog()

  describe 'toString()', ->
    it 'empty', ->
      expect(@log.toString()).eql ''

    it 'with raw', ->
      @log.raw = {a: b: 'c'}
      expect(@log.toString().trim()).eql '''
      [a]
      b = c
      '''

