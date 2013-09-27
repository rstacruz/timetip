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
        '6:00pm': '-'

      '2013-09-14 sat':
        '3:00pm': 'Work stuff'
        '3:30pm': '-- coffee'
        '4:00pm': 'Work make music'

  beforeEach ->
    @summary = Summarize(@log.range())
  
  # it 'debug', -> console.log(@summary)

  it 'project names', ->
    projects = Object.keys(@summary.projects)
    expect(projects).eql \
      [ 'Things', 'Work', 'Etc' ]

  it 'project total duration', ->
    expect(@summary.projects["Things"].duration).eql 4.5*hours
    expect(@summary.projects["Work"].duration).eql 1.5*hours
    expect(@summary.projects["Etc"].duration).eql 1.0*hours

  it 'project total days', ->
    expect(@summary.projects["Things"].days).eql 3
    expect(@summary.projects["Work"].days).eql 2
    expect(@summary.projects["Etc"].days).eql 1
