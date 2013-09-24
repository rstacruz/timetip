require('../setup')

describe 'DefaultReporter dates', ->
  Reporter = require('../../lib/reporters/default')
  TimeLog = require('../../lib/time_log')

  {bold, mute, accent, red} = Reporter.theme

  beforeEach ->
    sinon.useFakeTimers +new Date(2013, 8, 23)

    @log = new TimeLog()
    @reporter = new Reporter(@log)

  describe '.day() today', ->
    beforeEach ->
      @data =
        date: new Date(2013, 8, 18)
        entries: [
          {
            type: 'task'
            date: new Date(2013, 8, 18, 4, 0)
            endDate: new Date(2013, 8, 18, 5, 25)
            duration: (1 + 26/60) * hours
            project: 'Work'
            task: 'thing'
          },
          {
            type: 'break'
            date: new Date(2013, 8, 18, 5, 25)
            endDate: new Date(2013, 8, 18, 5, 35)
            reason: 'poop'
            duration: (10/60) * hours
          }
        ]
        last:
          type: 'task'
          date: new Date(2013, 8, 18, 5, 35)
          project: 'Work'
          task: 'doodoo'
        summary:
          productive: (1 + 25/60) * hours

      @out = capture =>
        @reporter.day @data

      @lines = @out.split('\n')

    it 'line count', ->
      expect(@lines.length).eql 6

    describe 'heading', ->
      it 'summary', ->
        expect(@lines[1]).to.include '1h 25m'

      it 'summary (color)', ->
        expect(@lines[1]).to.include accent('1h 25m')

      it 'heading', ->
        expect(@lines[1]).to.include 'september 18 2013'

      it 'heading (color)', ->
        expect(@lines[1]).to.include accent('september 18 2013')

      it 'heading relative', ->
        expect(@lines[1]).to.include '5 days ago'

    describe 'work item', ->
      it 'name', ->
        expect(@lines[3]).to.include bold('Work')+' thing'

      it 'duration', ->
        expect(@lines[3]).to.include ''

    describe 'break', ->
      it 'reason', ->
        expect(@lines[4]).to.include 'poop'

      it 'duration', ->
        expect(@lines[4]).to.include '10m'
