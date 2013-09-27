require('../setup')

describe 'TimeLog dates', ->
  TimeLog = require('../../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15, 18, 0)
    @log = new TimeLog()

  beforeEach ->
    @tue = new Date(2013, 8, 10)
    @wed = new Date(2013, 8, 11)
    @thu = new Date(2013, 8, 12)
    @fri = new Date(2013, 8, 13)
    @sat = new Date(2013, 8, 14)
    @sun = new Date(2013, 8, 15)

    @log.raw =
      '2013-09-12 thu':
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

  describe '.dates()', ->
    it 'dates', ->
      dates = @log.dates()
      expect(dates).eql [@thu, @fri, @sat]

  describe '.dates() with range', ->
    it '1', ->
      dates = @log.dates([@fri, @sat])
      expect(dates).eql [@fri, @sat]

    it '2' ,->
      dates = @log.dates([@fri, @sun])
      expect(dates).eql [@fri, @sat]

    it 'matches one', ->
      dates = @log.dates([@tue, @thu])
      expect(dates).eql [@thu]

    it 'matches none', ->
      dates = @log.dates([@mon, @tue])
      expect(dates).eql []

  describe '.dates() single date', ->
    it 'present', ->
      dates = @log.dates(@fri)
      expect(dates).eql [@fri]

    it 'absent', ->
      dates = @log.dates(@sun)
      expect(dates).eql []
