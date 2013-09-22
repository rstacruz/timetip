require('./setup')

describe 'DefaultReporter', ->
  Reporter = require('../lib/reporters/default')
  bold = Reporter.theme.bold
  mute = Reporter.theme.mute
  red  = Reporter.theme.err

  beforeEach ->
    @reporter = new Reporter()

  it 'sanity', ->
    expect(Reporter).be.function
    expect(@reporter.day).be.function
    expect(Reporter.description).be.string

  it '.day()', ->
    [out, err] = capture =>
      @reporter.day
        date: new Date(2013, 8, 18)
        entries: [
          {
            type: 'task'
            date: new Date(2013, 8, 18, 4, 0)
            endDate: new Date(2013, 8, 18, 5, 25)
          }
        ]
        summary:
          productive: (1 + 25/60) * 3600000

  describe '.dates()', ->
    beforeEach ->
      [@out, @err] = capture =>
        @reporter.dates [
          new Date(2013, 8, 17)
          new Date(2013, 8, 18)
          new Date(2013, 8, 19)
        ]

    it 'lines count', ->
      console.log @out
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
