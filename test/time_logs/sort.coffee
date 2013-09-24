require('../setup')

describe 'TimeLog.sorting', ->
  TimeLog = require('../../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 15, 18, 0)
    @log = new TimeLog()

  beforeEach ->
    @log.raw =
      '2013-09-15 sun':
        '3:00pm': 'Work stuff'
        '3:30pm': '-- coffee --'
        '4:00pm': 'Work make music'

  it 'push into middle', ->
    @log.push
      type: 'task'
      project: 'Work'
      task: 'prepare'
      date: new Date(2013, 8, 15, 15, 45)

    expect(Object.keys(@log.raw['2013-09-15 sun'])).eql \
      [ '3:00pm', '3:30pm', '3:45pm', '4:00pm' ]

  it 'push into current', ->
    @log.push
      type: 'task'
      project: 'Work'
      task: 'new task'
      date: new Date(2013, 8, 15, 16, 0)

    data = @log.raw['2013-09-15 sun']
    expect(Object.keys(data)).eql \
      [ '3:00pm', '3:30pm', '4:00pm' ]

    expect(data['4:00pm']).eql \
      "Work new task"

  it 'push into end', ->
    @log.push
      type: 'task'
      project: 'Work'
      task: 'prepare'
      date: new Date(2013, 8, 15, 20, 0)

    expect(Object.keys(@log.raw['2013-09-15 sun'])).eql \
      [ '3:00pm', '3:30pm', '4:00pm', '8:00pm' ]
