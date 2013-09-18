require('./setup')

describe 'TimeLog', ->
  TimeLog = require('../lib/time_log')

  beforeEach ->
    sinon.useFakeTimers +new Date(2010, 9, 15)

  beforeEach ->
    @log = new TimeLog()

  it 'sanity', ->
    expect(@log.raw).eql {}

  it 'toString() empty', ->
    expect(@log.toString()).eql ''

  it 'toString() with raw', ->
    @log.raw = {a: b: 'c'}
    expect(@log.toString().trim()).eql '''
    [a]
    b = c
    '''

  it 'push() of task', ->
    @log.push
      date: new Date(2010, 9, 15, 3, 0)
      project: "test"
      task: "hello"

    expect(@log.toString().trim()).eql '''
    [2010-10-15 fri]
    3:00am = test: hello
    '''
