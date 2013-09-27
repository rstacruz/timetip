require('../setup')

describe 'TimeLog range', ->
  TimeLog = require('../../lib/time_log')
  Summarize = require('../../lib/summarize')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15)

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

  beforeEach ->
    @summary = Summarize(@log.range())
