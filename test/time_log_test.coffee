require('./setup')

describe 'TimeLog', ->
  TimeLog = require('../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2010, 9, 15)

  beforeEach ->
    @log = new TimeLog()

  describe 'sanity checks', ->
    it '.raw', ->
      expect(@log.raw).eql {}

  describe 'toString()', ->
    it 'empty', ->
      expect(@log.toString()).eql ''

    it 'with raw', ->
      @log.raw = {a: b: 'c'}
      expect(@log.toString().trim()).eql '''
      [a]
      b = c
      '''
  describe 'writing', ->
    it 'push() of task', ->
      @log.push
        date: new Date(2010, 9, 15, 3, 0)
        project: "test"
        task: "hello"

      expect(@log.toString().trim()).eql '''
      [2010-10-15 fri]
      3:00am = test: hello
      '''

  describe '.format()', ->
    it '.format(date)', ->
      d = @log.format(new Date(2013, 2, 4), 'date')
      expect(d).eql '2013-03-04 mon'

    it '.format(time)', ->
      d = @log.format(new Date(2013, 2, 4, 15, 20), 'time')
      expect(d).eql '3:20pm'

  describe '.parse()', ->
    it '.parse(date)', ->
      d = @log.parse('2013-03-04 mon')
      expect(d).eql new Date(2013, 2, 4)

    it '.parse(time, date)', ->
      d = @log.parse('3:20pm', new Date(2013, 2, 4))
      expect(d).eql new Date(2013, 2, 4, 15, 20)

  describe 'reading', ->
    beforeEach ->
      @log.raw =
        '#': {}
        '2013-09-17 tue':
          '4:00pm': '--'
        '2013-09-18 wed':
          '3:14pm': 'Work: stuff'
          '3:24pm': '-- coffee --'
          '3:34pm': 'Work: make music'

    it '.dates()', ->
      dates = @log.dates()

      expect(dates.length).eql 2
      expect(dates[0]).eql new Date(2013, 8, 17)
      expect(dates[1]).eql new Date(2013, 8, 18)

    it '.day() - non-existent', ->
      entries = @log.day(new Date(2013, 8, 1))
      expect(entries).eql []

    it '.day() - last day', ->
      entries = @log.day()

      expect(entries[0]).eql
        type: 'task'
        project: 'Work'
        task: 'stuff'
        date: Date.create('2013-09-18 3:14pm')
        duration: 10 * 60000
        endDate: Date.create('2013-09-18 3:24pm')

      expect(entries[1]).eql
        type: 'break'
        break: 'coffee'
        date: Date.create('2013-09-18 3:24pm')
        duration: 10 * 60000
        endDate: Date.create('2013-09-18 3:34pm')

    it '.now()', ->
      expect(@log.now()).eql
        type: 'task'
        project: 'Work'
        task: 'make music'
        date: Date.create('2013-09-18 3:34pm')

    it '.now(Date)', ->
      expect(@log.now(Date.create('2013-09-17'))).eql
        type: 'break'
        break: null
        date: Date.create('2013-09-17 4:00pm')

    it.skip '.day() - skip invalid entries'


