require('./setup')

describe 'DefaultReporter', ->
  Reporter = require('../lib/reporters/default')

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
            date: new Date(2013, 8, 18, 4, 0)
          }
        ]
        summary:
          productive: 1 * 3600000

  describe '.dates()', ->
    beforeEach ->
      [@out, @err] = capture =>
        @reporter.dates [
          new Date(2013, 8, 18)
          new Date(2013, 8, 19)
          new Date(2013, 8, 20)
        ]

    it 'lines count', ->
      expect(@out.split('\n').length).eql 3

    it 'year heading', ->
      expect(@out).include '2013'

    it 'month', ->
      expect(@out).include 'sep'

    it 'dates', ->
      expect(@out).include '18'
      expect(@out).include '19'
      expect(@out).include '20'

    it 'dates (not)', ->
      expect(@out).not.include '21'
