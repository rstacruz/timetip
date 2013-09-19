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
        type: "task"
        date: new Date(2010, 9, 15, 3, 0)
        project: "test"
        task: "hello"

      expect(@log.toString().trim()).eql '''
      [2010-10-15 fri]
      3:00am = test hello
      '''

    it 'push() of break', ->
      @log.push
        type: "break"
        date: new Date(2010, 9, 15, 3, 0)

      expect(@log.toString().trim()).eql '''
      [2010-10-15 fri]
      3:00am = --
      '''

    it 'push() of break with reason', ->
      @log.push
        type: "break"
        date: new Date(2010, 9, 15, 3, 0)
        reason: "coffee"

      expect(@log.toString().trim()).eql '''
      [2010-10-15 fri]
      3:00am = -- coffee --
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
        '2013-09-16 mon': {}
        '2013-09-17 tue':
          '4:00pm': '--'
        '2013-09-18 wed':
          '3:14pm': 'Work stuff'
          '3:24pm': '-- coffee --'
          '3:34pm': 'Work make music'

    it '.dates()', ->
      dates = @log.dates()

      expect(dates.length).eql 3
      expect(dates[1]).eql new Date(2013, 8, 17)
      expect(dates[2]).eql new Date(2013, 8, 18)

    describe '.get() - nonexistent', ->
      beforeEach ->
        @data = @log.get(new Date(2013, 8, 1))

      it 'null', ->
        expect(@data).eql null

    describe '.get() - empty', ->
      beforeEach ->
        @data = @log.get(new Date(2013, 8, 16))

      it '.date', ->
        expect(@data.date).eql new Date(2013, 8, 16)

      it '.entries.length', ->
        expect(@data.entries.length).eql 0

      it '.last', ->
        expect(@data.last).eql null

    describe '.get() - one item', ->
      beforeEach ->
        @data = @log.get(new Date(2013, 8, 17))

      it '.date', ->
        expect(@data.date).eql new Date(2013, 8, 17)

      it '.entries.length', ->
        expect(@data.entries.length).eql 0

      it '.last', ->
        expect(@data.last).eql
          type: 'break'
          reason: null
          date: Date.create('2013-09-17 4:00pm')

    describe '.get() - correct', ->
      beforeEach ->
        @data = @log.get(new Date(2013, 8, 18))

      it '.date', ->
        expect(@data.date).eql new Date(2013, 8, 18)

      it '.entries.length', ->
        expect(@data.entries.length).eql 2

      it '.entries[0]', ->
        expect(@data.entries[0]).eql
          type: 'task'
          project: 'Work'
          task: 'stuff'
          date: Date.create('2013-09-18 3:14pm')
          duration: 10 * 60000
          endDate: Date.create('2013-09-18 3:24pm')

      it '.entries[1]', ->
        expect(@data.entries[1]).eql
          type: 'break'
          reason: 'coffee'
          date: Date.create('2013-09-18 3:24pm')
          duration: 10 * 60000
          endDate: Date.create('2013-09-18 3:34pm')

      it '.last', ->
        expect(@data.last).eql
          type: 'task'
          project: 'Work'
          task: 'make music'
          date: Date.create('2013-09-18 3:34pm')

    it.skip '.day() - skip invalid entries'

  describe 'summaries', ->
    beforeEach ->
      @log.raw =
        '#': {}
        '2013-09-18 wed':
          '3:00pm': 'Work stuff'
          '5:00pm': '-- coffee --'
          '5:30pm': 'Work stuff'
          '6:30pm': '-- dinner --'

      @s = @log.get(new Date(2013, 8, 18)).summary

    it '.summary.productive', ->
      expect(@s.productive).eql 3 * 3600000

    it '.summary.total', ->
      expect(@s.total).eql 3.5 * 3600000
