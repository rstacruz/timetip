require('./setup')

describe 'SpecParser', ->
  SpecParser = require('../lib/spec_parser')

  it 'project', ->
    expect(SpecParser('hello')).eql
      project: 'hello'
      task: null

  it 'project and task', ->
    expect(SpecParser('hello world')).eql
      project: 'hello'
      task: 'world'

  it 'empty', ->
    expect(SpecParser('')).be.undefined


describe 'DateParser', ->
  DateParser = require('../lib/date_parser')

  beforeEach ->
    sinon.useFakeTimers +new Date(2011, 9, 15)

  it '2 days ago', ->
    expect(+DateParser('2 days ago')).eql(+new Date(2011, 9, 13))
  it '2d ago', ->
    expect(+DateParser('2d ago')).eql(+new Date(2011, 9, 13))
