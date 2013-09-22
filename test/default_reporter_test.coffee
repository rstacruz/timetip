require('./setup')

describe 'DefaultReporter', ->
  Reporter = require('../lib/reporters/default')
  TimeLog = require('../lib/time_log')

  bold = Reporter.theme.bold
  mute = Reporter.theme.mute
  red  = Reporter.theme.err

  beforeEach ->
    @log = new TimeLog()
    @reporter = new Reporter(@log)

  it 'sanity', ->
    expect(Reporter).be.function
    expect(@reporter.day).be.function
    expect(Reporter.description).be.string

  describe '.dates()', ->
    beforeEach ->
      @out = capture =>
        @reporter.dates [
          new Date(2013, 8, 17)
          new Date(2013, 8, 18)
          new Date(2013, 8, 19)
        ]

    it 'lines count', ->
      expect(@out.split('\n').length).eql 3

    it 'year heading', ->
      expect(@out).include '2013'

    it 'month', ->
      expect(@out).include 'sep'

    it 'dates', ->
      expect(@out).include bold('17')
      expect(@out).include bold('18')
      expect(@out).include bold('19')

    it 'dates (not)', ->
      expect(@out).not.include '21'
