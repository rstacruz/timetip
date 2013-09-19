require('./setup')

describe 'TimeLog.get()', ->
  TimeLog = require('../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15, 18, 0)
    @log = new TimeLog()

  beforeEach ->
    @log.raw =
      '2013-09-14 sat':
        '1:00pm': 'Things'
        '3:30pm': '-- coffee'
        '4:00pm': 'Work'
        '5:00pm': 'Etc'

      '2013-09-15 sun':
        '3:00pm': 'Work stuff'
        '3:30pm': '-- coffee'
        '4:00pm': 'Work make music'

  describe 'yesterday', ->
    beforeEach ->
      @day = @log.get('2013-09-14')

    it '.today', ->
      expect(@day.today).be.undefined

    it '.last.duration', ->
      expect(@day.last.duration).be.undefined

    it '.summary.productive', ->
      expect(@day.summary.productive).eql 3.5 * hours

  describe 'today', ->
    beforeEach ->
      @day = @log.get('2013-09-15')

    it '.today', ->
      expect(@day.today).be.true

    it '.last.duration', ->
      expect(@day.last.duration).eql 2 * hours

    it '.summary.productive', ->
      expect(@day.summary.productive).eql 2.5 * hours
