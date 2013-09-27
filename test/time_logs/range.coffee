require('../setup')

describe 'TimeLog range', ->
  TimeLog = require('../../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15)
    @mon = new Date(2013, 8, 9)
    @tue = new Date(2013, 8, 10)
    @wed = new Date(2013, 8, 11)
    @thu = new Date(2013, 8, 12)
    @fri = new Date(2013, 8, 13)
    @sat = new Date(2013, 8, 14)
    @sun = new Date(2013, 8, 15)

  beforeEach ->
    @log = new TimeLog()
    @log.raw =
      '2013-09-09 mon':
        '1:00pm': 'Things'
        '2:00pm': '-'

      '2013-09-11 wed':
        '1:00pm': 'Things'
        '2:00pm': '-'

      '2013-09-13 fri':
        '1:00pm': 'Things'
        '3:30pm': '-- coffee'
        '4:00pm': 'Work'
        '5:00pm': 'Etc'

      '2013-09-14 sat':
        '3:00pm': 'Work stuff'
        '3:30pm': '-- coffee'
        '4:00pm': 'Work make music'

  describe 'range(dates)', ->
    beforeEach ->
      @data = @log.range([@wed, @sat])

    it '.range start', ->
      expect(@data.range[0]).eql @wed

    it '.range end', ->
      expect(@data.range[1]).eql @sat

    it '.dates length', ->
      expect(@data.dates.length).eql 3

    it '.dates dates', ->
      dates = @data.dates.map (d) -> d.date
      expect(dates).eql [@wed, @fri, @sat]

  describe 'range(date) present', ->
    beforeEach ->
      @data = @log.range(@wed)

    it 'length', ->
      expect(@data.dates.length).eql 1

    it 'date', ->
      expect(@data.dates[0].date).eql @wed

  describe 'range() all', ->
    beforeEach ->
      @data = @log.range()

    it '.dates length', ->
      expect(@data.dates.length).eql 4

    it '.dates dates', ->
      dates = @data.dates.map (d) -> d.date
      expect(dates).eql [@mon, @wed, @fri, @sat]

