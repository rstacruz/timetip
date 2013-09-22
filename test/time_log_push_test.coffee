require('./setup')

describe 'TimeLog.push', ->
  TimeLog = require('../lib/time_log')

  beforeEach ->
    @log = new TimeLog()

  it 'push() of task', ->
    @log.push
      type: "task"
      date: new Date(2013, 9, 15, 3, 0)
      project: "test"
      task: "hello"

    expect(@log.toString().trim()).eql '''
    [2013-10-15 tue]
    3:00am = test hello
    '''

  it 'push() of break', ->
    @log.push
      type: "break"
      date: new Date(2013, 9, 15, 3, 0)

    expect(@log.toString().trim()).eql '''
    [2013-10-15 tue]
    3:00am = -
    '''

  it 'push() of break with reason', ->
    @log.push
      type: "break"
      date: new Date(2013, 9, 15, 3, 0)
      reason: "coffee"

    expect(@log.toString().trim()).eql '''
    [2013-10-15 tue]
    3:00am = -- coffee
    '''

