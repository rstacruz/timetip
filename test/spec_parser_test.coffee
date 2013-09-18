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
