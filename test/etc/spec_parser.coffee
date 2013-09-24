require('../setup')

describe 'SpecParser', ->
  SpecParser = require('../../lib/spec_parser')

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

  it 'time shorthand', ->
    expect(SpecParser('hello world 3am')).eql
      type: 'task'
      project: 'hello'
      task: 'world'
      date: new Date(2010, 9, 15, 3, 0)

  it 'time at beginning', ->
    expect(SpecParser('3:00am hello world')).eql
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

  describe 'mode: break', ->
    it 'reason', ->
      expect(SpecParser('hello world', mode: 'break')).eql
        type: 'break'
        reason: 'hello world'
        date: new Date(2010, 9, 15, 12, 0)

    it 'reason, time', ->
      expect(SpecParser('hello world 11:00am', mode: 'break')).eql
        type: 'break'
        reason: 'hello world'
        date: new Date(2010, 9, 15, 11, 0)

    it 'time only', ->
      expect(SpecParser('11:00am', mode: 'break')).eql
        type: 'break'
        reason: null
        date: new Date(2010, 9, 15, 11, 0)

    it 'empty', ->
      expect(SpecParser('', mode: 'break')).eql
        type: 'break'
        reason: null
        date: new Date(2010, 9, 15, 12, 0)

  it 'empty', ->
    expect(SpecParser('')).be.undefined
