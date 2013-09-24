require('../setup')

describe 'TimeLog formats', ->
  TimeLog = require('../../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15, 18, 0)
    @log = new TimeLog()

  describe '.format()', ->
    it '.format(date)', ->
      d = @log.format(new Date(2013, 2, 4), 'date')
      expect(d).eql '2013-03-04 mon'

    it '.format(time)', ->
      d = @log.format(new Date(2013, 2, 4, 15, 20), 'time')
      expect(d).eql '3:20pm'

  describe '.parseDate()', ->
    it 'date', ->
      d = @log.parseDate('2013-03-04 mon')
      expect(d).eql new Date(2013, 2, 4)

    it 'time, date', ->
      d = @log.parseDate('3:20pm', new Date(2013, 2, 4))
      expect(d).eql new Date(2013, 2, 4, 15, 20)

    it 'invalid time', ->
      d = @log.parseDate('#')
      expect(d).eql null

    it 'invalid time, date', ->
      d = @log.parseDate('#', new Date(2013, 2, 4))
      expect(d).eql null

