require('./setup')

describe 'SpecParser', ->
  SpecParser = require('../lib/spec_parser')

  beforeEach ->
    sinon.useFakeTimers +new Date(2010, 9, 15, 12, 0)

  it 'project', ->
    expect(SpecParser('hello')).eql
      type: 'task'
      project: 'hello'
      task: null
      date: new Date(2010, 9, 15, 12, 0)

  it 'project, task', ->
    expect(SpecParser('hello world')).eql
      type: 'task'
      project: 'hello'
      task: 'world'
      date: new Date(2010, 9, 15, 12, 0)

  it 'project, task, time', ->
    expect(SpecParser('hello world 3:00am')).eql
      type: 'task'
      project: 'hello'
      task: 'world'
      date: new Date(2010, 9, 15, 3, 0)

  it '3 minutes ago', ->
    expect(SpecParser('hello world 3 minutes ago')).eql
      type: 'task'
      project: 'hello'
      task: 'world'
      date: new Date(2010, 9, 15, 11, 57)

  it '3 mins ago', ->
    expect(SpecParser('hello world 3 mins ago')).eql
      type: 'task'
      project: 'hello'
      task: 'world'
      date: new Date(2010, 9, 15, 11, 57)

  it '3m ago', ->
    expect(SpecParser('hello world 3m ago')).eql
      type: 'task'
      project: 'hello'
      task: 'world'
      date: new Date(2010, 9, 15, 11, 57)

  it '3h 3m ago', ->
    expect(SpecParser('hello world 4h ago')).eql
      type: 'task'
      project: 'hello'
      task: 'world'
      date: new Date(2010, 9, 15, 8, 0)

  it 'empty', ->
    expect(SpecParser('')).be.undefined
