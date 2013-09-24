require '../setup'

describe 'DateParser', ->
  DateParser = require('../../lib/date_parser')

  beforeEach ->
    sinon.useFakeTimers +new Date(2011, 9, 15)

  describe 'dates', ->
    it '2 days ago', ->
      expect(+DateParser.any('2 days ago')).eql(+new Date(2011, 9, 13))

    it '2d ago', ->
      expect(+DateParser.any('2d ago')).eql(+new Date(2011, 9, 13))

  describe 'range', ->
    it 'since 2 days ago', ->
      expect(DateParser.any('since 2 days ago')).eql \
        [ new Date(2011, 9, 13), new Date(2011, 9, 15) ]

    it '2 days ago - now', ->
      expect(DateParser.any('2 days ago - now')).eql \
        [ new Date(2011, 9, 13), new Date(2011, 9, 15) ]
