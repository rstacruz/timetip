require './setup'

describe 'DateParser', ->
  DateParser = require('../lib/date_parser')

  beforeEach ->
    sinon.useFakeTimers +new Date(2011, 9, 15)

  it '2 days ago', ->
    expect(+DateParser('2 days ago')).eql(+new Date(2011, 9, 13))

  it '2d ago', ->
    expect(+DateParser('2d ago')).eql(+new Date(2011, 9, 13))
