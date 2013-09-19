require('./setup')

describe 'TimeLog', ->
  TimeLog = require('../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15, 18, 0)
    @log = new TimeLog()

  describe 'reading', ->
    beforeEach ->
      @log.raw =
        '#': {}
        '2013-09-16 mon': {}
        '2013-09-17 tue':
          '4:00pm': '--'
        '2013-09-18 wed':
          '3:14pm': 'Work stuff'
          '3:24pm': '-- coffee'
          '3:34pm': 'Work make music'

    it '.dates()', ->
      dates = @log.dates()

      expect(dates.length).eql 3
      expect(dates[1]).eql new Date(2013, 8, 17)
      expect(dates[2]).eql new Date(2013, 8, 18)

    describe '.get() scenarios', ->
      it 'non-existent', ->
        @data = @log.get(new Date(2013, 8, 1))
        expect(@data).eql null

      it 'invalid', ->
        assert.throws =>
          @log.get(new Date('a'))

      it 'string', ->
        @data = @log.get('2013-09-18')
        expect(@data.date).eql new Date(2013, 8, 18)

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
