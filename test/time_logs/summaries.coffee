require('../setup')

describe 'TimeLog summaries', ->
  TimeLog = require('../../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15, 18, 0)
    @log = new TimeLog()
    @log.raw =
      '2013-09-18 wed':
        '3:00pm': 'Work stuff'
        '5:00pm': '-- coffee --'
        '5:30pm': 'Work stuff'
        '6:30pm': '-- dinner --'

    @s = @log.get(new Date(2013, 8, 18)).summary

  it '.summary.productive', ->
    expect(@s.productive).eql 3 * hours

  it '.summary.total', ->
    expect(@s.total).eql 3.5 * hours
